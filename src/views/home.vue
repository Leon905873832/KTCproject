<template>
    <div class="page">
        <!--标题栏-->
        <header class="bar bar-nav">
            <a href="javascript:void(0);" class="icon icon-menu pull-right" @click="dropMenu"></a>
            <h1 class="title">功能列表</h1>
            <ul class="bar-nav-operate" v-show="dropMenuToggle">
                <li @click="logOut">退出登录</li>
            </ul>
        </header>
        <!--内容区-->
        <div class="content">
            <div class="content-padded grid-demo">
                <ul class="row no-gutter my-home">
                    <li class="col-33" v-for="operate in operates" @click="link(operate.operateUrl)">
                        <div>
                            <i class="icon iconfont">{{{icon[$index]}}}</i>
                        </div>
                        <p>{{operate.operateName}}</p>
                    </li>
                </ul>
            </div>
            <tips v-bind:tips="tips"></tips>
        </div>
    </div>
</template>

<script type="text/javascript">
    var urlAPI = require('../js/urlAPI.js');
    var tips = require('../components/tips.vue');
    var url = urlAPI.url.homeUrl;
    var tipsShow = urlAPI.tipsShow;
    module.exports = {
        data: function () {
            return {
                operates: '',                   // 功能列表
                dropMenuToggle: false,          // 下拉菜单
                tips: tipsShow,                  // 提示信息数据
                icon: ['&#xe606;', '&#xe60f;', '&#xe608;', '&#xe60b;', '&#xe60a;', '&#xe609;']       // 图标
            }
        },
        components: {
            tips: tips
        },
        methods: {
            // 跳转连接
            link: function (operateUrl) {
                // 获取的会话存储中的用户信息
                if (window.sessionStorage) {
                    var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                }
                this.$route.router.go({name: operateUrl, params: {userCode: userCode}});
            },
            // 下拉菜单
            dropMenu: function () {
                this.dropMenuToggle = !this.dropMenuToggle;
            },
            // 退出登录
            logOut: function () {
                // 隐藏菜单
                this.dropMenu();

                // 清除所有会话信息
                if (window.sessionStorage) {
                    window.sessionStorage.clear();
                }

                // 跳转回登录界面
                this.$route.router.go('/');
            }
        },
        created: function () {
            this.$http({
                url: url + '?date=' + new Date().getTime(),
                method: 'GET',
                headers: {'Accept': 'application/json, text/plain, */*'},
                emulateJSON: true,
                params: {
                    userCode: this.$route.params.userCode
                },
                before: function () {
                    // 正在加载的提示图标
                    this.tips.isLoad = true;
                }
            }).then(function (response) {
                var result = response.data;
                // 正常时执行
                if (result.success) {
                    this.tips.isLoad = false;    // 隐藏正在加载的图标
                    this.tips.isError = false;     // 移除错误提示
                    if (result.data) {
                        this.tips.noData = false;
                        this.operates = result.data.detail;
                    } else {
                        // 数据为空时的情况
                        this.tips.noData = true;
                    }
                } else {
                    // 没请求到数据的处理方法
                    this.tips.isLoad = false;    // 隐藏正在加载的图标
                    this.tips.isError = true;      // 显示错误提示
                    this.tips.errorMsg = '查询出错，请稍后再试！';
                }
            }, function (response) {
                // 失败后执行
                this.tips.isLoad = false;    // 隐藏正在加载的图标
                this.tips.isError = true;      // 显示错误提示
                this.tips.errorMsg = '网络错误，请稍后再试！';
            });
        }
    }
</script>