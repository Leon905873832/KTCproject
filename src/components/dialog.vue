<style>
    .dialog {
        width: 13.5rem;
        position: absolute;
        z-index: 10700;
        left: 50%;
        margin-left: -6.75rem;
        margin-top: 0;
        top: 50%;
        -webkit-transform: translate3d(0, -50%, 0);
        -ms-transform: translate3d(0, -50%, 0);
        transform: translate3d(0, -50%, 0);
        text-align: center;
        border-radius: .35rem;
        color: #3d4145;
    }

    .modal-overlay {
        z-index: 2100;
    }

    .statement {
        border: 1px solid #cccccc;
        border-radius: 3px;
        line-height: 1.8rem;
        height: 1.8rem;
        width: 100%;
        margin-top: 0.4rem;
    }

    @-webkit-keyframes zoomIn {
        from {
            opacity: 0;
            -webkit-transform: scale3d(.3, .3, .3);
            transform: scale3d(.3, .3, .3);
        }

        50% {
            opacity: 1;
        }
    }

    @keyframes zoomIn {
        from {
            opacity: 0;
            -webkit-transform: scale3d(.3, .3, .3);
            transform: scale3d(.3, .3, .3);
        }

        50% {
            opacity: 1;
        }
    }

    @-webkit-keyframes zoomOut {
        from {
            opacity: 1;
        }

        50% {
            opacity: 0;
            -webkit-transform: scale3d(.3, .3, .3);
            transform: scale3d(.3, .3, .3);
        }

        to {
            opacity: 0;
        }
    }

    @keyframes zoomOut {
        from {
            opacity: 1;
        }

        50% {
            opacity: 0;
            -webkit-transform: scale3d(.3, .3, .3);
            transform: scale3d(.3, .3, .3);
        }

        to {
            opacity: 0;
        }
    }

    .zoom-leave {
        -webkit-animation-name: zoomOut;
        animation-name: zoomOut;
    }

    .zoom-enter {
        -webkit-animation-name: zoomIn;
        animation-name: zoomIn;
    }

    .zoom-transition {
        -webkit-animation-duration: 0.2s;
        animation-duration: 0.2s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .promot {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2.2rem;
        line-height: 2.2rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
    }
</style>
<template>
    <div class="dialog" v-show="dialog.dialogShow" transition="zoom">
        <form class="modal-inner">
            <div class="modal-title">请输入拒绝理由</div>
            <div>
                <input type="text" class="statement" v-model="statement">
            </div>
        </form>
        <div class="modal-buttons">
            <span class="modal-button" @click="dialogToggle">取消</span>
            <span class="modal-button modal-button-bold" @click="doRequest">确定</span>
        </div>
    </div>
    <div class="modal-overlay" :class="{'modal-overlay-visible': dialog.dialogShow}"></div>
    <promot :promot="promot"></promot>
</template>
<script>
    var promot = require('../components/promot.vue');   // 发送表单的提示框
    module.exports = {
        props: ['dialog'],
        data: function () {
            return {
                statement: '',         // 拒绝理由
                promot: {
                    isLoad: false,       // ajax正在提示图标
                    promot: false,       // ajax提交完成后的提示框
                    promotMsg: ''        // 提示信息
                }
            }
        },
        methods: {
            dialogToggle: function () {
                this.dialog.dialogShow = false;
            },
            doRequest: function () {
                this.$http({
                    url: this.dialog.dialogUrl + '?date=' + new Date().getTime(),
                    method: 'POST',
                    body: {
                        decision: this.dialog.dialogDecision,
                        userCode: this.dialog.userCode,
                        entrustId: this.$route.params.entrustId,
                        statement: this.statement
                    },
                    headers: {'Accept': 'application/json, text/plain, */*'},
                    emulateJSON: true,
                    before: function () {
                        // 正在加载的提示图标
                        this.promot.isLoad = true;
                    }
                }).then(function (response) {
                    var result = response.data
                    if (result.success) {
                        this.promot.promotMsg = '处理成功';
                        var _this = this;
                        // 获取的会话存储中的用户信息
                        if (window.sessionStorage) {
                            var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                        }
                        setTimeout(function () {
                            _this.$route.router.go({name: 'entrustlist', params: {userCode: userCode}});
                        }, 400);
                    } else {
                        // 提交失败的处理方法
                        this.promot.promotMsg = '处理失败，请稍后再试！';
                    }
                }, function () {
                    //  失败后执行
                    this.promot.promotMsg = '网络错误，请稍后再试！';
                }).finally(function () {
                    this.promot.isLoad = false;    // 隐藏图标
                    this.dialog.dialogShow = false;     // 隐藏对话框
                    this.promot.promot = true;                 // 显示提示信息
                    // 1s后，提示信息框消失
                    var _this = this;
                    setTimeout(function () {
                        _this.promot.promot = false;
                    }, 1600);
                })
            }
        },
        components: {
            promot: promot
        }
    }
</script>