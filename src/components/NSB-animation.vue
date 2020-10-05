<template>
  
    <div class="NSB-animation">
      <ul>
        <li v-for="(item, index) in icons" :key="index">
          <img :src="require(`../assets/img/icons/${item}.svg`)" alt="`icon of a ${item}`">
        </li>
      </ul>
    </div>
   
</template>
<script>
// This is the scrolling aniation, showing each icon moving across the page - 
// Another way to do this would be to just have a svg of the icons
// add two of them togeter and transform its possition 100% then reset
// the second option might be more performant - but is a enchasment not MVP 
export default {
    data(){
        return{
            icons: ['ninja', 'shotgun', 'bear','ninja', 'shotgun', 'bear']
        }
    } 
}
</script>
<style lang="scss">
    .NSB-animation {
        overflow: hidden;

        ul{
                display: flex;
                flex-direction: row;
                overflow: hidden;
                list-style: none;
                padding: 0;
                margin: 0;
                justify-content: space-between;
                width: 200%;
                transform: translateX(1.3333%);
                margin-top: 25%;

                animation: hoz-scroll 3s infinite cubic-bezier(0,.53,1,.47);

            li {
                width: 10%;
                overflow: hidden;

                
            }
        }
        
    }

                @keyframes hoz-scroll {
                    0%{
                        transform: translateX(1.33333%);
                    }
                    100%{
                        transform: translateX(-52.6667%);
                    }
                }
</style>