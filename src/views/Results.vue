<template>
    <div class="resultsContainer">
        <div class="content">
            <h1>Results!</h1>
            <h2>{{winners}}</h2>
            <h2>{{lives}}</h2>
            
            <p v-if="deadPlayers.length >= 1">Players Out!</p>
            <p v-for="(player,index) in deadPlayers" :key="index">{{player}}</p>

            <div class="displayResults">
                <div class="displayContainer" 
                v-for="(choice, index) in choiceNames"
                :key="index">
                    <div class="option"
                    :style="{'background-image': 'url(' + require(`@/assets/img/icons/${choiceNames[index]}.svg`) + ')'}"
                    ></div>
                    <div class="players">
                        <p v-for="(player) in results[index].players"
                        :key="player.playerID">{{player.playerName}}</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>
<script>
import Footer from '@/components/Footer.vue'

import db from '@/firebase/init.js'

import firebase from 'firebase'

export default {
    components: {
        Footer
    },
    props: ['playerID', 'players'],
    data(){
        return {
            choiceNames: ['ninja', 'shotgun', 'bear'],

            results: [
                {name: 'ninja', players: []},
                {name: 'shotgun', players: []},
                {name: 'bear', players: []}
                ],

                winners: null,
                lives: null,
                deadPlayers: [],

                
                ninja: [],
                shotgun: [],
                bear: [],

                currentPlayer: this.players.filter(player=>{
                    if(player.playerID == this.playerID){
                        return player
                    }
                }),

                playerLivesLeft: null

                
        }
    },
    methods: {
       
        removeLife: function(input=null){
            // 1) all players pick different - but there is only 1 of each type
            if(input == null & this.ninja.length == 1 && this.shotgun.length == 1 && this.bear.length == 1){
                input = this.players,
                this.winners = 'No Winner';
                this.lives = 'Eveyone lost a life!'
            }
            // 2) all players pick different - but only one is picked by a single person
            else if(input == null){
            //    ODD ONE OUT ?
                this.results.forEach(choices => {
                    if(choices.players.length == 1){
                        // this returns an array of objects, we need it to be an array of objects so the updateDB function can use forEach
                        input = choices.players
                        // print to players the result
                        this.lives = `${input[0].playerName} was the odd one out!`
                        this.winners = `${input[0].playerName} lost a life!`
                    }
                })
            }
            // 3) mutliple picked by multiple players
            else if(input == null){
                // PLAYERS IS A PROP OF ALL PLAYERS ENTERING THE RESULTS PAGE - this is possible to break logic if players is ever removed
                input = this.players // << this might be breaking testing due to it not updating the database? 
                this.lives = `all players lost a life!`
            }

            //4) there is only one winner - input == to the losing choice and passed to updateDB 
            
            // has anyone lost all their lives?

            // update DB - pass input
            this.updateDB(input)
            // update DB - null all choices again <<< otherwise this will cause an infinite loop
            this.nullPlayers()
            // Reroute page after 10 seconds - 
            setTimeout(()=>{
                this.reroute_page()
            },10000)
           
        },

        reroute_page: function(){
            // re route to the choice page again
            
                this.$router.push({
                    name: 'ChoiseUI',
                    params: {
                        playerName: this.currentPlayer[0].playerName,
                        gameID: this.currentPlayer[0].gameID,
                        playerID: this.playerID,
                        playerLivesLeft: this.playerLivesLeft
                    }
                })
           
        },

        deletePlayer: function(playerID){
            console.log(playerID)
        },
        
        
        updateDB: function(playerRecord){
            console.log('Update DB Ran -- start')


            playerRecord.forEach((record)=>{
                // display to UI that player is OUT! 
                 if(record.playerLives == 0){
                     this.deadPlayers.push(record.playerName)
                 }

                db.collection('gameRecords')
                .where('playerID', '==', record.playerID).get().then(docs=>{
                    
                    docs.forEach(doc=>{
                        // update the amount of lives the player has on the front end to pass to router
                        if(doc.data().playerLives == record.playerLives){
                            this.playerLivesLeft = doc.data().playerLives -1;
                            // display who lost a lift

                        }
                        // get the players document ID
                        let docID = doc.id
                        // update the players record in firebase removeing one life
                        db.collection('gameRecords').doc(docID).update({
                            playerLives: firebase.firestore.FieldValue.increment(-1)
                        })
                    })
                })
            })
            console.log('Update DB Ran -- end')     
        },

        nullPlayers: function(){
            console.log('NULL PLAYERS')
            // reset all the players choices back to null - this prevents auto re-routing from Choices page
            db.collection("gameRecords")
            .where('gameID', '==', this.currentPlayer[0].gameID).get().then(docs=>{
                docs.forEach(doc=>{
                    // find the docs name ID
                    let docID = doc.id
                    console.log('NULL HAS STARTED')
                    // set the docs playerChoice to null && minus a life
                    db.collection('gameRecords').doc(docID).update({
                        playerChoice: null,
                    })
                })
            })
        }
    },
    created(){
        
       
    //    filter the player choices and put them into the global scoped
    //    Ninja, ShotGun, Bear
        this.players.forEach(playerDetails => {
           
            if(playerDetails.playerChoice == 'ninja'){
                this.results[0].players.push(playerDetails)
                this.ninja = this.results[0].players;
                
            } else if (playerDetails.playerChoice == 'shotgun'){
                this.results[1].players.push(playerDetails)
                this.shotgun = this.results[1].players;
                
            } else if (playerDetails.playerChoice == 'bear'){
                this.results[2].players.push(playerDetails)
                this.bear = this.results[2].players;
                
            }
        })

        // IS there one of each option picked by the players?
        this.ninja.length >= 1
        && 
        this.shotgun.length >= 1 
        &&
        this.bear.length >= 1
        ?
        // callback function that returns one player or all players
        (this.removeLife())
        :
        // ninja vs shotgun - ninja wins
        (this.ninja.length >= 1 && this.shotgun.length >= 1 ?
        this.removeLife(this.shotgun)
        :
        // bear vs ninja - bear wins
        this.bear.length >= 1 && this.ninja.length >=1 ? 
        this.removeLife(this.ninja)
        :
        // shotgun vs bear - bear wins
        this.shotgun.length >= 1 && this.bear.length >= 1 ? 
        this.removeLife(this.bear) 
        :
        null // <<< empty as all conditions have been met
        )
        
    }
    
}
</script>
<style lang="scss">

  $base-grey: #707070;
  $base-orange: #FFC400;
    
        .resultsContainer{
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 100vh;

            .content{
                min-height: 100vh;
                flex: 1;

                h1{
                    font-family: lemonMilk;
                    color: $base-orange;
                    margin-top: 10vh;
                }
                h2 {
                    font-family: lemonMilk;
                    color: $base-orange;
                }

                .displayResults{
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    align-items: center;
                    .displayContainer {
                        display: flex;
                        flex-direction: row;
                        width: 80%;
                        align-items: center;
                        margin: 25px 0;
                    }
                    .option {
                        width: 100px;
                        height: 100px;
                        margin-right: 10px;
                        background-position: center;
                        background-size: contain;
                        background-repeat: no-repeat;
                        width: 50%;
                    }
                    .players{
                        width: 50%;
                        p{
                            font-family: lemonMilk;
                            color: #FFC400;
                            text-align: left;
                            font-size: 1.4em;
                            text-align: center;
                        }
                    }
                }
            }
        }
    
</style>