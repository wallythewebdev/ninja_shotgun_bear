<template>
  <div class="create-game-container">
    <div class="gameUI">
      <hozAnimation />
        <div class="gameInput">
          <form @submit.prevent>
            <h2 class="gameCode">GAME CODE:</h2>
            <label for="gameID">-- Name your game --<br>if the name already exists you'll join that game (max 6 characters)</label>
            <input type="text" name="gameID" placeholder="6 digit code" maxlength="6" v-model="gameID">
            <p v-if="this.gameID_feedback" class="gameID_feedback">{{gameID_feedback}}</p>


            <!-- add max lengt to player name -->
            <h2 class="playerName">PLAYER NAME:</h2>
            <label for="playerName">be inventive, or, be boring.... <br>just don't lose! </label>
            <input type="text" name="playerName" placeholder="Mario" v-model="playerName" maxlength="15">
            <p v-if="this.playerName_feedback" class="playerName_feedback">{{playerName_feedback}}</p>

              <!-- textvalue is passed as a property to direct the ruoter - if Strings with spaces are used like in the case
              of Join game - you will need to concatinate them // ISSUE for github to be added -->
              <div class="formButtons">
                <button @click="createGame">create game</button>
                <button @click="back">back</button>
              </div>
          </form>
        </div>
    </div>
      <Footer />
  </div>
</template>
<script>
import hozAnimation from '@/components/NSB-animation.vue'
import Footer from '@/components/Footer.vue'
import GameButton from '@/components/Button.vue'

// import database

import db from '@/firebase/init'

// create a ID

import uniqueID from 'uniqid'

export default {
    components: {
      hozAnimation,
      Footer,
      GameButton
    },
    data(){
        return{
            icons: ['ninja', 'shotgun', 'bear'],

            gameID: '',
            playerName: '',

            gameID_feedback: null,
            playerName_feedback: null,

            playerID: null,

            docID: null,

            // data object to be passed to firestore
            fireObj: {

            }
        }
    },
    created(){
      let ref = db.collection('gameRecords');

      // generate a user code for the user to USE
      // use dependencie to create a ID so the player can be located in the DB
      this.playerID = uniqueID();

    },
    methods: {
      async createGame(){
        // 1) checks 2) create 3) re-route
        // check data has been entered correctly

        // 1) <<< has the player name and game name been created? 
        if(this.playerName != '' && this.gameID != ''){

          // 1A) if truthy, reset the feedback (doesnt check feedback just resets it) 
          this.gameID_feedback = null;
          this.playerName_feedback = null
          
          // 2) Take the user Data and use it to populate FIREBASE
          await db.collection('gameRecords').add({
            gameID: this.gameID,
            playerName: this.playerName,
            playerLives: 3,
            playerChoice: null,
            playerID: this.playerID,
            danager: false
          })

          // 2A) get the doc id of the user that has been generated - this will be used to update player records
          // Set the this.docID to be the firebase generated document id
          await db.collection('gameRecords')
          .where('playerID', '==',  this.playerID).get().then(snapshot=>{
            snapshot.forEach(data=>{
              this.docID = data.id
            })
          })

          // 3) route to the choose page, with the players name and game ID

          this.$router.push({name: 'ChoiseUI', params: {
            gameID: this.gameID,
            docID: this.docID, // to resolve issue#1
            playerName: this.playerName,
            playerID: this.playerID,
            playerLivesLeft: 3
          }})

        } else {
          // Add feedback for the player 
          this.gameID == '' ? this.gameID_feedback = 'create a name...' : null;
          this.playerName == '' ? this.playerName_feedback = 'Add your name....' : null
          
        }
      },
      back(){
        // move one stpe back in the router i.e. go back
        this.$router.go(-1)
      },
    }
   
}
</script>
<style lang="scss">

  $base-grey: #707070;
  $base-orange: #FFC400;

  .create-game-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    font-family: lemonMilk;
    text-align: left;
    .gameUI {
      flex: 1;

      .gameInput{

        // for use in smaller screens - 
        margin-bottom: 50px;
        form{
          display: flex;
          flex-direction: column;
          width: 90%;
          margin: 50px auto 0;

          color: $base-orange;

          h2{
                font-size: 2.3em;
          }
          label {
            margin: 5px 0;
          }
          input{
            background: $base-grey;
            color: $base-orange;
            border: none;
            font-size: 2.3em;
            text-align: center;
            font-family: lemonMilk;
            margin: 10px 0;
          }

          .formButtons{
            margin-top: 50px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            // Code for button height - this could be taken care of in button component? - use 
            // if else to see if button is tight fit or large padding ? 
            .button-container{
              height: 6vh;
              font-size: 1.35em;
            }

            // CREATE GAME BUTTON - 
            .button-container:nth-child(1){
              width: 50%;
              h3{
                text-align: center;
                width: 100%;  
                font-size: 1em; // << Style over rules the above 1.35 due to multipe words being used
              }
            }

            // BACK BUTTON 
            .button-container:nth-child(2){
              width: 45%;
              background: $base-grey;
              h3{
                text-align: center;
                width: 100%;
                color: $base-orange;
              }
            }
            
          }
        }
      }
    }
    hozAnimation{
      overflow: hidden;
    }


    Footer {
      
    }
  }
</style>

