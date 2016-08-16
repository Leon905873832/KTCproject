<style>
    .noData {
        text-align: center;
    }

    /* 下拉样式 Pull down styles */
    #pullUp {
        background: #fff;
        height: 40px;
        line-height: 40px;
        padding: 5px 10px;
        border-bottom: 1px solid #ccc;
        font-weight: bold;
        font-size: 14px;
        color: #888;
        box-sizing: content-box;
    }

    #pullUp .pullUpIcon {
        display: block;
        float: left;
        width: 40px;
        height: 40px;
        background: url(../images/pull-icon@2x.png) 0 0 no-repeat;
        -webkit-background-size: 40px 80px;
        background-size: 40px 80px;
        -webkit-transition-property: -webkit-transform;
        -webkit-transition-duration: 250ms;
    }

    #pullUp .pullUpIcon {
        -webkit-transform: rotate(-180deg) translateZ(0);
    }
</style>
<template>
    <div class="buttons-tab">
        <a href="javascript:void(0);" class="tab-link button" v-for="option in tabs.tabOptions"
           :class="{'active': tabs.isCur === $index}" @click="doRequest($index)">{{option.reimItem}}</a>
    </div>
    <div class="tabs">
        <div class="content-padded">
            <div class="searchbar">
                <div class="search-input">
                    <label class="icon icon-search" for="search"></label>
                    <input type="search" id="search" placeholder="请输入单号..." v-model="keyWord"
                           @blur="doRequest(tabIndex, keyWord)"/>
                </div>
            </div>
        </div>
        <div class="list-block cards-list">
            <ul>
                <li class="card" v-for="item in tabDatas" @click="link(item.reimId)">
                    <div class="card-header">
                        <div>{{item.cardTitle}}</div>
                        <div class="appr {{tabs.classColor[item.cardState]}}">
                            <i class="iconfont">{{{tabs.icon[tabIndex]}}}</i>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-content-inner">
                            <p class="color-gray">提交于: {{item.cardDate}}</p>

                            <p>提交人：{{item.userName}}</p>

                            <p>总金额：<span class="color-danger">{{item.cardRMB | currency '&yen;'}}</span></p>

                            <p>所属项目：{{item.cardSubject}}</p>
                        </div>
                    </div>
                    <div class="card-footer" v-if="tabs.isApprove">
                        <div class="color-primary">当前审批人：{{item.cardManager}}</div>
                    </div>
                </li>
                <li class="noData" v-if="noDate">暂无数据！</li>
            </ul>
        </div>
    </div>
    <tips v-bind:tips="tips"></tips>
    <!-- <div id="pullUp" v-show="tabs.pullShow">
        <span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多...</span>
    </div> -->
</template>
<script type="text/javascript">
    var urlAPI = require('../js/urlAPI.js');
    var tipsShow = urlAPI.tipsShow;
    var tips = require('./tips.vue');       // 请求数据提示框
    module.exports = {
        props: ['tabs', 'totalMoney', 'promot'],
        data: function () {
            return {
                keyWord: '',        // 搜索框关键字
                tabDatas: [],         // 储存报销数据
                noDate: false,        // 无数据时的提示信息，默认隐藏
                tips: tipsShow,
                tabIndex: 0          // 记录当前的tab选项卡的index, 默认为零
            }
        },
        components: {
            tips: tips
        },
        methods: {
            // ajax请求方法
            doRequest: function (index, keyWord) {
                // 切换tab标签
                this.tabs.isCur = index;
                // 记录index值，以遍在别的地方使用
                this.tabIndex = index;
                // ajax请求
                this.$http({
                    url: this.tabs.tabUrls + '?date=' + new Date().getTime(),
                    method: 'GET',
                    params: {
                        'index': index,
                        'userCode': this.$route.params.userCode,
                        'keyWord': this.keyWord
                    },
                    headers: {'Accept': 'application/json, text/plain, */*'},
                    emulateJSON: true,
                    before: function () {
                        // 正在加载的提示图标
                        this.tips.isLoad = true;
                    }
                }).then(function (response) {
                    var result = response.data;
                    if (result.success) {
                        this.tips.isLoad = false;    // 隐藏正在加载的图标
                        this.tips.isError = false;     // 移除错误提示
                        this.tips.noData = false;
                        this.$set('tabDatas', result.data.detail);
                        if (index === 0) {
                            this.$set('totalMoney', result.totalMoney);
                        } else {
                            this.$set('totalMoney', 0);
                        }
                        this.$set('keyWord', '');
                    } else {
                        // 数据为空时的处理情况
                        this.tips.noData = true;
                        this.$set('tabDatas', '');
                        this.$set('totalMoney', '');
                        this.tips.isLoad = false;    // 隐藏正在加载的图标
                    }
                }, function (response) {
                    //  失败后执行
                    this.$set('tabDatas', '');
                    this.$set('totalMoney', 0);
                    this.tips.isLoad = false;    // 隐藏正在加载的图标
                    this.tips.isError = true;      // 显示错误提示
                    this.tips.errorMsg = '网络错误，请稍后再试！';
                })
            },

            // 页面跳转
            link: function (reimId) {
                if (window.sessionStorage) {
                    // 跳转前记录报销单的信息，判断是否可编辑
                    window.sessionStorage.setItem('isHanding', JSON.stringify(this.tabs.tabOptions[this.tabs.isCur].reimItem));
                }
                this.$route.router.go({name: this.tabs.tabLink, params: {reimId: reimId}});
            },

            // 提示框
            showpromot: function () {
                this.promot.promot = true;     // 显示提示信息
                var _this = this;

                // 隐藏提示信息
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            }
        },
        created: function () {
            this.doRequest(this.tabIndex)
        }
    }
</script>