<template>
    <header class="bar bar-nav">
        <a class="icon iconfont pull-left" @click="goback">&#xe600;</a>
        <a class="icon iconfont pull-right" @click="goindex">&#xe602;</a>

        <h1 class="title">{{artTitle}}</h1>
    </header>
</template>

<script type="text/javascript">
    module.exports = {
        props: ['artTitle'],
        methods: {
            // 返回上一页
            goback: function () {
                window.history.back();
            },

            // 返回首页
            goindex: function () {
                // 获取的会话存储中的用户信息
                if (window.sessionStorage) {
                    var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                }
                this.$route.router.go({name: 'home', params: {userCode: userCode}});
            }
        }
    }
</script>