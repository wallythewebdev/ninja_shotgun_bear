<template>
<div class="choiceUI">
    <div class="gameCode">
        <p><span class="info-text">game id: </span>{{gameID}}</p>
    </div>
    <div class="choiseContainer">
        <div class="livesLeft">
            <p class="game_info">Lives Left: </p><div class="lives" v-for="(lives, index) in livesLeft" :key="index"></div>
        </div>
        <div class="playerNames">
            <p class="game_info">Player Names:</p>
            <ul>
                <div v-for="(player, index) in gameData" :key="index" class="playerNameContainer">
                    <li :class="gameData[index].lastLife && lastLife">{{player.playerName}}</li>
                    <!-- if player at index of gameData.playerchoice !== null  -->
                    <div 
                    class="playerReady"
                    :class="gameData[index].playerChoice !== null
                    ? 'playerActive'
                    : null"
                    >
                    </div>
                </div>
            </ul>
        </div>
        <div class="playerChoise">
            <p>What are you today?</p>
            <div class="choices">
                <!-- TBA - prevent click unless two people are playing -->
                <button 
                v-for="(choice, index) in choiseNames" :key="index"
                @click.once="playerPick(index, $event)"
                :style="{ backgroundImage: 'url(' + require(`@/assets/img/icons/${choiseNames[index]}.svg`) + ')' }"></button>

            </div>
        </div>
    </div>
    <Footer />
</div>
    
</template>
<script>
import Footer from '@/components/Footer.vue'

import db from '@/firebase/init.js'

// this is to use the Vue.set function to watch for components being updated
import Vue from 'vue'
import uniqueID from 'uniqid'

export default {
    components: {
        Footer
    },
    props: {
        playerName: String,
        gameID: String,
        playerID: String,
        playerLivesLeft: Number
    },
    data(){
        return {
            livesLeft: this.playerLivesLeft,

            playerNames: null, 

            playerChoise: null,

            gameName: null,

            choiseNames: ['ninja', 'shotgun', 'bear'],

            gameData: [],

            playerNumber: this.playerID

        }
    },
        created(){
        // 1) update gameName with prop value 
        this.gameName = this.gameID;

        
        db.collection("gameRecords").where('gameID', '==', this.gameName)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    // if modified then update
                    // console.log(change) <<< FOR TESTING
                    if(change.type == 'modified'){
                        // make a ref of the Game ID that was updated
                        let changeID = change.doc.data().playerID;
                        // find where that objs index is in the local array to update it 
                        let pos = this.gameData.findIndex(obj => {
                            return obj.playerID == changeID;
                        });
                        

                        Vue.set(this.gameData, pos, change.doc.data())

                        // If player lives have dropped below 2 - say last life!
                        if(change.doc.data().playerLives < 2){
                            
                        }

                        if(change.doc.data().playerLives == 0){
                            // delete from backend
                            db.collection('gameRecords').doc(change.doc.id).delete()
                        }
                        
                        return
                    } else if(change.type == 'added'){
                        this.gameData.push(change.doc.data())
                        return
                    } else if(change.type == 'removed'){
                        // need to remove the player from the game
                        let pos = this.gameData.findIndex(obj => {
                            return obj.playerID == change.doc.data().playerID
                        });
                        // delete from front end
                        Vue.delete(this.gameData, pos)
                        
                    }
                })
            })

    
       
    },
    methods: {
        playerPick(index_ofChoice, event){

             // add / remove the highlighting css class
            // remove any active class on other buttons
            document.querySelectorAll('.choices button').forEach(item=>{
                item.classList.remove('clicked')
            })
            // on the clicked button add the active class
            event.target.classList.toggle('clicked')
            // if the choice is the same as the already clicked choice set it back to null
            if(this.playerChoise == this.choiseNames[index_ofChoice]){
                this.playerChoise = null;
                event.target.classList.remove('clicked')
            } else {
                 // this triggers the watcher below - to update the database choice
                this.playerChoise = this.choiseNames[index_ofChoice]
            }
        }
    },
    watch: {
        // when player has made choice - update the DB 
        playerChoise: function(){
            let docName;
            
            // 1) Query firebase to find the doc that has the PlayerID 
            // This is going to be passed as a var later on, currently hard coded for testing
            db.collection('gameRecords')
            .where('playerID', '==', this.playerID)
            // .update({playerChoice: this.playerChoise})
            .get()
            // 2) update the docName var, with the doc id number
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    docName = doc.id
                })
            })
            // 3) now we have the doc name we can update the docs data
            .then(()=>{
                db.collection('gameRecords').doc(docName).update({
                    playerChoice: this.playerChoise
                })
            })
        },

        // watch to see how many people have made a choice so far
        gameData: function(){
            let players = this.gameData; // Number of players
            let playerID = this.playerNumber // Get the unique player number
            let readyPlayers = []; // empty to record amount of pagers
            console.log(`amount of players ${players.length}`) // testing
            // if the player has made their choice - put them into the ready players array
            this.gameData.forEach(player=>{
                if(player.playerChoice !== null){
                    readyPlayers.push(player)
                }
            })
            console.log(readyPlayers) // test
            // if all players are ready then do somthing <<< RE_ROUTE THE PAGE >>>
            // but there should atleast be - two players
            // **inprovment - there should also be a waiting point for players to join the game
            if(readyPlayers.length == players.length && players.length >= 2){
                console.log('Players are ready!')
                this.$router.push({
                    name: 'Results',
                    params: {
                        playerID: this.playerNumber,
                        players: this.gameData
                    }
                })
            }
            // if all players are deleted then leave back to menu
            if(this.gameData.length == 0){
                this.$router.push({
                    name: 'Create'
                })
            }
        }
    }

}
</script>
<style lang="scss">

    $base-grey: #707070;
  $base-orange: #FFC400;

//   UNIVERSAL

.game_info {
    font-size: 0.7em;
    color: $base-orange;
    font-family: lemonMilk;
}

.choiceUI{
    display: flex;
    flex: 1;
    flex-direction: column;

    .gameCode{
            background: #FFC400;
            color: #707070;
            height: 10vh;
            position: relative;
            width: 100%;
            font-family: lemonMilk;
            font-size: 1.5em;
        p {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 10px;
        }
        .info-text{
            font-size: 0.75em;
        }
    }

    .choiseContainer {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        min-height: 90vh;
        .livesLeft {
            width: 80%;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 25px auto;
            .lives {
                    width: 25px;
                    height: 25px;
                    background: #FFC400;
                    border-radius: 50%;
                    margin: 0 15px;
            }
        }

        .playerNames{
            display: flex;
            flex-direction: column;
            align-items: self-end;
            text-align: left;
            width: 80%;
            margin: 0 auto;
            ul{
                list-style: none;
                padding: 0;
                width: 100%;
                .playerNameContainer{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    width: 75%;
                    li {
                        font-family: lemonMilk;
                        color: $base-orange;
                        font-size: 1.3em;
                    }
                    .playerReady{
                        height: 25px;
                        width: 25px;
                        background-color: grey;
                        border-radius: 50%;
                        transition: background-color 0.4s ease-in-out;
                    }   
                    .playerActive {
                        background-color: $base-orange;
                    }
                }
                
            }
        }

        .playerChoise {
            font-family: lemonMIlk;
            font-size: 1.2em;
            color: $base-orange;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 50px 0;

            .choices{
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-around;
                align-items: center;

                button{
                    height: 100px;
                    width: 100px;
                    border-radius: 50%;
                    background: white;
                    border: none;
                    margin-top: 25px;

                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;

                    cursor: pointer;

                    transition: 0.2s ease-in-out;
                }
                .clicked {
                    background: $base-orange;
                    height: 110px;
                    width: 110px;
                }
            }
        }
    }
}

</style>