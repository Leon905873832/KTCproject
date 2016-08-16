<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="委托信息"></heading>
        <div class="content">
            <div class="card">
                <div class="card-header">委托人：{{entrustMsg.client}}</div>
                <div class="card-content">
                    <div class="card-content-inner">备注：{{entrustMsg.entrustMsg}}</div>
                </div>
                <div class="card-footer">状态：{{entrustState[entrustMsg.style]}}</div>
            </div>
            <div class="content-block" v-if="showHandBtn">
                <div class="row">
                    <div class="col-50"><a class="button button-big button-fill button-danger" @click="accept">接受</a></div>
                    <div class="col-50"><a class="button button-big button-fill" @click="dialogToggle">拒绝</a></div>
                </div>
            </div>
        </div>
    </div>
    <tips v-bind:tips="tips"></tips>
    <dialog :dialog="dialog"></dialog>
</template>
<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var tips = require('../components/tips.vue');
    var urlAPI = require('../js/urlAPI.js');
    var url = urlAPI.url.entrustDetail;
    var handleUrl = urlAPI.url.entrustReaseon;
    var tipsShow = urlAPI.tipsShow;
    var Dialog = require('../components/dialog.vue');
    module.exports = {
        data: function () {
            return {
                entrustState: {
                    refuse: '已拒绝',
                    accept: '已填写',
                    unhandled: '未处理'
                },
                entrustMsg: '',
                url: url,
                tips: tipsShow,
                showHandBtn: false,                     // 处理按钮的显示隐藏，默认隐藏
                //  对话框数据
                dialog: {
                    userCode: '',                       // 处理人的userCode
                    dialogDecision: '',                 // 委托结果 接受或拒绝 1或0
                    dialogUrl: handleUrl,
                    dialogShow: false,
                    dialogTitle: '请输入处理意见！'      // 对话框标题
                }
            }
        },
        methods: {
            dialogToggle: function () {
                this.dialog.dialogDecision = 'refuse';
                this.dialog.dialogShow = true
            },
            accept: function () {
                this.dialog.dialogDecision = 'accept';
                var entrustData = {
                    decision: this.dialog.dialogDecision,
                    userCode: this.dialog.userCode,
                    clientName: this.entrustMsg.client,
                    entrustId: this.$route.params.entrustId
                };
                window.sessionStorage.setItem('entrustData', JSON.stringify(entrustData));
                this.$route.router.go({name: 'newreim', params: {reimId: 'new'}});
            }
        },
        components: {
            heading: Header,
            dialog: Dialog,     // 弹出框
            tips: tips          // 提示信息
        },
        created: function () {
            if (window.sessionStorage) {
                // 获取操作人id
                this.dialog.userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                // 获取上一页的index,判断按钮是否显示
                var enTabIndex = window.sessionStorage.getItem('enTabIndex');
                if (enTabIndex === '0') {
                    this.showHandBtn = true;
                } else {
                    this.showHandBtn = false;
                }
            }
            this.$http({
                url: url + '?date=' + new Date().getTime(),
                method: 'GET',
                headers: {'Accept': 'application/json, text/plain, */*'},
                params: {
                    entrustId: this.$route.params.entrustId
                },
                emulateJSON: true,
                before: function () {
                    // 正在加载的提示图标
                    this.tips.isLoad = true;
                }
            }).then(function (response) {
                var result = response.data;
                if (result.success) {
                    this.tips.isError = false;     // 移除错误提示
                    if (result.data) {
                        this.tips.noData = false;
                        this.$set('entrustMsg', result.data.detail);
                    } else {
                        // 数据为空时的处理情况
                        this.tips.noData = true;
                        this.$set('entrustMsg', '');
                    }
                } else {
                    // 没请求到数据的处理方法
                    this.$set('entrustMsg', '');
                    this.tips.isError = true;      // 显示错误提示
                    this.tips.errorMsg = '查询出错，请稍后再试！';
                }
            }, function (response) {
                // 没请求到数据的处理方法
                this.$set('entrustMsg', '');
                this.tips.isError = true;      // 显示错误提示
                this.tips.errorMsg = '网络错误，请稍后再试！';
            }).finally(function () {
                this.tips.isLoad = false;    // 隐藏正在加载的图标
            })
        }
    }
</script>