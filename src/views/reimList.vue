<template>
    <div class="page" :class="{'active': panelShow}">
        <!--标题栏-->
        <header class="bar bar-nav">
            <a class="icon iconfont pull-left" @click="goback">&#xe600;</a>
            <a href="javascript:void(0);" class="icon icon-menu pull-right" @click="dropMenu"></a>
            <h1 class="title">我的报销</h1>
            <ul class="bar-nav-operate" v-show="dropMenuToggle">
                <li v-link="{name: 'newreim', params: {reimId: 'new'}}">新建报销</li>
                <li v-link="{name: 'entrust', params: {userCode: this.$route.params.userCode}}">委托他人</li>
                <li @click="logOut">退出登录</li>
            </ul>
        </header>
        <!--工具栏-->
        <nav class="bar bar-tab" v-if="totalMoney">
            <div class="content-padded">
                <p>待报销金额：<span class="color-danger">{{totalMoney | currency '&yen;'}}</span>
            </div>
        </nav>
        <div class="content">
            <tabItem :tabs="tabs" :total-money.sync="totalMoney" :promot.sync="promot" v-ref:tab></tabItem>
        </div>
    </div>
    <promot :promot="promot"></promot>
</template>
<script type="text/javascript">
    var tabItem = require('../components/tab.vue');      // 引入tab选项卡
    var urlAPI = require('../js/urlAPI.js');
    var url = urlAPI.url.reimListUrl;
    var promot = require('../components/promot.vue');   // 撤回的提示框
    module.exports = {
        data: function () {
            return {
                tabs: {
                    tabOptions: [   // 选项卡
                        {
                            'reimItem': '审批中'
                        },
                        {
                            'reimItem': '待处理'
                        },
                        {
                            'reimItem': '已取消'
                        },
                        {
                            'reimItem': '已完成'
                        }
                    ],
                    classColor: ['color-primary', 'color-danger', 'color-warning', 'color-success'],
                    icon: ['&#xe60d;', '&#xe617;', '&#xe616;', '&#xe615;'],
                    tabUrls: url,       // 选项url
                    tabLink: 'newreim',      // 页面跳转连接到该模板
                    isCur: '',                  // 切换tab标签的样式
                    isApprove: true            // 判断是否审批界面，显示和隐藏审批人
                },
                totalMoney: 0,       // 储存待报销金额
                userCode: '',
                dropMenuToggle: false,
                promot: {
                    isLoad: false,       // ajax正在提示图标
                    promot: false,       // ajax提交完成后的提示框
                    promotMsg: ''        // 提示信息
                }
            }
        },
        components: {
            tabitem: tabItem,        // 注册tab选项卡，组件名为tabitem
            promot: promot
        },
        methods: {
            goback: function () {
                window.history.back();
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
            // 获取的会话存储中的用户信息
            if (window.sessionStorage) {
                this.userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
            }
        }
    }
</script>