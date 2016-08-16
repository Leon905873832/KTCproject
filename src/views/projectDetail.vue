<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="项目明细"></heading>

        <!--底部操作按钮-->
        <nav class="bar bar-tab">
            <a class="tab-item button button-fill" href="javascript:void(0);" @click="editProject">编辑</a>
            <a class="tab-item button button-fill button-success" href="javascript:void(0);" @click="editMember">成员</a>
        </nav>

        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">项目编码</div>
                            <div class="item-after">{{projectData.projectCode}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">项目名称</div>
                            <div class="item-after">{{projectData.projectName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">项目状态</div>
                            <div class="item-after">{{projectData.projectStatusName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">客户名称</div>
                            <div class="item-after">{{projectData.customerName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">项目金额</div>
                            <div class="item-after">{{projectData.estimateRevenue}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">合同金额</div>
                            <div class="item-after">{{projectData.contractRevenue}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">币种</div>
                            <div class="item-after">{{projectData.currencyName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">计费方式</div>
                            <div class="item-after">{{projectData.projectPricingMethodName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">项目经理</div>
                            <div class="item-after">{{projectData.managerName}}</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">项目描述</div>
                            <div class="item-after">{{projectData.projectDescription}}</div>
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
    var Util = require('../js/Util');                   // 全局公用方法
    var projectDetailUrl = urlAPI.url.projectDetail;    // 项目详情地址
    var tipsShow = urlAPI.tipsShow;                     // ajax提示信息数据
    module.exports = {
        data: function () {
            return {
                tips: tipsShow,                         // 提示信息
                projectData: {}                         // 工程明细数据
            }
        },
        components: {
            heading: Header,
            tips: tips
        },
        methods: {
            editProject: function () {
                //  转到编辑工程项目页面
                window.sessionStorage.setItem('projectData', JSON.stringify(this.projectData));
                this.$route.router.go({name: 'projectBuild', query: {projectUuid: this.projectData.projectUuid}});
            },
            editMember: function () {
                // 转到编辑成员界面
                this.$route.router.go({name: 'projectMember', query: {projectUuid: this.projectData.projectUuid}});
            },

            // 返回上一页
            goBack: Util.goBack,

            doRequest: function (url) {
                // 获取地址栏的参数projectUuid
                var projectUuid = this.$route.query.projectUuid;

                // 项目明细请求地址加参数
                url = url + '?projectUuid=' + projectUuid;

                // ajax请求工程明细
                this.$http.get(url, {
                    before: function () {
                        this.tips.isLoad = true;        // 正在加载的提示图标
                    }
                }).then(function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = false;          // 移除错误提示
                    var result = response.data;
                    if (result.success) {
                        this.projectData = result.data.detail;
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
            this.doRequest(projectDetailUrl);
        }
    }
</script>