<template>
    <div class="page">
        <!--标题栏-->
        <heading :art-title="title"></heading>
        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="project-code">项目编码:</label>
                                <div class="item-input">
                                    <input type="text" id="project-code" v-model="projectData.projectCode">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="project-name">项目名称:</label>
                                <div class="item-input">
                                    <input type="text" id="project-name" v-model="projectData.projectName">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="project-status">项目状态:</label>
                                <div class="item-input" @click="openModel($event, optionItemsUrl, 'PRJ_STS')">
                                    <input type="text" id="project-status" v-model="projectData.projectStatusName">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="custom-name">客户名称:</label>
                                <div class="item-input">
                                    <input type="text" id="custom-name" v-model="projectData.customerName">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="project-amount">项目金额:</label>
                                <div class="item-input">
                                    <input type="number" id="project-amount" v-model="projectData.estimateRevenue">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="contract-amount">合同金额:</label>
                                <div class="item-input">
                                    <input type="number" id="contract-amount" v-model="projectData.contractRevenue">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="currency-type">币种:</label>
                                <div class="item-input" @click="openModel($event, optionItemsUrl, 'CCY_CDE')">
                                    <input type="text" id="currency-type" v-model="projectData.currencyName">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="charge-type">计费方式:</label>
                                <div class="item-input" @click="openModel($event, optionItemsUrl, 'PRJ_MTD')">
                                    <input type="text" id="charge-type" v-model="projectData.projectPricingMethodName">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="project-manager">项目经理:</label>
                                <div class="item-input" @click="openModel($event, projectManageUrl)">
                                    <input type="text" id="project-manager" v-model="projectData.managerName">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner flex-start">
                                <label class="item-title label" for="project-des">项目描述:</label>
                                <div class="item-input">
                                    <textarea id="project-des" v-model="projectData.projectDescription"></textarea>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content-block">
                <div class="row">
                    <div class="col-50"><a class="button button-big button-fill" @click="doRequest">提交</a></div>
                    <div class="col-50"><a class="button button-big button-fill button-danger" @click="goBack">取消</a></div>
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
        <option-box :option-box="projectManagerOptionBox" v-show="projectManagerOptionBoxShow" @close="toggleProjectManager"
                    v-ref:project-manager>
            <ul>
                <li v-for="item in projectManagerOptionBox.optionBoxData">
                    <label class="label-checkbox item-content">
                        <input type="radio" name="radio" @click="sureItem($index)">
                        <div class="item-media">
                            <i class="icon icon-form-checkbox"></i>
                        </div>
                        <div class="item-inner">
                            <div class="item-subtitle">{{item.userName}}</div>
                        </div>
                    </label>
                </li>
            </ul>
        </option-box>
        <promot :promot="promot"></promot>
    </div>
</template>
<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var urlAPI = require('../js/urlAPI.js');
    var optionBox = require('../components/option_box.vue');        // 类型选择弹框
    var promot = require('../components/promot.vue');               // 发送表单的提示框
    var Util = require('../js/Util');                               // 全局公用方法
    var projectBuildUrl = urlAPI.url.projectBuild;                  // 项目提交地址
    var optionItemsUrl = urlAPI.url.optionItems;                    // 弹出框里面的条目地址
    var customerNameUrl = urlAPI.url.customerName;                  // 查询客户代码地址
    var projectManageUrl = urlAPI.url.projectManage;                // 查询项目经理地址
    module.exports = {
        data: function () {
            return {
                title: '新建项目',
                projectData: {
                    projectUuid: '',                    // 项目,新建的时候为空，编辑的时候为查询到的值
                    projectCode: '',                    // 项目编码
                    projectName: '',                    // 项目名称
                    projectStatusCode: '',              // 项目状态code
                    projectStatusName: '',              // 项目状态name
                    customerCode: '',                   // 客户代码
                    customerName: '',                   // 客户名称
                    estimateRevenue: '',                // 项目金额
                    contractRevenue: '',                // 合同金额
                    currencyCode: '',                   // 币种code
                    currencyName: '',                   // 币种name
                    projectPricingMethodCode: '',       // 记费方式code
                    projectPricingMethodName: '',       // 记费方式name
                    managerCode: '',                    // 项目经理code
                    managerName: '',                    // 项目经理name
                    projectDescription: ''              // 项目描述
                },
                categoryOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                projectManagerOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                categoryOptionBoxShow: false,                   // 弹框是否显示，默认不显示
                projectManagerOptionBoxShow: false,             // 弹框是否显示，默认不显示
                target: '',                                     // 保存触发弹框的元素id
                optionItemsUrl: optionItemsUrl,         // 弹出框里面的条目地址
                customerNameUrl: customerNameUrl,       // 查询客户代码地址
                projectManageUrl: projectManageUrl,     // 查询项目经理地址
                promot: {
                    isLoad: false,                      // ajax正在提示图标
                    promot: false,                      // ajax提交完成后的提示框
                    promotMsg: ''                       // 提示信息
                }
            }
        },
        components: {
            heading: Header,
            'option-box': optionBox,                    // 选择弹框
            promot: promot                              // 表单提示信息框
        },
        methods: {
            // 返回上一页的方法
            goBack: Util.goBack,

            // 弹窗状态切换
            toggleCategory: function () {
                this.categoryOptionBoxShow = !this.categoryOptionBoxShow;
            },
            toggleProjectManager: function () {
                this.projectManagerOptionBoxShow = !this.projectManagerOptionBoxShow;
            },

            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'project-status':     // 项目状态
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '项目状态';
                        this.toggleCategory();
                        break;
                    case 'currency-type':    // 币种
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '币种';
                        this.toggleCategory();
                        break;
                    case 'charge-type':    // 计费方式
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '计费方式';
                        this.toggleCategory();
                        break;
                    case 'project-manager':    // 项目经理
                        this.$refs.projectManager.requestOptionItems(url, categoryCode);
                        this.projectManagerOptionBox.optionTitle = '项目经理';
                        this.toggleProjectManager();
                        break;
                }
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'project-status':     // 项目状态
                        this.$refs.category.chooseOptionItem(index);
                        this.projectData.projectStatusCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.projectData.projectStatusName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'currency-type':    // 币种
                        this.$refs.category.chooseOptionItem(index);
                        this.projectData.currencyCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.projectData.currencyName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'charge-type':    // 计费方式
                        this.$refs.category.chooseOptionItem(index);
                        this.projectData.projectPricingMethodCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.projectData.projectPricingMethodName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'project-manager':    // 项目经理
                        this.$refs.projectManager.chooseOptionItem(index);
                        this.projectData.managerCode = this.projectManagerOptionBox.chooseOptionData.userCode;
                        this.projectData.managerName = this.projectManagerOptionBox.chooseOptionData.userName;
                        this.toggleProjectManager();
                        break;
                }
            },

            showpromot: function () {
                this.promot.promot = true;     // 显示提示信息
                var _this = this;

                // 隐藏提示信息
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            },

            Ajax: function () {
                // 提交表单
                this.$http.post(projectBuildUrl, {
                    'projectData': JSON.stringify(this.projectData)
                }, {
                    headers: {'Accept': 'application/json, text/plain, *!/!*'},
                    emulateJSON: true,
                    before: function () {
                        // 正在提交的提示图标
                        this.promot.isLoad = true;
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
                    this.promot.isLoad = false;    // 隐藏图标
                    // 1s后，提示信息框消失
                    this.showpromot();
                });
            },
            doRequest: function () {
                // 首先进行验证，验证通过后再提交
                if (!this.projectData.projectCode || !this.projectData.projectName) {
                    this.promot.promotMsg = '项目名称不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.projectData.projectStatusCode || !this.projectData.projectStatusName) {
                    this.promot.promotMsg = '项目状态不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.projectData.customerName) {
                    this.promot.promotMsg = '客户名称不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.projectData.estimateRevenue) {
                    this.promot.promotMsg = '项目金额不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (isNaN(this.projectData.estimateRevenue) || this.projectData.estimateRevenue <= 0) {
                    this.promot.promotMsg = '项目金额必须是有效数字！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.projectData.contractRevenue) {
                    this.promot.promotMsg = '合同金额不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (isNaN(this.projectData.contractRevenue) || this.projectData.contractRevenue <= 0) {
                    this.promot.promotMsg = '合同金额必须是有效数字！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.projectData.currencyCode || !this.projectData.currencyName) {
                    this.promot.promotMsg = '币种不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.projectData.projectPricingMethodCode || !this.projectData.projectPricingMethodName) {
                    this.promot.promotMsg = '计费方式不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.projectData.managerCode || !this.projectData.managerName) {
                    this.promot.promotMsg = '项目经理不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.Ajax();            // 验证通过，执行提交
                }
            }
        },

        created: function () {
            // 获取地址栏的参数projectUuid
            var projectUuid = this.$route.query.projectUuid;
            if (projectUuid) {
                this.title = '编辑项目';
                this.projectData = JSON.parse(window.sessionStorage.getItem('projectData'));
            }
        }
    }
</script>