<template>
  <div id="app">
    <div id="nav" @click="navShow = !navShow">
      <p class="menu-title-txt">menu</p>
    </div>
      <!-- <div class="navOverlay">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div> -->
      <transition name="nav-body">
        <NavMenu v-if="this.navShow" />
      </transition>
      
    <router-view/>
  </div>
</template>
<script>
import NavMenu from '@/components/Nav-menu.vue'
export default {
  components:{
    NavMenu
  },
  data(){
    return{
      navShow: false
    }
  }
}
</script>

<style lang="scss">
// global vars && fonts

* {
  margin: 0;
  pad: 0;
  box-sizing: border-box;
}

// fonts
   @font-face {
    font-family: lemonMilk;
    src: url('./assets/fonts/LemonMilk.otf') format('opentype');
  }

  $base-grey: #707070;
  $base-orange: #FFC400;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  // my rules
  // FONTS IMPORTED
    @font-face {
    font-family: lemonMilk;
    src: url('./assets/fonts/LemonMilk.otf') format('opentype');
  }

    @font-face {
    font-family: moon;
    src: url('assets/fonts/Moon2.otf') format(OpenType) }


    // positioning - for nav

    position: relative;

    // transition

    .nav-body-enter-active, .fade-leave-active {
    transition: opacity .5s;
      #nav{
        background: $base-grey;
        color: $base-orange;
      }
    }
    .nav-body-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
};

#nav {

  font-family: lemonMilk;

  position: absolute;
  top: 10px;
  left: calc(100% - 60px);

  width: 50px;
  height: 50px;

  background: $base-orange;
  color: $base-grey;

  border-radius: 50%;

  z-index: 10;

// FOR THE ROUTER LINKS BELOW!
  // a {
  //   font-weight: bold;
  //   color: #2c3e50;

  //   &.router-link-exact-active {
  //     color: #42b983;
  //   }
  // }

  .menu-title-txt{
    position: absolute;
    font-size: 0.8em;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
