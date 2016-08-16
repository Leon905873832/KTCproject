<style type="text/css">
    @-webkit-keyframes slideInDown {
      from {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
        visibility: visible;
      }

      to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes slideInDown {
      from {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
        visibility: visible;
      }

      to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }
    }

    @-webkit-keyframes slideOutUp {
      from {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }

      to {
        visibility: hidden;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
      }
    }

    @keyframes slideOutUp {
      from {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }

      to {
        visibility: hidden;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
      }
    }

    .formTop-transition {
        -webkit-animation-duration: 0.4s;
        animation-duration: 0.4s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .formTop-enter {
      -webkit-animation-name: slideInDown;
      animation-name: slideInDown;
    }

    .formTop-leave {
      -webkit-animation-name: slideOutUp;
      animation-name: slideOutUp;
    }
    .promot {
      z-index: 10700;
    }
</style>
<template>
    <div class="loading" v-show="promot.isLoad">
        <img src="../images/loading.gif" alt="正在发送数据"/>
    </div>
    <div class="promot" v-show="promot.promot" transition="formTop">{{promot.promotMsg}}</div>
</template>
<script type="text/javascript">
    module.exports = {
        props: ['promot']
    }
</script>