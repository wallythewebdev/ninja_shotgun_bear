<template>
  <div class="button-container">
    <h3 @click="changePage(textvalue)">{{textvalue}}</h3>
  </div>
</template>
<script>
export default {
    props: {
      textvalue: String, 
      propGameName: String, 
      propPlayerName: String
    },
    data(){
        return{
            gameName: null,
            playerName: null,
            feedback: null
        }
    },
    methods:{
      changePage(route){
        let routeName = route
        if(route == 'back'){
          // console.log('back to prior page')
          return this.$router.go(-1)
        } else if (route == 'join game'){
          // console.log('choise from join')
          this.$router.push({name: 'ChoiseUI'})
          
        } else if (route == 'create game'){
          // console.log('choise from create')
          return this.$router.push({name: 'ChoiseUI'})
        }
        this.$router.push({name: `${routeName}`})
      }
    }
}
</script>
<style lang="scss">
  $base-grey: #707070;
  $base-orange: #FFC400;

  @mixin center-pos {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }


    .button-container{
        width: 40%;
        height: 10vh;
        position: relative;
        background: $base-orange;
        h3{
          font-family: lemonMilk;
          color: $base-grey;
          @include center-pos()
        }
    }
</style>

