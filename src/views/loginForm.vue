<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="用户登录"></heading>
        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li v-show="isCompanyShow">
                        <div class="item-content">
                            <div class="item-media"><i class="iconfont">&#xe618;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <select id="ownedCompany" v-model="selected">
                                        <option value="{{$index}}" v-for="item in ownedCompany">{{item.companyName}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="iconfont">&#xe601;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="text" placeholder="请输入用户名" id="userCode" v-model="userCode" @blur="polling">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="iconfont">&#xe604;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="password" placeholder="请输入密码" id="pwd" v-model="password" @blur="require($event)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="iconfont">&#xe603;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <label class="label-switch">
                                        <input type="checkbox" v-model="checkme">

                                        <div class="checkbox"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content-block">
                <div class="row">
                    <div class="col-50"><a href="javascript:void(0);" class="button button-big button-fill button-danger" @click="submit">立即登录</a></div>
                    <div class="col-50"><a v-link="{path: '/modpwd'}" class="button button-big button-fill">修改密码</a></div>
                </div>
            </div>
        </div>
    </div>
    <promot :promot="promot"></promot>
</template>

<script>
    var Header = require('../components/header_1.vue');
    var promot = require('../components/promot.vue');   // 发送表单的提示框
    var urlAPI = require('../js/urlAPI.js');
    var loginUrl = urlAPI.url.login;                    // 登录url
    var queryCompanyUrl = urlAPI.url.queryCompany;      // 查询公司名称
    module.exports = {
        data: function () {
            return {
                isCompanyShow: false,   // 公司下拉框是否显示
                ownedCompany: [],       // 储存公司的数组
                selected: 0,            // 公司的选中项,默认选中第一项
                userCode: '',           // 用户名
                password: '',           // 密码
                checkme: false,         // 记住密码
                promot: {
                    isLoad: false,       // ajax正在提示图标
                    promot: false,       // ajax提交完成后的提示框
                    promotMsg: ''        // 提示信息
                }
            }
        },
        components: {
            heading: Header,
            promot: promot
        },
        methods: {
            require: function (event) {
                var ele = event.target;
                if (!ele.value) {
                    if (ele.id === 'userCode') {
                        this.promot.promotMsg = '用户名不能为空！';
                    } else if (ele.id === 'pwd') {
                        this.promot.promotMsg = '请输入密码！';
                    }
                    // 提示信息框
                    this.showpromot();
                }
            },
            showpromot: function () {
                this.promot.promot = true;     // 显示提示信息
                var _this = this;

                // 隐藏提示信息
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            },
            // 查询公司
            polling: function () {
                if (!this.userCode) {
                    this.promot.promotMsg = '用户名不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.$http({
                        url: queryCompanyUrl + '?date=' + new Date().getTime(),
                        method: 'GET',
                        params: {
                            userCode: this.userCode
                        },
                        headers: {'Accept': 'application/json, text/plain, */*'},
                        emulateJSON: true
                    }).then(function (response) {
                        var result = response.json();
                        if (result.success) {
                            this.ownedCompany = result.data.ownedCompany;
                            if ((result.data.ownedCompany).length > 1) {
                                this.isCompanyShow = true;
                                this.promot.promotMsg = '请选择您的公司';
                                // 1s后，提示信息框消失
                                this.showpromot();
                            }
                        } else {
                            // 提交失败的处理方法
                            this.promot.promotMsg = '没有查询到公司信息！';
                            // 1s后，提示信息框消失
                            this.showpromot();
                        }
                    });
                }
            },
            // 登录
            submit: function () {
                if (!this.userCode) {
                    this.promot.promotMsg = '用户名不能为空！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.password) {
                    this.promot.promotMsg = '请输入密码！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.$http({
                        url: loginUrl + '?date=' + new Date().getTime(),
                        method: 'POST',
                        body: {
                            ownedCompany: this.ownedCompany[this.selected].companyName,  // 公司名
                            userCode: this.userCode.trim(),                                // 用户名
                            password: this.password.trim()                                // 密码
                        },
                        headers: {'Accept': 'application/json, text/plain, */*'},
                        emulateJSON: true,
                        before: function () {
                            // 正在提交的提示图标
                            this.promot.isLoad = true;
                            if (window.localStorage) {
                                if (this.checkme) {
                                    // 存储用户名和密码,公司名 选中项及是否显示
                                    window.localStorage.setItem('ownedCompany', JSON.stringify(this.ownedCompany));
                                    window.localStorage.setItem('selected', this.selected);
                                    window.localStorage.setItem('isCompanyShow', this.selected);
                                    window.localStorage.setItem('userCode', escape(this.userCode.trim()));
                                    window.localStorage.setItem('password', window.btoa(escape(this.password.trim())));
                                    window.localStorage.setItem('checkme', this.checkme);
                                } else {
                                    // 删除用户名和密码
                                    window.localStorage.removeItem('ownedCompany');
                                    window.localStorage.removeItem('selected');
                                    window.localStorage.removeItem('isCompanyShow');
                                    window.localStorage.removeItem('userCode');
                                    window.localStorage.removeItem('password');
                                    window.localStorage.removeItem('checkme');
                                }
                            }
                        }
                    }).then(function (response) {
                        var result = response.data;
                        if (result.success) {
                            this.promot.promotMsg = '登录成功，正在跳转…';
                            var _this = this;
                            var userInfo = result.data;
                            // 把获取的用户信息放入会话存储中
                            if (window.sessionStorage) {
                                window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                            }
                            setTimeout(function () {
                                _this.$route.router.go({name: 'home', params: {userCode: userInfo.userCode}});
                            }, 400);
                        } else {
                            // 提交失败的处理方法
                            this.promot.promotMsg = '用户名或密码错误！';
                        }
                    }, function () {
                        //  失败后执行
                        this.promot.promotMsg = '请求失败，请稍后再试！';
                    }).finally(function () {
                        this.promot.isLoad = false;    // 隐藏图标
                        // 1s后，提示信息框消失
                        this.showpromot();
                    })
                }
            }
        },
        created: function () {
            if (window.localStorage) {
                if (window.localStorage.getItem('userCode') !== null) {
                    this.ownedCompany = JSON.parse(window.localStorage.getItem('ownedCompany'));
                    this.selected = window.localStorage.getItem('selected');
                    this.isCompanyShow = window.localStorage.getItem('isCompanyShow');
                    this.userCode = unescape(window.localStorage.getItem('userCode'));
                    this.password = unescape(window.atob(window.localStorage.getItem('password')));
                    this.checkme = window.localStorage.getItem('checkme');
                }
            }
        }
    }
</script>
