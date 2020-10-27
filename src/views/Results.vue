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
    props: ['playerID', 'players', 'playerDocID'],
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
            // players picked the same choice
            if(input == 'same'){
                // reset
                this.winners = "You all picked the same! Next time be more original....."
                 // update player UI of lives on screen
                this.updateLives(this.playerDocID)
                // update DB - null all choices again <<< otherwise this will cause an infinite loop
                this.nullPlayers()
                // Reroute page after 10 seconds - 
                setTimeout(()=>{
                    this.reroute_page()
                },7000)
                return
            }
            // 1) all players pick different - but there is only 1 of each type
            if(input == null && this.ninja.length == 1 && this.shotgun.length == 1 && this.bear.length == 1){
                // this players details - not all player details
                // input = this.players,
                input = this.playerDocID

                this.winners = 'No Winner';
                this.lives = 'Eveyone lost a life!'
            }
            // 2) all players pick different - but only one is picked by a single person
            else if(input == null){
            //    ODD ONE OUT ?
            // what if there are multiple odd ones out? i.e. x2 ninja x1bear x1 shotgun
                this.results.forEach(choices => {
                    if(choices.players.length == 1 && choices.players[0].playerID == this.playerID){
                        // this returns an array of objects, we need it to be an array of objects so the updateDB function can use forEach
                        input = this.playerDocID
                        console.log(`odd one out playerID ${input}`) 
                        // print to players the result
                        this.lives = `${choices.players[0].playerName} was the odd one out!`
                        this.winners = `${choices.players[0].playerName} lost a life!`
                        // remove life from local storage
                        this.removeLifeLocal(-1)
                    }
                })
            }
            // 3) mutliple picked by multiple players
            else if(input == null){
                // PLAYERS IS A PROP OF ALL PLAYERS ENTERING THE RESULTS PAGE - this is possible to break logic if players is ever removed
                input = this.playerDocID // issue#1 
                this.lives = `all players lost a life!`
                // remove life from local storage
                        this.removeLifeLocal(-1)
            }

           
        //    Update the UI for the players to see who won!

            input == 'shotgun' ? this.winners = 'NINJA WINS!' : 
            input == 'ninja' ? this.winners = 'BEAR WINS!' :
            input == 'bear' ? this.winners = 'SHOTGUN WINS!' :
            null

            if(input == this.currentPlayer[0].playerChoice){
                input = this.playerDocID
            } else if (input !== this.currentPlayer[0].playerChoice){
                // update player UI of lives on screen
                this.updateLives(this.playerDocID)
                // update DB - null all choices again <<< otherwise this will cause an infinite loop
                this.nullPlayers()
                // Reroute page after 10 seconds - 
                setTimeout(()=>{
                    this.reroute_page()
                },7000)
                return
            }

            // remove life from local storage
            this.removeLifeLocal(-1)
            // update DB - pass input
            this.updateDB(input)
            // update UI field of lives left
            this.updateLives(input)
            // update DB - null all choices again <<< otherwise this will cause an infinite loop
            this.nullPlayers()
            // Reroute page after 10 seconds - 
            setTimeout(()=>{
                this.reroute_page()
            },7000)
           
        },

        reroute_page: function(){
            // re route to the choice page again
            
                this.$router.push({
                    name: 'ChoiseUI',
                    params: {
                        playerName: this.currentPlayer[0].playerName,
                        gameID: this.currentPlayer[0].gameID,
                        playerID: this.playerID,
                        playerLivesLeft: this.playerLivesLeft,
                        docID: this.playerDocID
                    }
                })
           
        },
        
        updateDB: async function(playerRecord){
            /*
            argument is the firebase docuemnt id of the player record that is being edited
            function, queires the firebase DB and removes a life
            for future use this function could be edited to also give lives
            */    
            await db.collection('gameRecords').doc(playerRecord).update({
                // remove a life with -1 / can also be 1 to give life
                playerLives: firebase.firestore.FieldValue.increment(-1)
            });

        },

        updateLives: async function(playerRecord){
            /*
            functions argument is the firebase document id of the player record
            function queries firebase to find the current lives left of the player and 
            sets the value of this.playerLivesLeft = to that
            this.playerLivesLeft is a prop that is passed back to the choice screen
            */ 
            await db.collection('gameRecords').doc(playerRecord)
            .get()
            .then(doc=>{
                this.playerLivesLeft = doc.data().playerLives
                console.log(this.playerLives)
            })
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
        },

        removeLifeLocal: function(value){
            // get data - edit it - push back to local storage
            let playerObj = JSON.parse(window.localStorage.getItem('NSB_playerInfo'));
            // prevent if life = 0
            if(playerObj.playerLivesLeft == 0){
                return
            } else {
                playerObj.playerLivesLeft += value;
                window.localStorage.setItem('NSB_playerInfo', JSON.stringify(playerObj))
            }
        }
    },

    created(){

        // make local storage doc avalible & if gameData null ? set to local version
        let localPlayerDoc = JSON.parse(window.localStorage.getItem('NSB_playerInfo'))
        this.players == null || this.players == undefined ? (this.players = localPlayerDoc.gameData) : null
        
       console.log(`players doc id is ${this.playerDocID}`)
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

        // players picked the same choices?
        this.ninja.length >1 && this.shotgun.length == 0 && this.bear.length == 0 ? 
        this.removeLife('same') :
        this.ninja.length == 0 && this.shotgun.length >1 && this.bear.length == 0 ?
        this.removeLife('same') :
        this.ninja.length == 0 && this.shotgun.length == 0 && this.bear.length > 1 ?
        this.removeLife('same') :
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
        this.removeLife('shotgun')
        :
        // bear vs ninja - bear wins
        this.bear.length >= 1 && this.ninja.length >=1 ? 
        this.removeLife('ninja')
        :
        // shotgun vs bear - shotgun wins
        this.shotgun.length >= 1 && this.bear.length >= 1 ? 
        this.removeLife('bear') 
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