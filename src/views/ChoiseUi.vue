<template>
<div class="choiceUI">
    <!-- menu button to be clicked -->
    <div id="nav" @click="navShow = !navShow">
      <p class="menu-title-txt">menu</p>
    </div>
    <!-- menu when its being shown on page -->
      <transition name="nav-body">
        <NavMenu v-if="this.navShow" />
      </transition>

    <div class="gameCode">
        <p><span class="info-text">game id: </span>{{gameID}}</p>
    </div>
    <div class="choiseContainer">
        <div class="livesLeft">
            <p class="game_info">Lives Left: </p>
            <div class="lives" v-for="(lives, index) in livesLeft" :key="index"></div>
        </div>
        <div class="playerNames">
            <p class="game_info">Player Names:</p>
            <ul>
                <div v-for="(player, index) in gameData" :key="index" class="playerNameContainer">
                    <!-- if player dead ? show with strike, else show normal -->
                    <strike v-if="player.playerLives == 0"><li>{{player.playerName}}</li></strike>
                    <li v-else :class="gameData[index].danger && lastLife">{{player.playerName}}</li>
                    <!-- if player at index of gameData.playerchoice !== null  -->
                    <div 
                    class="playerReady" v-if="player.playerLives !== 0"
                    :class="gameData[index].playerChoice !== null
                    ? 'playerActive'
                    : null"
                    >
                    </div>
                </div>
            </ul>
        </div>
        <div class="playerChoice">
            <p>{{choiceText}}</p>
            <!-- if player out of lives dont show choices for them moving forward -->
            <div v-if="this.livesLeft != 0" class="choices">
                <!-- TBA - prevent click unless two people are playing -->
                <button 
                v-for="(choice, index) in choiseNames" :key="index"
                @click="playerPick(index, $event)"
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

import NavMenu from '@/components/Nav-menu.vue'

// this is to use the Vue.set function to watch for components being updated
import Vue from 'vue'
import uniqueID from 'uniqid'

export default {
    components: {
        Footer,
        NavMenu
    },
    props: {
        playerName: String,
        gameID: String,
        playerID: String,
        playerLivesLeft: Number,
        docID: String
    },
    data(){
        return {
            // for nav to be triggered into showing
            navShow: false,

            livesLeft: this.playerLivesLeft,

            playerChoice: null,

            gameName: null,

            choiseNames: ['ninja', 'shotgun', 'bear'],

            gameData: [],

            playerNumber: this.playerID,

            choiceText: 'What are you today???',

            winner: null

        }
    },
        created(){
        // pass local storage to required fields to keep player logged in issue#2

        let playerObj = JSON.parse(window.localStorage.getItem('NSB_playerInfo'))
        this.playerName = playerObj.playerName
        this.docID = playerObj.docID
        this.gameID = playerObj.gameID
        this.playerID = playerObj.playerID
        this.livesLeft = playerObj.playerLivesLeft


        // 1) update gameName with prop value 
        this.gameName = this.gameID

        
        // create event listener for the DB
        db.collection("gameRecords").where('gameID', '==', this.gameName)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    // if modified then update
                    if(change.type == 'modified'){
                        // make a ref of the Game ID that was updated
                        let changeID = change.doc.data().playerID;
                        // find where that objs index is in the local array to update it 
                        let pos = this.gameData.findIndex(obj => {
                            return obj.playerID == changeID;
                        });

                        

                        Vue.set(this.gameData, pos, change.doc.data())

                        // PLAYER LAST LIFE (< 2)
                        if(change.doc.data().playerLives < 2){
                            // give a warning to the player?
                            // chnage the font of the player and make larger -
                            this.gameData[pos].danger = true   
                        }

                        // PLAYER LIVES == 0
                        if(change.doc.data().playerLives == 0){
                           
                            
                            // Vue.delete(this.gameData, pos)

                        }
                        
                        
                    } else if(change.type == 'added'){
                        this.gameData.push(change.doc.data())
                       
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

            // if player has no lives then update the choiceText to below:
            if(this.livesLeft == 0){
                this.choiceText = 'Sadly.... You lost, but there is always next time....'
            }
       
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
            if(this.playerChoice == this.choiseNames[index_ofChoice]){
                this.playerChoice = null;
                event.target.classList.remove('clicked')
            } else {
                 // this triggers the watcher below - to update the database choice
                this.playerChoice = this.choiseNames[index_ofChoice]
            }
        },
    },
    watch: {

        // when player has made choice - update the DB with that choice
        playerChoice: function(){
            
        //    update db record with the String from player choice - 
        // DEPENDECIE: prop: docID <<<<

            db.collection('gameRecords').doc(this.docID).update({
                playerChoice: this.playerChoice
            })
        },

        // watch to see how many people have made a choice so far
        gameData: function(){
            // 1) DEFINE DATA
            let players = this.gameData; // Number of players
            let playerID = this.playerNumber // Get the unique player number
            let readyPlayers = []; // empty to record amount of pagers
            let alivePlayers = []; // <<< to check length against valid players who are still in the game

            // 2) Assign ready players - && issue#3 -> assign alive players
            // if the player has made their choice - put them into the ready players array 
            this.gameData.forEach((player, index)=>{
                // 1) assign alive player
                if(player.playerLives !== 0){
                        alivePlayers.push(player)
                    }
                // 2) assign player choices
                if(player.playerChoice !== null){
                    readyPlayers.push(player)
                }
            })


            // 3) Conditions for rerouting
            // if all players are ready then do somthing <<< RE_ROUTE THE PAGE >>> -- issue#3 (if all player are ready that have lives!)
            // but there should atleast be - two players

            // **inprovment - there should also be a waiting point for players to join the game
            if(readyPlayers.length == alivePlayers.length && alivePlayers.length >= 2){
                
                // push game data to local storage issue#2
                let localPlayer = JSON.parse(window.localStorage.getItem('NSB_playerInfo'));
                localPlayer.gameData = this.gameData
                window.localStorage.setItem('NSB_playerInfo', JSON.stringify(localPlayer))

                this.$router.push({
                    name: 'Results',
                    params: {
                        playerID: this.playerNumber,
                        players: this.gameData, //Issue#2 << this needs to be passed to next page otherwise winning player will become stuck
                        playerDocID: this.docID
                    }
                })
            }

            // debugger
            // issue#3 reroute if there is a winner
            if(alivePlayers.length == 1 && players.length > 1){
                
                this.$router.push({
                    name: 'Winner',
                    params: {
                        playerID: alivePlayers[0].playerName,
                        playerChoice: alivePlayers[0].playerChoice,
                        players
                    }
                })
            }
            // if all players are deleted then leave back to menu
            if(this.gameData.length == 0){
                this.$router.push({
                    name: 'Create'
                })
            }
        },

        // #misc - watching the lives left go to Zero is not being triggered ? not sure why 
        // livesLeft: function(){
        //     // if player has no lives left!
        //     if(this.livesLeft == 0){
        //         console.log('NO LIVES')
        //         this.choiceText = 'Sadly.... You lost, but there is always next time....'

        //     }
        // }
    }

}
</script>
<style lang="scss">

    $base-grey: #707070;
  $base-orange: #FFC400;


    $tablet: "only screen and (min-width : 720px)";
    $desktop: "only screen and (min-width : 1280px)";
    $lrg_desktop: "only screen and (min-width : 1920px)";

//   UNIVERSAL

// last life
.lastLife{

}

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
            // keep visible when nav is open
            z-index: 9;
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
        @media #{$desktop}{
            width: 50%;
            margin: 0 auto;  // << center
        }
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
                    .lastLife{
                        color: red;
                        font-size: 1.5em;
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

        .playerChoice {
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