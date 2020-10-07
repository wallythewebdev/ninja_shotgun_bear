<template>
  <div class="home">
    <div class="content">
      <Title id="title"/>
      <div class="buttonContainer">
        <button @click="play()">PLAY!</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src

import Footer from '@/components/Footer.vue'
import Title from '@/components/Title.vue'
import GameButton from '@/components/Button.vue'

export default {
  name: 'Home',
  components: {
    Title,
    Footer,
    GameButton
  },
  data(){
    return{
      
    }
  },
  methods: {
    play(){
      this.$router.push({name: 'Create'})
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

  .home {
    .content {
      height: 100vh;
      position: relative;
      #title{
        @include center-pos();
      }
      .buttonContainer{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        
        width: 100%;

        @include center-pos();

        // cascading effect for moving below title logo: 

        top: 85%;

        button{
          font-family: lemonMilk;
          font-size: 1.7em;
          padding: 10px 20px;
          background: $base-orange;
          color: $base-grey;
          border: none
        }
      }
    }
    
  }
</style>
