<template>
    <div class="page">
        <!--标题栏-->
        <header class="bar bar-nav">
            <a class="icon iconfont pull-left" @click="goBack">&#xe600;</a>
            <a class="icon icon-menu pull-right" @click="toggleMenu"></a>

            <h1 class="title">查看项目</h1>
            <ul class="bar-nav-operate" v-show="dropMenuToggle">
                <li @click="projectBuild">新建项目</li>
                <li @click="toggleQueryBox">筛选</li>
                <li>退出登录</li>
            </ul>
        </header>
        <!--内容区-->
        <div class="content project-list">
            <div class="card" v-for="item in projectList" @click="viewProjectDetail($index)">
                <div class="card-header">{{item.projectName}}</div>
                <div class="card-content">
                    <div class="card-content-inner">
                        <p>客户名称：{{item.customerName}}</p>
                        <p>项目状态：{{item.projectStatusName}}</p>
                        <p>项目经理：{{item.managerName}}</p>
                    </div>
                </div>
            </div>
            <!--<div class="content-block">-->
            <!--<p><a href="javascript:void(0);" class="button" @click="">点击查看更多</a></p>-->
            <!--</div>-->
            <tips v-bind:tips="tips"></tips>
        </div>
        <div class="option-box query-box" v-show="queryBox.queryBoxToggle" transition="slideRight">
            <div class="option-header">
                <h2>查询项目</h2>
                <a href="javascript:void(0);" class="close" @click="toggleQueryBox">×</a>
            </div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">项目代码：</div>
                                <div class="item-input">
                                    <input type="text" v-model="queryCondition.projectCode">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">项目名称：</div>
                                <div class="item-input">
                                    <input type="text" v-model="queryCondition.projectName">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">项目状态：</div>
                                <div class="item-input">
                                    <input type="text" id="project-status-model" readonly v-model="queryCondition.projectStatusName"
                                           @click="openModel($event, optionItemsUrl, 'PRJ_STS')">
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
        <option-box :option-box="categoryOptionBox" v-show="categoryOptionBoxShow" @close="toggleCategory"
                    v-ref:category>
            <ul>
                <li v-for="item in categoryOptionBox.optionBoxData">
                    <label class="label-checkbox item-content">
                        <input type="radio" name="radio" @click="sureItem($index)">
                        <div class="item-media">
                            <i class="icon icon-form-checkbox"></i>
                        </div>
                        <div class="item-inner">
                            <div class="item-subtitle">{{item.categoryItemName}}</div>
                        </div>
                    </label>
                </li>
            </ul>
        </option-box>
    </div>
</template>
<script>
    var urlAPI = require('../js/urlAPI.js');
    var tips = require('../components/tips.vue');
    var optionBox = require('../components/option_box.vue');        // 类型选择弹框
    var Util = require('../js/Util');                               // 全局公用方法
    var projectListUrl = urlAPI.url.projectList;                    // 项目列表地址
    var optionItemsUrl = urlAPI.url.optionItems;                    // 弹出框里面的条目地址
    var tipsShow = urlAPI.tipsShow;                                 // ajax提示信息数据
    module.exports = {
        data: function () {
            return {
                projectList: [],                    // 项目列表，由后台查询得到
                dropMenuToggle: false,              // 切换下拉菜单
                queryCondition: {
                    // 查询条件
                    projectCode: '',                // 项目代码
                    projectName: '',                // 项目名称
                    projectStatusCode: '',          // 项目状态code
                    projectStatusName: ''           // 项目状态name
                },
                categoryOptionBox: {
                    optionTitle: '',                // 弹出框标题
                    chooseOptionData: {},           // 选择的数据
                    optionBoxData: []               // 项目状态数据
                },
                categoryOptionBoxShow: false,       // 弹框是否显示，默认不显示
                target: '',                         // 保存触发弹框的元素id
                optionItemsUrl: optionItemsUrl,     // 弹出框里面的条目地址
                queryBox: {
                    queryBoxToggle: false           // 查询条件弹框，默认隐藏
                },
                tips: tipsShow                      // 提示信息数据
            }
        },
        methods: {
            toggleMenu: function () {
                // 显示隐藏菜单
                this.dropMenuToggle = !this.dropMenuToggle;
            },
            toggleQueryBox: function () {
                // 显示和隐藏查询框
                this.queryBox.queryBoxToggle = !this.queryBox.queryBoxToggle;
            },

            viewProjectDetail: function (index) {
                // 跳转到详情页面
                this.$route.router.go({name: 'projectDetail', query: {projectUuid: this.projectList[index].projectUuid}});
            },

            projectBuild: function () {
                // 跳转到新建页面
                this.$route.router.go({name: 'projectBuild'});
            },

            // 弹窗状态切换
            toggleCategory: function () {
                this.categoryOptionBoxShow = !this.categoryOptionBoxShow;
            },
            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'project-status-model':     // 项目状态
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '项目状态';
                        this.toggleCategory();
                        break;
                }
            },
            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'project-status-model':     // 项目状态
                        this.$refs.category.chooseOptionItem(index);
                        this.queryCondition.projectStatusCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.queryCondition.projectStatusName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                }
            },

            // 返回上一页
            goBack: Util.goBack,

            doRequest: function (item) {
                var param = item || {};
                // ajax请求
                this.$http.get(projectListUrl, {
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
                        this.tips.noData = false;
                        this.projectList = result.data.detail;
                    } else {
                        this.projectList = '';
                        this.tips.noData = true;        // 没有数据时的情况
                    }
                }, function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = true;           // 显示错误提示
                    this.tips.errorMsg = '请求超时，请稍后再试！';
                });
            },
            queryFromCondition: function () {
                // 根据条件查询并关闭弹框
                this.doRequest(this.queryCondition);
                this.toggleMenu();
                this.toggleQueryBox();
            }
        },
        components: {
            'option-box': optionBox,
            tips: tips
        },
        created: function () {
            this.doRequest();
        }
    }
</script>