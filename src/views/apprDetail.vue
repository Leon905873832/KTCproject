<template>
    <div class="page">
        <!--标题-->
        <heading art-title="我的审批"></heading>
        <!--工具栏-->
        <nav class="bar bar-tab" v-if="isAppr">
            <a class="tab-item external button button-fill" href="javascript:void(0);" @click="approvalOpinion($event)">通过</a>
            <a class="tab-item external button button-fill button-danger" href="javascript:void(0);" @click="approvalOpinion($event)">拒绝</a>
        </nav>
        <!--内容区-->
        <div class="content">
            <div class="list-block" v-if="apprProgress.length">
                <ul>
                    <li class="item-content" v-for="item in apprProgress">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">{{item.apprManager}}</div>
                            <div class="item-after">
                                {{item.apprSuggest}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list-block">
                <ul>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">用户</div>
                            <div class="item-after">
                                {{reimData.userName}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">金额</div>
                            <div class="item-after">
                                {{reimData.totalMoney | currency '&yen;'}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">所属项目</div>
                            <div class="item-after">
                                {{reimData.belongToProjectName}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">审批人</div>
                            <div class="item-after">
                                {{reimData.approveManagerName}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">备注</div>
                            <div class="item-after">
                                {{reimData.remark}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list-block" v-for="item in reimData.invoceDetail" @click="recordIndex($index)">
                <ul>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">发票类型</div>
                            <div class="item-after">
                                {{item.invoiceTypeName}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">发票金额</div>
                            <div class="item-after">
                                {{item.money | currency '&yen;'}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">发票日期</div>
                            <div class="item-after">
                                {{item.date}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">发票图片</div>
                            <div class="item-after">
                                <div class="breviary-img">
                                    <img v-for="img in item.imgsrc" :src="img.src" width="28" height="28" alt="发票缩略图"
                                         @click="setSrc($event, $index)">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 审批弹框 -->
        <div class="option-box" v-show="optionBox.approval" transition="slideRight">
            <div class="option-header">
                <h2>审批意见</h2>
                <a href="javascript:void(0);" class="close" @click="optionBox.approval = false">×</a>
            </div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-input">
                                    <textarea v-model="optionBox.approvalText"></textarea>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list-block" v-if="optionBox.decision">
                <ul>
                    <li class="item-content item-link" id="approve" @click="openModel($event, approvalUrl)">
                        <div class="item-inner">
                            <div class="item-title">指定审批人</div>
                            <div class="item-after">
                                {{optionBox.apprManagerName}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content-block-title">
                <a href="javascript:void(0);" class="button button-fill button-danger button-big" @click="submit">提交</a>
            </div>
        </div>
        <!-- 审批人弹框 -->
        <option-box :option-box="approveOptionBox" v-show="approveOptionBoxBoxShow" @close="toggleApprove"
                    v-ref:approve>
            <ul>
                <li v-for="item in approveOptionBox.optionBoxData">
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
        <!-- 查看图片弹框 -->
        <div class="img-bg" v-show="invoceBigImg">
            <div class="img-bar">
                <img :src="invoceBigSrc" alt="发票图片">
                <a href="javascript:void(0);" @click="HideBigImg">&#215;</a>
            </div>
        </div>
    </div>
    <promot :promot="promot"></promot>
</template>
<script>
    var Header = require('../components/header_2.vue');
    var promot = require('../components/promot.vue');           // 发送表单的提示框
    var urlAPI = require('../js/urlAPI.js');
    var reimDetailUrl = urlAPI.url.apprDetail;                  // 报销单详情地址
    var apprReasonUrl = urlAPI.url.apprReason;                  // 审批结果提交地址
    var approvalUrl = urlAPI.url.approval;                      // 审批人名单地址
    var tipsShow = urlAPI.tipsShow;
    var tips = require('../components/tips.vue');               // ajax提示信息
    var optionBox = require('../components/option_box.vue');    // 选择弹框
    module.exports = {
        data: function () {
            return {
                tips: tipsShow,             // 提示信息
                isAppr: true,               // 审批按钮是否显示，默认显示
                // 审批信息
                apprProgress: [],
                // 报销单信息
                reimData: {},
                // 记录查看大图时，当前图片的位置
                invoceImgIndex: {
                    parentIndex: '',
                    selfIndex: ''
                },
                invoceBigImg: false,        // 发票大图，默认隐藏
                invoceBigSrc: '',           // 发票大图地址

                // 审批人数据
                approveOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                approveOptionBoxBoxShow: false,                 // 审批人弹框是否显示，默认不显示
                approvalUrl: approvalUrl,                       // 审批人地址
                target: '',                                     // 保存触发弹框的元素id
                // 选择菜单是否显示
                optionBox: {
                    approval: false,                // 审批弹框是否显示
                    approvalText: '',               // 审批意见
                    apprManagerCode: '',            // 审批人Code
                    apprManagerName: '',            // 审批人姓名
                    decision: 1                     // 审批结果，1为通过，0为拒绝
                },
                promot: {
                    isLoad: false,       // ajax正在提示图标
                    promot: false,       // ajax提交完成后的提示框
                    promotMsg: ''        // 提示信息
                }
            }
        },
        methods: {
            setSrc: function (event, index) {
                this.invoceImgIndex.selfIndex = index;    // 记录图片位置
                var src = event.target.src;
                this.invoceBigSrc = src;
                this.invoceBigImg = true;
            },
            recordIndex: function (index) {
                this.invoceImgIndex.parentIndex = index;    // 记录被点击的发票条目的位置
            },
            HideBigImg: function () {
                this.invoceBigImg = false;
            },
            showpromot: function () {
                this.promot.promot = true;     // 显示提示信息
                var _this = this;

                // 隐藏提示信息
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            },
            // 审批意见弹窗
            approvalOpinion: function (event) {
                var obj = event.currentTarget;
                var txt = obj.innerHTML;
                this.optionBox.approval = true;
                if (txt === '通过') {
                    this.optionBox.decision = 1;
                } else if (txt === '拒绝') {
                    this.optionBox.decision = 0;
                }
            },
            // 审批人弹窗
            toggleApprove: function () {
                this.approveOptionBoxBoxShow = !this.approveOptionBoxBoxShow;
            },
            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.currentTarget.id;
                switch (this.target) {
                    case 'approve':     // 项目状态
                        this.$refs.approve.requestOptionItems(url, categoryCode);
                        this.approveOptionBox.optionTitle = '审批人';
                        this.toggleApprove();
                        break;
                }
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'approve':     // 项目状态
                        this.$refs.approve.chooseOptionItem(index);
                        this.optionBox.apprManagerCode = this.approveOptionBox.chooseOptionData.userCode;
                        this.optionBox.apprManagerName = this.approveOptionBox.chooseOptionData.userName;
                        this.toggleApprove();
                        break;
                }
            },
            // 提交审批意见
            submit: function (event) {
                var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                if (this.optionBox.approvalText === '') {
                    this.promot.promotMsg = '审批意见不能为空！';
                    this.promot.promot = true;                  // 显示提示信息
                    // 1s后，提示信息框消失
                    var _this = this;
                    setTimeout(function () {
                        _this.promot.promot = false;
                    }, 1600);
                } else {
                    this.optionBox.approval = !this.optionBox.approval;
                    this.$http({
                        url: apprReasonUrl + '?date=' + new Date().getTime(),
                        method: 'POST',
                        body: {
                            userCode: userCode,
                            reimId: this.$route.params.reimId,
                            approvalText: this.optionBox.approvalText,
                            decision: this.optionBox.decision,
                            apprManager: this.optionBox.apprManagerCode
                        },
                        headers: {'Accept': 'application/json, text/plain, */*'},
                        emulateJSON: true,
                        before: function () {
                            // 正在加载的提示图标
                            this.promot.isLoad = true;
                        }
                    }).then(function (response) {
                        var result = response.data;
                        if (result.success) {
                            this.promot.promotMsg = '处理成功';
                        } else {
                            // 提交失败的处理方法
                            this.promot.promotMsg = '处理失败，请稍后再试！';
                        }
                        setTimeout(function () {
                            window.history.back();
                        }, 800);
                    }, function () {
                        //  失败后执行
                        this.promot.promotMsg = '网络错误，请稍后再试！';
                    }).finally(function () {
                        this.promot.isLoad = false;    // 隐藏图标
                        this.promot.promot = true;                 // 显示提示信息
                        // 1s后，提示信息框消失
                        var _this = this;
                        setTimeout(function () {
                            _this.promot.promot = false;
                        }, 1600);
                    })
                }
            },

            // 读取已存在的报销单信息
            readReim: function () {
                this.$http({
                    url: reimDetailUrl + '?date=' + new Date().getTime(),
                    method: 'GET',
                    headers: {'Accept': 'application/json, text/plain, */*'},
                    emulateJSON: true,
                    params: {
                        reimId: this.$route.params.reimId
                    },
                    before: function () {
                        // 正在加载的提示图标
                        this.tips.isLoad = true;
                    }
                }).then(function (response) {
                    var result = response.data;
                    if (result.success) {
                        this.tips.isLoad = false;    // 隐藏正在加载的图标
                        this.tips.isError = false;     // 移除错误提示
                        this.reimData = result.data.detail;
                        this.apprProgress = result.data.apprProgress;
                        this.reimData.invoceDetail = result.data.invoceMsg;
                    } else {
                        // 没请求到数据的处理方法
                        this.tips.isLoad = false;    // 隐藏正在加载的图标
                        this.tips.isError = true;      // 显示错误提示
                        this.tips.errorMsg = '查询出错，请稍后再试！';
                    }
                }, function () {
                    //  失败后执行
                    this.tips.isLoad = false;    // 隐藏正在加载的图标
                    this.tips.isError = true;      // 显示错误提示
                    this.tips.errorMsg = '网络错误，请稍后再试！';
                });
            }
        },
        components: {
            heading: Header,
            tips: tips,                 // 请求错误提示信息
            'option-box': optionBox,    // 选择弹框
            promot: promot              // 表单提示信息框
        },
        created: function () {
            this.readReim();
            if (window.sessionStorage) {
                var isHanding = JSON.parse(window.sessionStorage.getItem('isHanding'));
                if (isHanding === '已审批') {
                    this.isAppr = false;
                } else {
                    this.isAppr = true;
                }
            }
        }
    }
</script>