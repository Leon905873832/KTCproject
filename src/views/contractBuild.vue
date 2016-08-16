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
                                <label class="item-title label" for="contract-code">合同编码:</label>
                                <div class="item-input">
                                    <input type="text" id="contract-code" v-model="contractData.ctrctCode">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="ctrc-status">合同状态:</label>
                                <div class="item-input" @click="openModel($event, optionItemsUrl, 'CTRT_STS')">
                                    <input type="text" id="ctrc-status" v-model="contractData.ctrctStatusName" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="ctrc-style">合同类型:</label>
                                <div class="item-input" @click="openModel($event, optionItemsUrl, 'CTRT_TYPE')">
                                    <input type="text" id="ctrc-style" v-model="contractData.ctrctTypeName" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label" for="belongTo-project">所属项目:</label>
                                <div class="item-input" @click="openModel($event, belongToProjectUrl)">
                                    <input type="text" id="belongTo-project" v-model="contractData.prjName" readonly>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner flex-start">
                                <label class="item-title label" for="ctrc-des">合同描述:</label>
                                <div class="item-input">
                                    <textarea id="ctrc-des" v-model="contractData.ctrctDesc"></textarea>
                                </div>
                            </div>
                        </div>
                    </li>
                    <!--<li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label">上传附件:</label>
                                <div class="item-input">
                                    <a href="#" class="button button-warning button-round button-affix">
                                        <input type="file" id="add-btn-file" />+
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <label class="item-title label">附件名称</label>
                                <div class="item-input">
                                    <a href="#" class="button button-warning button-round button-affix">&times;</a>
                                </div>
                            </div>
                        </div>
                    </li>-->
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
        <option-box :option-box="projectOptionBox" v-show="projectOptionBoxShow" @close="toggleProject" v-ref:project>
            <ul>
                <li v-for="item in projectOptionBox.optionBoxData">
                    <label class="label-checkbox item-content">
                        <input type="radio" name="radio" @click="sureItem($index)">
                        <div class="item-media">
                            <i class="icon icon-form-checkbox"></i>
                        </div>
                        <div class="item-inner">
                            <div class="item-subtitle">{{item.projectName}}</div>
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
    var Util = require('../js/Util');                               // 全局公用方法
    var contractBuildUrl = urlAPI.url.contractBuild;                // 合同提交地址
    var optionItemsUrl = urlAPI.url.optionItems;                    // 弹出框里面的条目地址
    var belongToProjectUrl = urlAPI.url.belongToProject;            // 查询所属项目地址
    var promot = require('../components/promot.vue');               // 发送表单的提示框
    module.exports = {
        data: function () {
            return {
                title: '新建合同',
                contractData: {
                    ctrctId: '',                    // 合同,新建的时候为空，编辑的时候为查询到的值
                    ctrctCode: '',                  // 合同编码
                    ctrctStatusCode: '',            // 合同状态code
                    ctrctStatusName: '',            // 合同状态name
                    ctrctTypeCode: '',              // 合同类型code
                    ctrctTypeName: '',              // 合同类型name
                    prjUuid: '',                    // 所属项目id
                    prjCode: '',                    // 所属项目code
                    prjName: '',                    // 所属项目name
                    ctrctDesc: '',                  // 合同描述
                    ctrctAffix: []                  // 合同附件
                },
                categoryOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                projectOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                categoryOptionBoxShow: false,                   // 弹框是否显示，默认不显示
                projectOptionBoxShow: false,                    // 弹框是否显示，默认不显示
                target: '',                                     // 保存触发弹框的元素id
                optionItemsUrl: optionItemsUrl,                 // 弹出框里面的条目地址
                belongToProjectUrl: belongToProjectUrl,         // 所属项目地址
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

            showpromot: function () {
                this.promot.promot = true;     // 显示提示信息
                var _this = this;

                // 隐藏提示信息
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            },

            // 弹窗状态切换
            toggleCategory: function () {
                this.categoryOptionBoxShow = !this.categoryOptionBoxShow;
            },
            toggleProject: function () {
                this.projectOptionBoxShow = !this.projectOptionBoxShow;
            },

            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'ctrc-status':     // 合同状态
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '合同状态';
                        this.toggleCategory();
                        break;
                    case 'ctrc-style':      // 合同类型
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '合同类型';
                        this.toggleCategory();
                        break;
                    case 'belongTo-project':    // 合同项目
                        this.$refs.project.requestOptionItems(url, categoryCode);
                        this.projectOptionBox.optionTitle = '所属项目';
                        this.toggleProject();
                        break;
                }
                return false;
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'ctrc-status':     // 合同状态
                        this.$refs.category.chooseOptionItem(index);
                        this.contractData.ctrctStatusCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.contractData.ctrctStatusName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'ctrc-style':      // 合同类型
                        this.$refs.category.chooseOptionItem(index);
                        this.contractData.ctrctTypeCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.contractData.ctrctTypeName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                    case 'belongTo-project':    // 合同项目
                        this.$refs.project.chooseOptionItem(index);
                        this.contractData.prjUuid = this.projectOptionBox.chooseOptionData.projectUuid;
                        this.contractData.prjCode = this.projectOptionBox.chooseOptionData.projectCode;
                        this.contractData.prjName = this.projectOptionBox.chooseOptionData.projectName;
                        this.toggleProject();
                        break;
                }
            },

            Ajax: function () {
                // 提交表单
                this.$http.post(contractBuildUrl, {
                    'contractData': JSON.stringify(this.contractData)
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
                        this.$route.router.go({name: 'contractList'});
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
                if (!this.contractData.ctrctCode) {
                    this.promot.promotMsg = '合同代码不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.contractData.ctrctStatusCode || !this.contractData.ctrctStatusName) {
                    this.promot.promotMsg = '合同状态不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.contractData.ctrctTypeCode || !this.contractData.ctrctTypeName) {
                    this.promot.promotMsg = '合同类型不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.contractData.prjCode || !this.contractData.prjName) {
                    this.promot.promotMsg = '所属项目不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.Ajax();            // 验证通过，执行提交
                }
            }
        },
        created: function () {
            // 获取地址栏的参数projectUuid
            var ctrctId = this.$route.query.ctrctId;
            if (ctrctId) {
                this.title = '编辑合同';
                this.contractData = JSON.parse(window.sessionStorage.getItem('contractData'));
            }
        }
    }
</script>