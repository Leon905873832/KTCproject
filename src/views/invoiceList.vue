<template>
    <div class="page">
        <!--标题栏-->
        <header class="bar bar-nav">
            <a class="icon iconfont pull-left" @click="goBack">&#xe600;</a>
            <a class="icon icon-menu pull-right" @click="toggleMenu"></a>

            <h1 class="title">查看发票</h1>
            <ul class="bar-nav-operate" v-show="dropMenuToggle">
                <li @click="invoiceBuild">新建发票</li>
                <li @click="toggleQueryBox">筛选</li>
                <li>退出登录</li>
            </ul>
        </header>
        <!--内容区-->
        <div class="content project-list">
            <div class="card" v-for="item in invoiceList" @click="viewInvoiceDetail($index)">
                <div class="card-header">项目：{{item.projectName}}</div>
                <div class="card-content">
                    <div class="card-content-inner">
                        <p>客户：{{item.customerName}}</p>
                        <p>合同代码：{{item.contractCode}}</p>
                        <p>开票类型：{{item.invoiceTypeName}}</p>
                        <p>开票状态：{{item.invoiceStatusName}}</p>
						<p>计划{{item.invoiceTypeCode === 'AR'?'开':'收'}}票日期：{{item.estimateInvoiceDate}}</p>
						<p>计划{{item.invoiceTypeCode === 'AR'?'收':'付'}}款日期：{{item.paymentDueDate}}</p>
                    </div>
                </div>
            </div>
            <tips v-bind:tips="tips"></tips>
        </div>
        <div class="option-box query-box" v-show="queryBox.queryBoxToggle" transition="slideRight">
            <div class="option-header">
                <h2>查询开票</h2>
                <a href="javascript:void(0);" class="close" @click="toggleQueryBox">×</a>
            </div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">合同代码：</div>
                                <div class="item-input">
                                    <input type="text" v-model="queryCondition.contractCode">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">发票类型：</div>
                                <div class="item-input">
                                    <input type="text" id="invoice-type" v-model="queryCondition.invoiceTypeName"
                                           @click="openModel($event, optionItemsUrl, 'INV_TYPE')" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">开票状态：</div>
                                <div class="item-input">
                                    <input type="text" id="invoice-status" v-model="queryCondition.invoiceStatusName"
                                           @click="openModel($event, optionItemsUrl, 'INV_STS')" readonly>
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
<script type="text/javascript">
    var urlAPI = require('../js/urlAPI.js');
    var tips = require('../components/tips.vue');
    var optionBox = require('../components/option_box.vue');        // 类型选择弹框
    var Util = require('../js/Util');                               // 全局公用方法
    var invoiceListUrl = urlAPI.url.invoiceList;                    // 项目列表地址
    var optionItemsUrl = urlAPI.url.optionItems;                    // 弹出框里面的条目地址
    var tipsShow = urlAPI.tipsShow;                                 // ajax提示信息数据
    module.exports = {
        data: function () {
            return {
                invoiceList: '',                    // 发票列表，由后台查询得到
                dropMenuToggle: false,              // 切换下拉菜单
                queryCondition: {
                    // 查询条件
                    invoiceStatusCode: '',          // 发票状态code
                    invoiceStatusName: '',          // 发票状态name
                    invoiceTypeCode: '',            // 发票状态code
                    invoiceTypeName: ''             // 发票状态name

                },
                categoryOptionBox: {
                    optionTitle: '',                      // 弹出框标题
                    chooseOptionData: {},                 // 选择的数据
                    optionBoxData: []                     // 项目状态数据
                },
                categoryOptionBoxShow: false,             // 弹框是否显示，默认不显示
                optionItemsUrl: optionItemsUrl,           // 弹出框里面的条目地址
                queryBox: {
                    queryBoxToggle: false                 // 查询条件弹框，默认隐藏
                },
                tips: tipsShow                      // 提示信息数据
            }
        },
        methods: {
            toggleQueryBox: function () {
                // 显示和隐藏查询框
                this.queryBox.queryBoxToggle = !this.queryBox.queryBoxToggle;
            },

            toggleMenu: function () {
                this.dropMenuToggle = !this.dropMenuToggle;
            },

            // 弹窗状态切换
            toggleCategory: function () {
                this.categoryOptionBoxShow = !this.categoryOptionBoxShow;
            },

            viewInvoiceDetail: function (index) {
                // 跳转到发票详情页面
                this.$route.router.go({name: 'invoiceDetail', query: {invoiceUuid: this.invoiceList[index].invoiceUuid}});
            },

            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'invoice-type':     // 发票类型
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '发票类型';
                        this.toggleCategory();
                        break;
                    case 'invoice-status':     // 发票状态
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '发票状态';
                        this.toggleCategory();
                        break;
                }
                return false;
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'invoice-type':    // 开票类型
                        this.$refs.category.chooseOptionItem(index);
                        this.queryCondition.invoiceTypeCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.queryCondition.invoiceTypeName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'invoice-status':    // 开票状态
                        this.$refs.category.chooseOptionItem(index);
                        this.queryCondition.invoiceStatusCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.queryCondition.invoiceStatusName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                }
            },

            invoiceBuild: function () {
                // 跳转到新建发票页面
                this.$route.router.go({name: 'invoiceBuild'});
            },

            // 返回上一页
            goBack: Util.goBack,

            doRequest: function (item) {
                var param = item || {};
                // ajax请求
                this.$http.get(invoiceListUrl, {
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
                        this.invoiceList = result.data.detail;
                        this.tips.noData = false;
                    } else {
                        this.invoiceList = '';
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
        ready: function () {
            this.doRequest();
        }
    }
</script>