<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="委托他人"></heading>
        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon iconfont">&#xe601;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="text" id="people" placeholder="请选择受托人" readonly v-model="entrust.peopleName" @click="openModel($event, trusteeUrl)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon iconfont">&#xe60f;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="text" placeholder="请输入说明" v-model="entrust.remark">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content-block">
                <a class="button button-big button-fill button-danger btn-sure" @click="submit">提交</a>
            </div>
        </div>
    </div>
    <!-- 受托人弹框 -->
    <option-box :option-box="trusteeOptionBox" v-show="trusteeOptionBoxBoxShow" @close="toggleTrustee"
                v-ref:trustee>
        <ul>
            <li v-for="item in trusteeOptionBox.optionBoxData">
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
</template>

<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var promot = require('../components/promot.vue');           // 发送表单的提示框
    var urlAPI = require('../js/urlAPI.js');
    var url = urlAPI.url.entrust;
    var trusteeUrl = urlAPI.url.approval;                      // 审批人名单地址
    var optionBox = require('../components/option_box.vue');    // 选择弹框
    module.exports = {
        data: function () {
            return {
                // 受托人信息，默认为空
                entrust: {
                    peopleCode: '',     // 受托人code
                    peopleName: '',     // 受托人name
                    remark: ''          // 备注
                },
                promot: {
                    isLoad: false,       // ajax正在提示图标
                    promot: false,       // ajax提交完成后的提示框
                    promotMsg: ''        // 提示信息
                },
                // 审批人数据
                trusteeOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                trusteeOptionBoxBoxShow: false,                 // 审批人弹框是否显示，默认不显示
                trusteeUrl: trusteeUrl,                       // 审批人地址
                target: ''                                      // 保存触发弹框的元素id
            }
        },
        methods: {
            showpromot: function () {
                this.promot.promot = true;     // 显示提示信息
                var _this = this;

                // 隐藏提示信息
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            },
            // 审批人弹窗
            toggleTrustee: function () {
                this.trusteeOptionBoxBoxShow = !this.trusteeOptionBoxBoxShow;
            },
            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'people':     // 项目状态
                        this.$refs.trustee.requestOptionItems(url, categoryCode);
                        this.trusteeOptionBox.optionTitle = '受托人';
                        this.toggleTrustee();
                        break;
                }
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'people':     // 项目状态
                        this.$refs.trustee.chooseOptionItem(index);
                        this.entrust.peopleCode = this.trusteeOptionBox.chooseOptionData.userCode;
                        this.entrust.peopleName = this.trusteeOptionBox.chooseOptionData.userName;
                        this.toggleTrustee();
                        break;
                }
            },
            submit: function () {
                // 首先进行验证，验证通过后再提交
                if (!this.entrust.peopleName) {
                    this.promot.promotMsg = '受托人不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.$http({
                        url: url + '?date=' + new Date().getTime(),
                        method: 'POST',
                        body: {
                            userCode: this.$route.params.userCode,
                            entrustUserCode: this.entrust.peopleCode,
                            entrustRemark: this.entrust.remark
                        },
                        headers: {'Accept': 'application/json, text/plain, */*'},
                        emulateJSON: true,
                        before: function () {
                            // 正在提交的提示图标
                            this.promot.isLoad = true;
                        }
                    }).then(function (response) {
                        var result = response.data;
                        if (result.success) {
                            this.promot.promotMsg = '提交成功，正在跳转…';
                            var _this = this;
                            // 获取的会话存储中的用户信息
                            if (window.sessionStorage) {
                                var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                            }
                            setTimeout(function () {
                                _this.$route.router.go({name: 'reimlist', params: {userCode: userCode}});
                            }, 400);
                        } else {
                            // 提交失败的处理方法
                            this.promot.promotMsg = '保存失败,请稍后再试！';
                        }
                    }, function () {
                        //  失败后执行
                        this.promot.promotMsg = '网络错误，请稍后再试！';
                    }).finally(function () {
                        this.promot.isLoad = false;    // 隐藏图标
                        // 1s后，提示信息框消失
                        this.showpromot();
                    })
                }
            }
        },
        components: {
            heading: Header,
            promot: promot,              // 表单提示信息框
            'option-box': optionBox      // 选择弹框
        }
    }
</script>