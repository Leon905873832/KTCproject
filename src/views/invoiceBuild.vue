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
                                <label class="item-title label" for="belongTo-ctrct">所属合同:</label>
                                <div class="item-input">
                                    <input type="text" id="belongTo-ctrct" v-model="invoiceData.contractCode"
                                           @click="openModel($event, belongToContractUrl)" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="invoice-code">开票类型:</label>
                                <div class="item-input">
                                    <input type="text" id="invoice-code" v-model="invoiceData.invoiceTypeName"
                                           @click="openModel($event, optionItemsUrl, 'INV_TYPE')" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="invoice-amout">开票金额:</label>
                                <div class="item-input">
                                    <input type="text" id="invoice-amout" v-model="invoiceData.invoiceAmout">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="currency-name">币种:</label>
                                <div class="item-input">
                                    <input type="text" id="currency-name" v-model="invoiceData.currencyName"
                                           @click="openModel($event, optionItemsUrl, 'CCY_CDE')" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label"
                                       for="expect-billing-date">{{invoiceDate.expect}}:</label>
                                <div class="item-input">
                                    <input type="text" id="expect-billing-date"
                                           v-model="invoiceData.estimateInvoiceDate" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label"
                                       for="actual-billing-date">{{invoiceDate.actual}}:</label>
                                <div class="item-input">
                                    <input type="text" id="actual-billing-date" v-model="invoiceData.actualInvoiceDate" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="invoice-status">开票状态:</label>
                                <div class="item-input">
                                    <input type="text" id="invoice-status" v-model="invoiceData.invoiceStatusName"
                                           @click="openModel($event, optionItemsUrl, 'INV_STS')" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="actual-receipts-date">预计支付日:</label>
                                <div class="item-input">
                                    <input type="text" id="expect-receipts-date" v-model="invoiceData.paymentDueDate" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="actual-receipts-date">实际支付日:</label>
                                <div class="item-input">
                                    <input type="text" id="actual-receipts-date" v-model="invoiceData.actualPaidDate" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="receipts-status">支付状态:</label>
                                <div class="item-input">
                                    <input type="text" id="receipts-status" v-model="invoiceData.paymentStatusName"
                                           @click="openModel($event, optionItemsUrl, 'PYMT_STS')" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content-block">
                <div class="row">
                    <div class="col-50"><a class="button button-big button-fill" @click="doRequest">提交</a></div>
                    <div class="col-50"><a class="button button-big button-fill button-danger" @click="goBack">取消</a>
                    </div>
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
        <option-box :option-box="belongToContractBox" v-show="belongToContractShow" @close="toggleContract"
                    v-ref:contract>
            <ul>
                <li v-for="item in belongToContractBox.optionBoxData">
                    <label class="label-checkbox item-content">
                        <input type="radio" name="radio" @click="sureItem($index)">
                        <div class="item-media">
                            <i class="icon icon-form-checkbox"></i>
                        </div>
                        <div class="item-inner">
                            <div class="item-subtitle">{{item.contractCode}}</div>
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
    var promot = require('../components/promot.vue');               // 发送表单的提示框
    var optionBox = require('../components/option_box.vue');        // 类型选择弹框
    var Util = require('../js/Util');                               // 全局公用方法
    var invoiceBuildUrl = urlAPI.url.invoiceBuild;                  // 项目提交地址
    var optionItemsUrl = urlAPI.url.optionItems;                    // 弹出框里字典值条目地址
    var belongToContractUrl = urlAPI.url.belongToContract;          // 所属合同地址
    module.exports = {
        data: function () {
            return {
                title: '新建开票',
                invoiceData: {
                    invoiceUuid: '',                      // 发票id,新建的时候为空，编辑的时候从前一个页面传过来
                    projectUuid: '',                      // 所属项目id
                    projectCode: '',                      // 所属项目code
                    projectName: '',                      // 所属项目name
                    invoiceTypeCode: '',                  // 发票类型代码code
                    invoiceTypeName: '',				  // 发票类型名称name
                    contractCode: '',                     // 所属合同代码
                    estimateInvoiceDate: '',              // 计划开/收票日期
                    actualInvoiceDate: '',                // 实际开/收票日期
                    invoiceAmout: '',                     // 发票金额
                    currencyCode: '',                     // 币种code
                    currencyName: '',                     // 币种name
                    invoiceStatusCode: '',                // 开票状态code
                    invoiceStatusName: '',                // 开票状态name
                    paymentDueDate: '',                   // 预计支付日期
                    actualPaidDate: '',                   // 实际支付日期
                    paymentStatusCode: '',                // 支付状态code
                    paymentStatusName: ''                 // 支付状态name
                },
                invoiceDate: {                           // 开票/收票的提示文字，客户发票显示开票日，供应商发票显示收票
                    expect: '预计开票日',
                    actual: '实际开票日'
                },
                categoryOptionBox: {
                    optionTitle: '',                      // 弹出框标题
                    chooseOptionData: {},                 // 选择的数据
                    optionBoxData: []                     // 项目状态数据
                },
                belongToContractBox: {
                    optionTitle: '',                      // 弹出框标题
                    chooseOptionData: {},                 // 选择的数据
                    optionBoxData: []                     // 项目状态数据
                },
                categoryOptionBoxShow: false,             // 弹框是否显示，默认不显示
                belongToContractShow: false,              // 所属项目弹框是否显示，默认不显示
                optionItemsUrl: optionItemsUrl,           // 弹出框里面的条目地址
                belongToContractUrl: belongToContractUrl,        // 所属合同地址
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
            toggleContract: function () {
                this.belongToContractShow = !this.belongToContractShow;
            },
            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'belongTo-ctrct':     // 所属合同
                        this.$refs.contract.requestOptionItems(url, categoryCode);
                        this.belongToContractBox.optionTitle = '所属合同';
                        this.toggleContract();
                        break;
                    case 'invoice-code':     // 开票类型
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '开票类型';
                        this.toggleCategory();
                        break;
                    case 'currency-name':     // 币种
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '币种';
                        this.toggleCategory();
                        break;
                    case 'invoice-status':     // 开票状态
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '开票状态';
                        this.toggleCategory();
                        break;
                    case 'receipts-status':     // 支付状态
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '支付状态';
                        this.toggleCategory();
                        break;
                }
                return false;
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'belongTo-ctrct':     // 所属合同
                        this.$refs.contract.chooseOptionItem(index);
                        this.invoiceData.projectUuid = this.belongToContractBox.chooseOptionData.projectUuid;
                        this.invoiceData.projectCode = this.belongToContractBox.chooseOptionData.projectCode;
                        this.invoiceData.projectName = this.belongToContractBox.chooseOptionData.projectName;
                        this.invoiceData.contractCode = this.belongToContractBox.chooseOptionData.contractCode;
                        this.toggleContract();
                        break;
                    case 'invoice-code':    // 开票类型
                        this.$refs.category.chooseOptionItem(index);
                        this.invoiceData.invoiceTypeCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.invoiceData.invoiceTypeName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        console.log(this.invoiceData.invoiceTypeCode);
                        if (this.invoiceData.invoiceTypeCode === 'AR') {
                            this.invoiceDate.expect = '预计开票日';
                            this.invoiceDate.actual = '实际开票日';
                        } else {
                            this.invoiceDate.expect = '预计收票日';
                            this.invoiceDate.actual = '实际收票日';
                        }
                        this.toggleCategory();
                        break;
                    case 'currency-name':    // 币种
                        this.$refs.category.chooseOptionItem(index);
                        this.invoiceData.currencyCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.invoiceData.currencyName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'invoice-status':    // 开票状态
                        this.$refs.category.chooseOptionItem(index);
                        this.invoiceData.invoiceStatusCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.invoiceData.invoiceStatusName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'receipts-status':    // 支付状态
                        this.$refs.category.chooseOptionItem(index);
                        this.invoiceData.paymentStatusCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.invoiceData.paymentStatusName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
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
                this.$http.post(invoiceBuildUrl, {
                    'invoiceData': JSON.stringify(this.invoiceData)
                }, {
                    headers: {'Accept': 'application/json, text/plain, *!/!*'},
                    emulateJSON: true,
                    before: function () {
                        // 正在提交的提示图标
                        this.promot.isLoad = true;
                    }
                }).then(function (response) {
                    this.promot.promotMsg = '提交成功，正在跳转…';
                    var result = response.data;
                    if (result.success) {
                        this.$route.router.go({name: 'invoiceList'});
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
                if (!this.invoiceData.invoiceTypeCode || !this.invoiceData.invoiceTypeName) {
                    this.promot.promotMsg = '发票类型不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.invoiceData.contractCode) {
                    this.promot.promotMsg = '所属合同不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.invoiceData.estimateInvoiceDate) {
                    this.promot.promotMsg = '预计开/收票日不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.invoiceData.paymentDueDate) {
                    this.promot.promotMsg = '预计支付日不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.invoiceData.invoiceAmout) {
                    this.promot.promotMsg = '发票金额不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (isNaN(this.invoiceData.invoiceAmout) || this.invoiceData.invoiceAmout <= 0) {
                    this.promot.promotMsg = '发票金额必须是有效数字！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.invoiceData.currencyCode || !this.invoiceData.currencyName) {
                    this.promot.promotMsg = '币种不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.invoiceData.invoiceStatusCode || !this.invoiceData.invoiceStatusName) {
                    this.promot.promotMsg = '开票状态不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.invoiceData.paymentStatusCode || !this.invoiceData.paymentStatusName) {
                    this.promot.promotMsg = '支付状态不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.Ajax();            // 验证通过，执行提交
                }
            }
        },
        ready: function () {
            // 获取地址栏的参数invoiceUuid
            var invoiceUuid = this.$route.query.invoiceUuid;
            if (invoiceUuid) {
                this.title = '编辑开票';
                this.invoiceData = JSON.parse(window.sessionStorage.getItem('invoiceData'));
            }

            var currentYear = (new Date()).getFullYear();                   // 当前年份
            // 时间选择的配置文件
            var opt = {
                preset: 'date',                        // 日期
                theme: 'android-ics light',            // 皮肤样式
                display: 'modal',                      // 显示方式
                mode: 'scroller',                      // 日期选择模式
                dateFormat: 'yy-mm-dd',                // 日期格式
                lang: 'zh',                            // 显示语言
                endYear: currentYear + 10              // 结束年份
            };
            $('#expect-billing-date').mobiscroll(opt).date(opt);
            $('#actual-billing-date').mobiscroll(opt).date(opt);
            $('#expect-receipts-date').mobiscroll(opt).date(opt);
            $('#actual-receipts-date').mobiscroll(opt).date(opt);
        }
    }
</script>