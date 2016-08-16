<template>
    <div class="page">
        <!--标题栏-->
        <header class="bar bar-nav">
            <a class="icon iconfont pull-left" @click="goBack">&#xe600;</a>
            <a class="icon icon-menu pull-right" @click="toggleMenu"></a>

            <h1 class="title">查看项目成员</h1>
            <ul class="bar-nav-operate" v-show="dropMenuToggle">
                <li @click="toggleQueryBox">筛选</li>
                <li>退出登录</li>
            </ul>
        </header>

        <!--底部操作按钮-->
        <nav class="bar bar-tab">
            <a class="tab-item button button-fill" href="javascript:void(0);" @click="submit">提交</a>
        </nav>

        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li v-for="item in projectMemberData.projectMember">
                        <label class="label-checkbox item-content">
                            <input type="checkbox" name="radio" :checked="item.projectMbrUuid"
                                   @click="chooseMember($index)">
                            <div class="item-media">
                                <i class="icon icon-form-checkbox"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-subtitle">{{item.userName}}</div>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>
            <tips v-bind:tips="tips"></tips>
        </div>
    </div>
    <div class="option-box query-box" v-show="queryBox.queryBoxToggle" transition="slideRight">
        <div class="option-header">
            <h2>查询用户</h2>
            <a href="javascript:void(0);" class="close" @click="toggleQueryBox">×</a>
        </div>
        <div class="list-block">
            <ul>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">用户代码：</div>
                            <div class="item-input">
                                <input type="text" v-model="queryCondition.userCode">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">是否已选：</div>
                            <div class="item-input">
                                <label class="label-checkbox item-content">
                                    <input type="checkbox" name="checkbox" v-model="queryCondition.projectMbrUuid">
                                    <div class="item-media">
                                        <i class="icon icon-form-checkbox"></i>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="content-block">
                <p><a href="javascript:void(0);" class="button button-fill button-danger button-big"
                      @click="queryFromCondition">查询</a></p>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var urlAPI = require('../js/urlAPI.js');
    var tips = require('../components/tips.vue');
    var Util = require('../js/Util');                               // 全局公用方法
    var projectMemberUrl = urlAPI.url.projectMember;                // 获取项目成员地址
    var saveProjectMemberUrl = urlAPI.url.saveProjectMember;        // 保存项目成员地址
    var tipsShow = urlAPI.tipsShow;                                 // ajax提示信息数据
    var promot = require('../components/promot.vue');               // 发送表单的提示框
    module.exports = {
        data: function () {
            return {
                projectMemberData: {        // 项目成员数据
                    projectUuid: '',        // 项目id
                    projectMember: []       // 项目成员
                },
                promot: {
                    isLoad: false,          // ajax正在提示图标
                    promot: false,          // ajax提交完成后的提示框
                    promotMsg: ''           // 提示信息
                },
                dropMenuToggle: false,      // 切换下拉菜单
                queryCondition: {
                    // 查询条件
                    projectMbrUuid: false,          // 已选或未选
                    userCode: ''             // 发票状态code

                },
                queryBox: {
                    queryBoxToggle: false                 // 查询条件弹框，默认隐藏
                },
                tips: tipsShow              // 提示信息数据
            }
        },
        components: {
            heading: Header,
            promot: promot,                 // 表单提示信息框
            tips: tips
        },
        methods: {
            // 切换测滑弹框
            toggleQueryBox: function () {
                // 显示和隐藏查询框
                this.queryBox.queryBoxToggle = !this.queryBox.queryBoxToggle;
            },

            // 切换下拉菜单
            toggleMenu: function () {
                this.dropMenuToggle = !this.dropMenuToggle;
            },

            // 返回上一页
            goBack: Util.goBack,

            showpromot: function () {
                this.promot.promot = true;     // 显示提示信息
                var _this = this;

                // 隐藏提示信息
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            },

            doRequest: function (item) {
                // 获取地址栏的参数projectUuid
                var projectUuid = this.$route.query.projectUuid;
                this.projectMemberData.projectUuid = projectUuid;       // 记录项目的id
                var param = item || {};

                // 项目明细请求地址加参数
                var url = projectMemberUrl + '?projectUuid=' + projectUuid;

                // ajax请求工程明细
                this.$http.get(url, {
                    params: {
                        'param': JSON.stringify(param)
                    },
                    before: function () {
                        this.tips.isLoad = true;        // 正在加载的提示图标
                    }
                }).then(function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = false;          // 移除错误提示
                    var result = response.data;
                    if (result.success) {
                        this.projectMemberData.projectMember = result.detail;
                    } else {
                        this.projectMemberData.projectMember = '';
                        this.tips.noData = true;        // 没有数据时的情况
                    }
                }, function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = true;           // 显示错误提示
                    this.tips.errorMsg = '请求超时，请稍后再试！';
                });
            },
            chooseMember: function (index) {
                this.projectMemberData.projectMember[index].projectMbrUuid = !this.projectMemberData.projectMember[index].projectMbrUuid
            },

            queryFromCondition: function () {
                // 根据条件查询并关闭弹框
                this.doRequest(this.queryCondition);
                this.toggleMenu();
                this.toggleQueryBox();
            },

            submit: function () {
                // 提交表单
                this.$http.post(saveProjectMemberUrl, {
                    'projectMemberData': JSON.stringify(this.projectMemberData)
                }, {
                    headers: {'Accept': 'application/json, text/plain, *!/!*'},
                    emulateJSON: true,
                    before: function () {
                        this.promot.isLoad = true;      // 正在提交的提示图标
                    }
                }).then(function (response) {
                    var result = response.data;
                    if (result.success) {
                        this.promot.promotMsg = '提交成功，正在跳转…';
                        this.$route.router.go({name: 'projectList'});
                    } else {
                        this.promot.promotMsg = '保存失败,请稍后再试！';      // 提交失败的处理方法
                    }
                }, function (response) {
                    this.promot.promotMsg = '请求超时，请稍后再试！';          //  失败后执行
                }).finally(function () {
                    this.promot.isLoad = false;     // 隐藏图标
                    this.showpromot();              // 1s后，提示信息框消失
                });
            }
        },
        created: function () {
            this.doRequest();
        }
    }
</script>