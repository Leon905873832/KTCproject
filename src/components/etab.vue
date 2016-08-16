<style>
    .noData {
        text-align: center;
    }
</style>
<template>
    <div class="buttons-tab">
        <a href="javascript:void(0);" class="tab-link button" v-for="option in tabs.tabOptions"
           v-bind:class="{'active': isCur === $index}"
           v-on:click="doRequest(tabs.tabUrls[$index].url, $index)">{{option.entrustItem}}</a>
    </div>
    <div class="tabs">
        <div class="content-padded">
            <div class="searchbar">
                <div class="search-input">
                    <label class="icon icon-search" for="search"></label>
                    <input type="search" id="search" placeholder="输入关键字..." v-model="keyWord" v-on:blur="doRequest(tabs.tabUrls[tabs.tabUrls.length-1].url, 0, keyWord)" />
                </div>
            </div>
        </div>
        <div class="list-block no-icon-list">
            <!-- 查看未处理和已处理的委托，用这个模板 -->
             <ul v-if="tabTpl" v-show="tabDatas.length">
                <li v-for="tabData in tabDatas" @click="link(tabData.entrustId)">
                    <a href="javascript:void(0);" class="item-link item-content">
                        <div class="item-inner">
                            <div class="item-after">{{tabData.client}}委托我填写报销单</div>
                        </div>
                    </a>
                </li>
            </ul>

            <!-- 查看我的委托，用这个模板 -->
            <ul v-if="!tabTpl"  v-show="tabDatas.length">
                <li v-for="tabData in tabDatas" @click="link(tabData.entrustId)">
                    <a href="javascript:void(0);" class="item-link item-content">
                        <div class="item-inner">
                            <div class="item-after">我委托{{tabData.client}}填写报销单</div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <tips v-bind:tips="tips"></tips>
</template>
<script type="text/javascript">
    var urlAPI = require('../js/urlAPI.js');
    var tipsShow = urlAPI.tipsShow;
    var tips = require('./tips.vue');
    module.exports = {
        props: ['tabs'],
        data: function () {
            return {
                keyWord: '',        // 搜索框关键字
                classColor: ['color-primary', 'color-danger', 'color-success', 'color-warning'],
                isCur: '',          // 切换tab标签的样式
                tabDatas: '',         // 储存委托数据
                tips: tipsShow,
                tabTpl: true       // 根据标签的不同，选择使用不同的模板
            }
        },
        components: {
            tips: tips
        },
        methods: {
            // ajax请求方法
            doRequest: function (Url, index, data) {
                // 切换tab标签
                this.isCur = index;
                // 切换模板
                if (index === 2) {
                    this.tabTpl = false;
                } else {
                    this.tabTpl = true;
                }
                // ajax请求
                this.$http({
                    url: Url + '?date=' + new Date().getTime(),
                    method: 'GET',
                    headers: {'Accept': 'application/json, text/plain, */*'},
                    params: {
                        userCode: this.$route.params.userCode
                    },
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
                        this.$set('tabDatas', result.data.detail);
                        this.$set('keyWord', '');
                    } else {
                        // 没请求到数据的处理方法
                        this.$set('tabDatas', '');
                        this.tips.isLoad = false;    // 隐藏正在加载的图标
                        this.tips.isError = true;      // 显示错误提示
                        this.tips.errorMsg = '暂无数据！';
                    }
                    // 储存index信息，控制详情页面的按钮是否显示
                    window.sessionStorage.setItem('enTabIndex', index);
                }, function (response) {
                    //  失败后执行
                    this.$set('tabDatas', '');
                    this.tips.isLoad = false;    // 隐藏正在加载的图标
                    this.tips.isError = true;      // 显示错误提示
                    this.tips.errorMsg = '网络错误，请稍后再试！';
                })
            },
            // 跳转连接
            link: function (entrustId) {
                this.$route.router.go({name: 'entrustdetail', params: {entrustId: entrustId}});
            }
        },
        created: function () {
            this.doRequest(this.tabs.tabUrls[0].url, 0)
        }
    }
</script>