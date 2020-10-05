<template>
    <div class="titleContainer">
        <div class="text">
            <h1>Ninja
                <br>
                Shotgun
                <br>
                Bear
            </h1>
        </div>
        <div class="icons">
            <div class="icon" v-for="(item, index) in icons" :key="index">
                <img :src="require(`../assets/img/icons/${item}.svg`)" alt="`icon of a ${item}`">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            icons: ['ninja', 'shotgun', 'bear']
        }
    }
}
</script>
<style lang="scss">

  $base-grey: #707070;
  $base-orange: #FFC400;

.titleContainer {
    .text {
        h1 {
            font-family: lemonMilk;
            color: $base-grey;

            text-align: left;
            font-size: 3.5em;

            line-height: 48px;
            font-weight: normal;
        }
    }
    .icons{
            margin: 10px 0;
            display: flex;
            flex-direction: row;
        .icon{
            margin-right: 10px;
            img{
                width: 50px;
            }
        }
    }
}

</style>