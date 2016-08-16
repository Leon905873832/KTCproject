<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="开票明细"></heading>

        <!--底部操作按钮-->
        <nav class="bar bar-tab">
            <a class="tab-item button button-fill" href="javascript:void(0);" @click="editInvoice">编辑</a>
        </nav>

        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">所属合同：</div>
                            <div class="item-after">{{invoiceData.contractCode}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">开票类型：</div>
                            <div class="item-after">{{invoiceData.invoiceTypeName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">开票金额：</div>
                            <div class="item-after">{{invoiceData.invoiceAmout}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">币种：</div>
                            <div class="item-after">{{invoiceData.currencyName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">{{invoiceDate.expect}}：</div>
                            <div class="item-after">{{invoiceData.estimateInvoiceDate}}</div>
                        </div>
                    </li>

                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">{{invoiceDate.actual}}：</div>
                            <div class="item-after">{{invoiceData.actualInvoiceDate}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">开票状态：</div>
                            <div class="item-after">{{invoiceData.invoiceStatusName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">预计支付日：</div>
                            <div class="item-after">{{invoiceData.paymentDueDate}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">实际支付日：</div>
                            <div class="item-after">{{invoiceData.actualPaidDate}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">支付状态：</div>
                            <div class="item-after">{{invoiceData.paymentStatusName}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <tips v-bind:tips="tips"></tips>
</template>
<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var urlAPI = require('../js/urlAPI.js');
    var tips = require('../components/tips.vue');
    var Util = require('../js/Util');                   // 全局公用方法
    var invoiceDetailUrl = urlAPI.url.invoiceDetail;    // 发票详情地址
    var tipsShow = urlAPI.tipsShow;                     // ajax提示信息数据
    module.exports = {
        data: function () {
            return {
                invoiceData: [],                        // 合同明细数据
                invoiceDate: {                          // 开票/收票的提示文字，客户发票显示开票日，供应商发票显示收票
                    expect: '预计开票日',
                    actual: '实际开票日'
                },
                tips: tipsShow                          // 提示信息数据
            }
        },
        components: {
            heading: Header,
            tips: tips
        },
        methods: {
            editInvoice: function () {
                //  转到编辑开票页面
                window.sessionStorage.setItem('invoiceData', JSON.stringify(this.invoiceData));
                this.$route.router.go({name: 'invoiceBuild', query: {invoiceUuid: this.invoiceData.invoiceUuid}});
            },

            // 返回上一页
            goBack: Util.goBack,

            doRequest: function (url) {
                // 获取地址栏的参数invoiceUuid
                var invoiceUuid = this.$route.query.invoiceUuid;

                // 项目明细请求地址加参数
                url = url + '?invoiceUuid=' + invoiceUuid;

                // ajax请求发票明细
                this.$http.get(url,{
                    before: function () {
                        this.tips.isLoad = true;        // 正在加载的提示图标
                    }
                }).then(function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = false;          // 移除错误提示
                    var result = response.data;
                    if (result.success) {
                        this.invoiceData = result.data.detail;
                        if (this.invoiceData.invoiceTypeCode === 'AR') {
                            this.invoiceDate.expect = '预计开票日';
                            this.invoiceDate.actual = '实际开票日';
                        } else {
                            this.invoiceDate.expect = '预计收票日';
                            this.invoiceDate.actual = '实际收票日';
                        }
                    } else {
                        this.tips.noData = true;        // 没有数据时的情况
                    }
                }, function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = true;           // 显示错误提示
                    this.tips.errorMsg = '请求超时，请稍后再试！';
                });
            }
        },
        created: function () {
            this.doRequest(invoiceDetailUrl);
        }
    }
</script>