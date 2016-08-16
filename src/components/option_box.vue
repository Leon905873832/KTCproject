<template>
    <div>
        <div class="option-box" transition="slideRight">
            <div class="option-header">
                <h2>{{optionBox.optionTitle}}</h2>
                <a href="javascript:void(0);" class="close" @click="CloseOptionBox">×</a>
            </div>
            <div class="list-block media-list option-list">
                <slot></slot>
            </div>
        </div>
        <tips v-bind:tips="tips"></tips>
    </div>
</template>
<script type="text/javascript">
    var tips = require('../components/tips.vue');
    var urlAPI = require('../js/urlAPI.js');
    var tipsShow = urlAPI.tipsShow;                                 // ajax提示信息数据
    var optionBox = require('../components/option_box.vue');        // 类型选择弹框
    module.exports = {
        props: {
            /*
             * optionBox是个对象,有三个参数
             * optionTitle: '', 代表弹出框标题
             * chooseOptionData: {}, 代表已选择的数据
             * optionBoxData: [] 代表后台返回的数据
             }
             */
            optionBox: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {
                tips: tipsShow                          // 提示信息
            }
        },
        components: {
            tips: tips
        },
        methods: {
            CloseOptionBox: function () {
                this.$dispatch('close');
                this.optionBox.optionBoxData = [];
            },
            chooseOptionItem: function (index) {
                // 选择弹框内的条目
                this.optionBox.chooseOptionData = this.optionBox.optionBoxData[index];
            },
            requestOptionItems: function (url, categoryCode) {
                /*
                 * 请求弹框的内容,categoryCode是字典值,由后台确定
                 * PRJ_STS 项目状态
                 * CCY_CDE 币种
                 * PRJ_MTD 代表计费方式
                 * CTRT_STS 合同状态
                 * CTRT_TYPE 合同类型
                 * INV_TYPE  开票类型
                 * INV_STS   开票状态
                 * PYMT_STS  支付状态
                 * EXP_TYPE  发票类型
                 */
                if (categoryCode) {
                    // 判断是否根据字典值查询
                    url = url + '?categoryCode=' + categoryCode;
                }
                this.$http.get(url,{
                    before: function () {
                        this.tips.isLoad = true;        // 正在加载的提示图标
                    }
                }).then(function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = false;          // 移除错误提示
                    var result = response.data;
                    if (result.success) {
                        this.optionBox.optionBoxData = result.data.detail;
                    } else {
                        this.tips.noData = true;        // 没有数据时的情况
                    }
                }, function (response) {
                    this.tips.isLoad = false;           // 隐藏正在加载的图标
                    this.tips.isError = true;           // 显示错误提示
                    this.tips.errorMsg = '请求超时，请稍后再试！';
                });
            }
        }
    }
</script>