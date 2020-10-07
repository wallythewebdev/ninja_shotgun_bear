<template>
    <div class="navDisplay">
        <div class="menu-option">
            <h2>RULES</h2>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Nav-menu'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    $tablet: "only screen and (min-width : 720px)";
    $desktop: "only screen and (min-width : 1280px)";
    $lrg_desktop: "only screen and (min-width : 1920px)";

    $base-grey: #707070;
  $base-orange: #FFC400;

  @mixin center-pos {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }


    .navDisplay{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 114px;  // footer height
        right: 0;

        background: $base-orange;
        color: $base-grey;

        z-index: 9;

        

        .menu-option{
            width: 80%;
            background: $base-grey;
            color: $base-orange;
            margin: 0 auto;
            height: 10vh;
            @include center-pos();
            h2{
                @include center-pos();
            }
        }
    }
</style>