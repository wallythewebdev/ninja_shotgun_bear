<template>
    <div class="footerContainer">
        <div class="copyRight">
            <p id="copyright-text">copy-right 2020</p>
            <a href="http://wallythewebdev.com/">
                <img src="../assets/img/wallyLogos/light-logo.png" alt="wally the web dev">
            </a>
        </div>

    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss">
    $base-grey: #707070;
  $base-orange: #FFC400;


    .footerContainer {
        width: 100%;
        
        .copyRight{
            display: flex;
            flex-direction: row;

            color: $base-orange;
            background: $base-grey;

            justify-content: center;
            align-items: center;

            padding: 20px 0;

            p#copyright-text {
                font-family: LemonMilk;
                margin: 0 15px;
            }

            a{
                margin: 0 15px;
                img{
                    width: 150px;
                }
            }
        }
    }

</style>