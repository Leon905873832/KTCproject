<template>
    <div class="page">
        <!--标题栏-->
        <header class="bar bar-nav">
            <a class="icon iconfont pull-left" @click="goBack">&#xe600;</a>
            <a class="icon icon-menu pull-right" @click="toggleMenu"></a>

            <h1 class="title">查看合同</h1>
            <ul class="bar-nav-operate" v-show="dropMenuToggle">
                <li @click="contractBuild">新建合同</li>
                <li @click="toggleQueryBox" @click="toggleMenu">筛选</li>
                <li>退出登录</li>
            </ul>
        </header>
        <!--内容区-->
        <div class="content project-list">
            <div class="card" v-for="item in contractList" @click="viewContractDetail($index)">
                <div class="card-header">{{item.ctrctCode}}</div>
                <div class="card-content">
                    <div class="card-content-inner">
                        <p>合同状态：{{item.ctrctStatusName}}</p>
                        <p>所属项目：{{item.prjName}}</p>
                    </div>
                </div>
            </div>
            <tips v-bind:tips="tips"></tips>
        </div>
        <div class="option-box query-box" v-show="queryBox.queryBoxToggle" transition="slideRight">
            <div class="option-header">
                <h2>查询合同</h2>
                <a href="javascript:void(0);" class="close" @click="toggleQueryBox">×</a>
            </div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">所属项目：</div>
                                <div class="item-input">
                                    <input type="text" id="belong-project" v-model="queryCondition.prjName"
                                           @click="openModel($event, belongToProjectUrl)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">合同代码：</div>
                                <div class="item-input">
                                    <input type="text" v-model="queryCondition.ctrctCode">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">合同状态：</div>
                                <div class="item-input">
                                    <input type="text" id="contract-status" v-model="queryCondition.ctrctStatusName"
                                           @click="openModel($event, optionItemsUrl, 'CTRT_STS')" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">合同类型：</div>
                                <div class="item-input">
                                    <input type="text" id="contract-style" v-model="queryCondition.ctrctTypeName"
                                           @click="openModel($event, optionItemsUrl, 'CTRT_TYPE')" readonly>
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
        <option-box :option-box="projectOptionBox" v-show="projectOptionBoxShow" @close="toggleProject" v-ref:project>
            <ul>
                <li v-for="item in projectOptionBox.optionBoxData">
                    <label class="label-checkbox item-content">
                        <input type="radio" name="radio" @click="sureItem($index)">
                        <div class="item-media">
                            <i class="icon icon-form-checkbox"></i>
                        </div>
                        <div class="item-inner">
                            <div class="item-subtitle">{{item.projectName}}</div>
                        </div>
                    </label>
                </li>
            </ul>
        </option-box>
    </div>
</template>
<script type="text/javascript">
    var urlAPI = require('../js/urlAPI.js');
    var tips = require('../components/tips.vue');
    var optionBox = require('../components/option_box.vue');        // 类型选择弹框
    var Util = require('../js/Util');                               // 全局公用方法
    var contractListUrl = urlAPI.url.contractList;                  // 合同列表地址
    var optionItemsUrl = urlAPI.url.optionItems;                    // 弹出框里面的条目地址
    var belongToProjectUrl = urlAPI.url.belongToProject;            // 查询所属项目地址
    var tipsShow = urlAPI.tipsShow;                                 // ajax提示信息数据
    module.exports = {
        data: function () {
            return {
                contractList: {},                           // 合同列表，由后台查询得到
                dropMenuToggle: false,                      // 切换下拉菜单
                queryCondition: {
                    // 查询条件
                    prjUuid: '',                            // 项目id
                    prjCode: '',                            // 项目代码
                    prjName: '',                            // 项目名称
                    ctrctCode: '',                          // 合同代码
                    ctrctStatusCode: '',                    // 合同状态code
                    ctrctStatusName: '',                    // 合同状态Name
                    ctrctTypeCode: '',                      // 合同类型code
                    ctrctTypeName: ''                       // 合同类型name
                },
                categoryOptionBox: {
                    optionTitle: '',                      // 弹出框标题
                    chooseOptionData: {},                 // 选择的数据
                    optionBoxData: []                     // 项目状态数据
                },
                projectOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                projectOptionBoxShow: false,                    // 弹框是否显示，默认不显示
                categoryOptionBoxShow: false,                   // 弹框是否显示，默认不显示
                optionItemsUrl: optionItemsUrl,                 // 弹出框里面的条目地址
                queryBox: {
                    queryBoxToggle: false                       // 查询条件弹框，默认隐藏
                },
                belongToProjectUrl: belongToProjectUrl,         // 所属项目地址
                tips: tipsShow                                  // 提示信息数据
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
            // 弹窗状态切换
            toggleCategory: function () {
                this.categoryOptionBoxShow = !this.categoryOptionBoxShow;
            },
            toggleProject: function () {
                this.projectOptionBoxShow = !this.projectOptionBoxShow;
            },

            viewContractDetail: function (index) {
                // 跳转到详情页面
                this.$route.router.go({name: 'contractDetail', query: {ctrctId: this.contractList[index].ctrctId}});
            },

            contractBuild: function () {
                // 跳转到新建页面
                this.$route.router.go({name: 'contractBuild'});
            },

            // 返回上一页
            goBack: Util.goBack,

            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'belong-project':     // 所属项目
                        this.$refs.project.requestOptionItems(url, categoryCode);
                        this.projectOptionBox.optionTitle = '所属项目';
                        this.toggleProject();
                        break;
                    case 'contract-status':     // 合同状态
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '合同状态';
                        this.toggleCategory();
                        break;
                    case 'contract-style':     // 合同类型
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '合同类型';
                        this.toggleCategory();
                        break;
                }
                return false;
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'belong-project':    // 所属项目
                        this.$refs.project.chooseOptionItem(index);
                        this.queryCondition.prjUuid = this.projectOptionBox.chooseOptionData.projectUuid;
                        this.queryCondition.prjCode = this.projectOptionBox.chooseOptionData.projectCode;
                        this.queryCondition.prjName = this.projectOptionBox.chooseOptionData.projectName;
                        this.toggleProject();
                        break;
                    case 'contract-status':    // 合同状态
                        this.$refs.category.chooseOptionItem(index);
                        this.queryCondition.ctrctStatusCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.queryCondition.ctrctStatusName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'contract-style':    // 合同类型
                        this.$refs.category.chooseOptionItem(index);
                        this.queryCondition.ctrctTypeCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.queryCondition.ctrctTypeName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                }
            },

            doRequest: function (item) {
                var param = item || {};
                // ajax请求
                this.$http.get(contractListUrl, {
                    params: {
                        'param': JSON.stringify(param)
                    },
                    before: function () {
                        this.tips.isLoad = true;            // 正在加载的提示图标
                    }
                }).then(function (response) {
                    this.tips.isLoad = false;               // 隐藏正在加载的图标
                    this.tips.isError = false;              // 移除错误提示
                    var result = response.data;
                    if (result.success) {
                        this.contractList = result.data.detail;
                        this.tips.noData = false;
                    } else {
                        this.contractList = '';
                        this.tips.noData = true;            // 没有数据时的情况
                    }
                }, function (response) {
                    this.tips.isLoad = false;               // 隐藏正在加载的图标
                    this.tips.isError = true;               // 显示错误提示
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