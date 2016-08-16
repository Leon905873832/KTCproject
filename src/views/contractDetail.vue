<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="合同明细"></heading>

        <!--底部操作按钮-->
        <nav class="bar bar-tab">
            <a class="tab-item button button-fill" href="javascript:void(0);" @click="editContract">编辑</a>
        </nav>

        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">合同编码：</div>
                            <div class="item-after">{{contractData.ctrctCode}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">合同状态：</div>
                            <div class="item-after">{{contractData.ctrctStatusName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">合同类型：</div>
                            <div class="item-after">{{contractData.ctrctTypeName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">所属项目：</div>
                            <div class="item-after">{{contractData.prjName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">合同描述：</div>
                            <div class="item-after">{{contractData.ctrctDesc}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <tips v-bind:tips="tips"></tips>
    </div>
</template>
<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var urlAPI = require('../js/urlAPI.js');
    var tips = require('../components/tips.vue');
    var Util = require('../js/Util');                       // 全局公用方法
    var contractDetailUrl = urlAPI.url.contractDetail;      // 合同详情地址
    var tipsShow = urlAPI.tipsShow;                         // ajax提示信息数据
    module.exports = {
        data: function () {
            return {
                contractData: {},                           // 合同明细数据
                tips: tipsShow                              // 提示信息数据
            }
        },

        components: {
            heading: Header,
            tips: tips
        },

        methods: {
            editContract: function () {
                //  转到编辑合同页面
                window.sessionStorage.setItem('contractData', JSON.stringify(this.contractData));
                this.$route.router.go({name: 'contractBuild', query: {ctrctId: this.contractData.ctrctId}});
            },

            // 返回上一页
            goBack: Util.goBack,

            doRequest: function (url) {
                // 获取地址栏的参数ctrctId
                var ctrctId = this.$route.query.ctrctId;

                // 项目明细请求地址加参数
                url = url + '?ctrctId=' + ctrctId;

                // ajax请求合同明细
                this.$http.get(url,{
                    before: function () {
                        this.tips.isLoad = true;            // 正在加载的提示图标
                    }
                }).then(function (response) {
                    this.tips.isLoad = false;               // 隐藏正在加载的图标
                    this.tips.isError = false;              // 移除错误提示
                    var result = response.data;
                    if (result.success) {
                        this.contractData = result.data.detail;
                    } else {
                        this.tips.noData = true;            // 没有数据时的情况
                    }
                }, function (response) {
                    this.tips.isLoad = false;               // 隐藏正在加载的图标
                    this.tips.isError = true;               // 显示错误提示
                    this.tips.errorMsg = '请求超时，请稍后再试！';
                });
            }
        },
        created: function () {
            this.doRequest(contractDetailUrl);
        }
    }
</script>