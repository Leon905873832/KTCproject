<template>
    <div class="page">
        <!--标题-->
        <header class="bar bar-nav">
            <a class="icon iconfont pull-left" @click="goback">&#xe600;</a>
            <button class="button pull-right" v-if="isEdit" @click="addInvoceItem">添加</button>

            <h1 class="title">{{artTitle}}</h1>
        </header>
        <!--工具栏-->
        <nav class="bar bar-tab" v-if="isEdit">
            <a class="tab-item external button button-fill" href="javascript:void(0);" @click="doRequest(0)">提交</a>
            <a class="tab-item external button button-fill" href="javascript:void(0);" @click="doRequest(1)">保存</a>
            <a class="tab-item external button button-fill" href="javascript:void(0);" @click="cancel(2)">取消</a>
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
                            <div class="item-title">总金额</div>
                            <div class="item-after" :class="{'editable': isEdit}">
                                <input type="number" v-model="reimData.totalMoney" class="itemEdit"
                                       v-if="isEdit">
                                <div v-if="!isEdit">{{reimData.totalMoney | currency '&yen;'}}</div>
                            </div>
                        </div>
                    </li>
                    <li class="item-content" :class="{'item-link': isEdit}" id="belong-to-project"
                        @click="openModel($event, belongToUrl)">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">所属项目</div>
                            <div class="item-after">
                                {{reimData.belongToProjectName}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content" :class="{'item-link': isEdit}" id="approve"
                        @click="openModel($event, approvalUrl)">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">审批人</div>
                            <div class="item-after">
                                {{reimData.approveManagerName}}
                            </div>
                        </div>
                    </li>
                    <li class="item-content" :class="{'item-link': isEdit}" @click="remarkShow">
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
                    <li class="item-content" :class="{'item-link': isEdit}" id="invoice-type"
                        @click="openModel($event, optionItemsUrl, 'EXP_TYPE')">
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
                                <input type="number" v-model="item.money" class="itemEdit" v-if="isEdit"
                                       autofocus="autofocus" @change="sum">
                                <div v-if="!isEdit">{{item.money | currency '&yen;'}}</div>
                            </div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">发票日期</div>
                            <div class="item-after">
                                <input type="text" v-model="item.date" class="itemEdit invoice-date" v-if="isEdit">
                                <div v-if="!isEdit">{{item.date}}</div>
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
                                <p class="add-btn" v-if="isEdit">
                                    <input type="file" id="add-btn-file" @change="upload($event.target.files, $index)"
                                           accept="image/*" capture/>+
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 所属项目弹框 -->
        <option-box :option-box="belongProjectOptionBox" v-show="belongProjectOptionBoxShow"
                    @close="toggleBelongProject" v-ref:bolong-to-project>
            <ul>
                <li v-for="item in belongProjectOptionBox.optionBoxData">
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
        <!-- 备注弹框 -->
        <div class="option-box" v-show="optionBox.remark" transition="slideRight">
            <div class="list-block media-list">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-input">
                                    <textarea v-model="optionBox.remarkText"></textarea>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="content-block">
                    <a href="javascript:void(0)" class="button button-big button-fill button-danger"
                       @click="remarkConfirm">确定</a>
                </div>
            </div>
        </div>
        <!-- 发票类型弹框 -->
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
        <!-- 查看图片弹框 -->
        <div class="img-bg" v-show="invoceBigImg">
            <div class="img-bar">
                <img :src="invoceBigSrc" alt="发票图片">
                <a href="javascript:void(0);" @click="HideBigImg">&#215;</a>
            </div>
            <a href="javascript:void(0);" class="button button-fill button-danger button-big" v-if="isEdit"
               @click="removeImg()">删除</a>
        </div>
    </div>
    <promot :promot="promot"></promot>
</template>
<script>
    var promot = require('../components/promot.vue');   // 发送表单的提示框
    var urlAPI = require('../js/urlAPI.js');
    var buildUrl = urlAPI.url.newReim;                  // 报销单提交地址
    var cancelUrl = urlAPI.url.cancelReim;              // 报销单取消地址
    var belongToUrl = urlAPI.url.belongTo;              // 所属项目地址
    var approvalUrl = urlAPI.url.approval;              // 审批人名单地址
    var optionItemsUrl = urlAPI.url.optionItems;        // 发票类型名单地址
    var reimDetail = urlAPI.url.reimDetail;
    var tipsShow = urlAPI.tipsShow;
    var tips = require('../components/tips.vue');       // ajax提示信息
    var optionBox = require('../components/option_box.vue');     // 类型选择弹框
    module.exports = {
        data: function () {
            return {
                isEdit: true,                           // 用于判断页面是编辑或查看状态，查看状态时隐藏部分按纽
                artTitle: '新建报销单',
                tips: tipsShow,                         // 提示信息
                // 审批信息
                apprProgress: [],
                // 新建报销信息，默认为空
                reimData: {
                    reimId: this.$route.params.reimId,      // 报销单id，新建为new
                    userCode: '',                           // 用户code
                    userName: '',                           // 用户名
                    totalMoney: '',                         // 总金额
                    belongToProjectCode: '',                // 所属项目code
                    belongToProjectName: '',                // 所属项目name
                    approveManagerName: '',                 // 审批人姓名
                    approveManagerCode: '',                 // 审批人code
                    remark: '',                             // 说明
                    invoceDetail: [],                       // 发票信息，默认为空
                    entrustData: {}                         // 委托信息, 存储接收到的委托信息表
                },
                // 记录查看大图时，当前图片的位置
                invoceImgIndex: {
                    parentIndex: '',
                    selfIndex: ''
                },
                invoceBigImg: false,                    // 发票大图，默认隐藏
                invoceBigSrc: '',                       // 发票大图地址

                belongToUrl: belongToUrl,               // 所属项目弹框
                approvalUrl: approvalUrl,               // 审批人地址
                optionItemsUrl: optionItemsUrl,         // 弹出框里面的条目地址

                // 所属项目数据
                belongProjectOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                belongProjectOptionBoxShow: false,              // 所属项目弹框是否显示，默认不显示
                target: '',                                     // 保存触发弹框的元素id
                optionBox: {
                    remark: false,
                    remarkText: ''                              // 用户输出的备注文本
                },
                // 审批人数据
                approveOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                approveOptionBoxBoxShow: false,                 // 审批人弹框是否显示，默认不显示
                categoryOptionBox: {
                    optionTitle: '',                            // 弹出框标题
                    chooseOptionData: {},                       // 选择的数据
                    optionBoxData: []                           // 项目状态数据
                },
                categoryOptionBoxShow: false,                   // 弹框是否显示，默认不显示
                promot: {
                    isLoad: false,              // ajax正在提示图标
                    promot: false,              // ajax提交完成后的提示框
                    promotMsg: ''               // 提示信息
                }
            }
        },
        methods: {
            goback: function () {
                window.history.back();
            },
            addInvoceItem: function () {
                var now = new Date();
                var year = now.getFullYear().toString();
                var month = now.getMonth() + 1;
                var day = now.getDate().toString();
                var addZero = function (num) {  // 小于10,前面补零
                    var str = '';
                    if (parseInt(num) < 10) {
                        str = '0' + num;
                    } else {
                        str = num.toString();
                    }
                    return str;
                };
                month = addZero(month);
                day = addZero(day);
                var date = year + '-' + month + '-' + day;
                this.reimData.invoceDetail.unshift({
                    invoiceTypeCode: '',            // 发票类型Code
                    invoiceTypeName: '',            // 发票类型Name
                    money: '',                      // 发票金额
                    date: date,                     // 发票日期
                    imgsrc: []                      // 图片src
                });
            },
            upload: function (files, index) {
                var canvas = document.createElement('canvas');
                var file = files[0];
                var reader = new window.FileReader();
                var _this = this;
                reader.onload = function (e) {
                    var img = new window.Image();       // 创建一个img对象
                    img.src = e.target.result;          // 把img指向新取得的图片地址
                    // 配合canvas压缩图片
                    img.onload = function () {
                        if (img.width > 2400 || img.height > 2400) {
                            canvas.width = img.width / 8;
                            canvas.height = img.height / 8;
                        } else if (img.width > 1200 || img.height > 1200) {
                            canvas.width = img.width / 4;
                            canvas.height = img.height / 4;
                        } else if (img.width > 600 || img.height > 600) {
                            canvas.width = img.width / 2;
                            canvas.height = img.height / 2;
                        } else {
                            canvas.width = img.width;
                            canvas.height = img.height;
                        }
                        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                        _this.reimData.invoceDetail[index].imgsrc.push({src: canvas.toDataURL()});
                    }
                };
                reader.readAsDataURL(file);
            },
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
            removeImg: function () {
                // 删除图片
                this.reimData.invoceDetail[this.invoceImgIndex.parentIndex].imgsrc.splice(this.invoceImgIndex.selfIndex, 1);
                // 关闭弹窗
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
            doRequest: function (index) {
                // 首先进行验证，验证通过后再提交
                if (!this.reimData.userName) {
                    this.promot.promotMsg = '用户名不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.reimData.totalMoney || this.reimData.totalMoney <= 0) {
                    this.promot.promotMsg = '总金额不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!!this.reimData.totalMoney && isNaN(this.reimData.totalMoney)) {
                    this.promot.promotMsg = '总金额必须是数字！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.reimData.belongToProjectCode) {
                    this.promot.promotMsg = '所属项目不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.reimData.approveManagerCode) {
                    this.promot.promotMsg = '审批人不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.$http({
                        url: buildUrl + '?date=' + new Date().getTime(),
                        method: 'POST',
                        body: {
                            reimData: JSON.stringify(this.reimData),
                            state: index        // 提交或保存
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
                            // 获取的会话存储中的用户信息
                            if (window.sessionStorage) {
                                var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                            }
                            var _this = this;
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
            },
            // 取消
            cancel: function () {
                if (this.$route.params.reimId === 'new') {
                    this.goback();
                } else {
                    this.$http({
                        url: cancelUrl,
                        method: 'POST',
                        body: {
                            reimId: this.$route.params.reimId
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
                            this.promot.promotMsg = '取消成功，正在跳转…';
                            // 获取的会话存储中的用户信息
                            if (window.sessionStorage) {
                                var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                            }
                            var _this = this;
                            setTimeout(function () {
                                _this.$route.router.go({name: 'reimlist', params: {userCode: userCode}});
                            }, 400);
                        } else {
                            // 提交失败的处理方法
                            this.promot.promotMsg = '取消失败,请稍后再试！';
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
            },
            // 打开备注弹窗
            remarkShow: function () {
                if (this.isEdit) {
                    this.optionBox.remark = !this.optionBox.remark;
                }
            },
            // 确定备注内容并关闭弹窗
            remarkConfirm: function () {
                this.reimData.remark = this.optionBox.remarkText;
                this.optionBox.remark = !this.optionBox.remark;
            },

            // 审批人弹窗
            toggleApprove: function () {
                this.approveOptionBoxBoxShow = !this.approveOptionBoxBoxShow;
            },

            // 所属项目弹窗状态切换
            toggleBelongProject: function () {
                this.belongProjectOptionBoxShow = !this.belongProjectOptionBoxShow;
            },

            // 弹窗状态切换
            toggleCategory: function () {
                this.categoryOptionBoxShow = !this.categoryOptionBoxShow;
            },

            openModel: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.currentTarget.id;
                switch (this.target) {
                    case 'belong-to-project':     // 项目状态
                        this.$refs.bolongToProject.requestOptionItems(url, categoryCode);
                        this.belongProjectOptionBox.optionTitle = '所属项目';
                        this.toggleBelongProject();
                        break;

                    case 'approve':     // 项目状态
                        this.$refs.approve.requestOptionItems(url, categoryCode);
                        this.approveOptionBox.optionTitle = '审批人';
                        this.toggleApprove();
                        break;
                    case 'invoice-type':    // 发票类型
                        this.$refs.category.requestOptionItems(url, categoryCode);
                        this.categoryOptionBox.optionTitle = '发票类型';
                        this.toggleCategory();
                        break;
                }
            },

            sureItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'belong-to-project':     // 项目状态
                        this.$refs.bolongToProject.chooseOptionItem(index);
                        this.reimData.belongToProjectCode = this.belongProjectOptionBox.chooseOptionData.projectCode;
                        this.reimData.belongToProjectName = this.belongProjectOptionBox.chooseOptionData.projectName;
                        this.toggleBelongProject();
                        break;
                    case 'approve':     // 审批人
                        this.$refs.approve.chooseOptionItem(index);
                        this.reimData.approveManagerCode = this.approveOptionBox.chooseOptionData.userCode;
                        this.reimData.approveManagerName = this.approveOptionBox.chooseOptionData.userName;
                        this.toggleApprove();
                        break;
                    case 'invoice-type':    // 发票类型
                        this.$refs.category.chooseOptionItem(index);
                        this.reimData.invoceDetail[this.invoceImgIndex.parentIndex].invoiceTypeCode = this.categoryOptionBox.chooseOptionData.categoryItemCode;
                        this.reimData.invoceDetail[this.invoceImgIndex.parentIndex].invoiceTypeName = this.categoryOptionBox.chooseOptionData.categoryItemName;
                        this.toggleCategory();
                        break;
                }
            },

            // 读取会话里的用户信息
            readUser: function () {
                if (window.sessionStorage) {
                    var userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
                    this.reimData.userName = userInfo.userName;
                    this.reimData.userCode = userInfo.userCode;
                }
            },

            // 读取已存在的报销单信息
            readReim: function () {
                this.$http({
                    url: reimDetail + '?reimId=' + this.$route.params.reimId,
                    method: 'GET',
                    headers: {'Accept': 'application/json, text/plain, */*'},
                    emulateJSON: true,
                    before: function () {
                        // 正在加载的提示图标
                        this.tips.isLoad = true;
                    }
                }).then(function (response) {
                    var result = response.data;
                    if (result.success) {
                        this.tips.isLoad = false;       // 隐藏正在加载的图标
                        this.tips.isError = false;      // 移除错误提示
                        this.$set('reimData', result.data.detail);
                        this.apprProgress = result.data.apprProgress;
                        this.readUser();
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
            },

            // 计算总金额
            sum: function () {
                var sum = 0;
                this.reimData.invoceDetail.forEach(function (value) {
                    sum += Number(value.money);
                });
                this.reimData.totalMoney = sum.toFixed(2);
            }
        },
        components: {
            'option-box': optionBox,    // 选择弹框
            tips: tips,                 // 请求错误提示信息
            promot: promot              // 表单提示信息框
        },
        ready: function () {
            if (window.sessionStorage) {
                var isHanding = JSON.parse(window.sessionStorage.getItem('isHanding'));
                // 存在该信息，说明是查看报销单，需要请求数据
                if (isHanding) {
                    this.readReim();
                    this.artTitle = '查看报销单';
                    // 只有待处理的信息才是可以编辑的
                    if (isHanding === '待处理') {
                        this.isEdit = true;
                    } else {
                        this.isEdit = false;
                    }
                } else {
                    // 新建报销 进入页面时，先添加一条新发票选项
                    this.addInvoceItem();
                    this.isEdit = true;
                    var entrustData = JSON.parse(window.sessionStorage.getItem('entrustData'));
                    if (entrustData) {
                        this.reimData.userName = entrustData.clientName;
                        this.reimData.entrustData = entrustData;
                        window.sessionStorage.removeItem('entrustData');
                    } else {
                        this.readUser();
                    }
                }
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
            $('.content').on('touchstart', '.invoice-date', function () {
                $(this).mobiscroll(opt).date(opt);
            });
        },
        beforeDestroy: function () {
            // 离开该页前，销毁会话信息中的isHanding条目，防止重新进入新建页面出错
            window.sessionStorage.removeItem('isHanding');
        }
    }
</script>