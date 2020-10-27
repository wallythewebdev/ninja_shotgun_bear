<template>
    <div class="winnerContainer">
        <div class="content">
            <h1>WINNER!</h1>
            <h2 class="winnerName">{{playerID}}</h2>
            <img src="@/assets/img/icons/bear.svg" alt="winners choice">
        </div>
        <div>
            <button @click="playAgain">PLAY<br>AGAIN</button>
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

        // universal style -
        font-family: lemonMilk;
        .content{
            flex-grow: 1;
            // style for the winner

            // page title i.e. WINNER!
            h1{
                font-size: 15vw;
                color: $base-grey;
                background: $base-orange;
            }

            h2 {
                font-size: 10vw;
                width: 100%;
                text-align: center;
                color: $base-orange;
                background: $base-grey;
            }

            img {
                width: 25vw;
                margin-top: 25px;
            }
        }

        div {
            button {
                font-size: 10vw;
                background: $base-orange;
                color: $base-grey;
                font-family: LemonMilk;
                border: none;
                padding: 25px;
                margin: 25px;
            }
        }
    }
</style>