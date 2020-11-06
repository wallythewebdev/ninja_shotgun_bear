<template>
    <div class="winnerContainer">
        <div class="content">
            <h1>WINNER!</h1>
            <h2 class="winnerName">{{playerID}}</h2>
            <img src="@/assets/img/icons/bear.svg" alt="winners choice">
            
        <div class="playAgain">
            <button @click="playAgain">PLAY<br>AGAIN</button>
        </div>
        </div>
        
        <Footer/>
    </div>
</template>
<script>
import Footer from '@/components/Footer.vue'
export default {
    components: {
        Footer
    },
    props: {
        playerID: String,
        playerChoice: String,
        players: Object
    },
    data(){
        return {
            choiseNames: ['ninja', 'shotgun', 'bear']
        }
    },
    created(){
        
    },
    methods: {
        playAgain(){
            console.log('restart');
            this.$router.push({name: 'Create'})
        }
    }
    
}
</script>
<style lang="scss">

 $base-grey: #707070;
  $base-orange: #FFC400;


    $tablet: "only screen and (min-width : 720px)";
    $desktop: "only screen and (min-width : 1280px)";
    $lrg_desktop: "only screen and (min-width : 1920px)";


    .winnerContainer{
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        max-height: 100vh;

        // universal style -
        font-family: lemonMilk;
        .content{
            flex-grow: 1;
            position: relative;
            // style for the winner

            // page title i.e. WINNER!
            h1{
                font-size: 3rem;
                color: $base-grey;
                background: $base-orange;
            }

            h2 {
                    font-size: 2.5rem;
                    width: 80%;
                    padding: 10px;
                    text-align: center;
                    color: #FFC400;
                    background: #707070;
                    transform: rotate(-5deg);
                    margin: 4rem auto 0;
            }

            img {
                width: 10rem;
                margin-top: 25px;
            }
        }

        div.playAgain {
            

            button {
                    font-size: 2rem;
                    background: #FFC400;
                    color: #707070;
                    font-family: LemonMilk;
                    border: none;
                    height: 10rem;
                    width: 10rem;
                    margin: 25px 0;
                    font-weight: bold;
                    line-height: 2rem;
                    border-radius: 50%;
            }
        }
    }
</style>