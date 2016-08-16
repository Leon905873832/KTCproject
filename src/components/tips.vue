<style type="text/css">
    .fail p {
        text-align: center;
    }
    .noData {
        text-align: center;
        line-height: 3;
    }
</style>
<template>
    <div class="loading" v-show="tips.isLoad">
        <img src="../images/loading.gif" alt="正在加载"/>
    </div>
    <div class="fail" v-if="tips.isError">
        <p>{{tips.errorMsg}}</p>
    </div>
    <div class="noData" v-if="tips.noData">暂无数据</div>
</template>
<script type="text/javascript">
    module.exports = {
        props: ['tips']
    }
</script>