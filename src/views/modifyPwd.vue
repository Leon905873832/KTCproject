<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="修改密码"></heading>
        <!--内容区-->
        <div class="content">
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon iconfont">&#xe601;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="text" placeholder="请输入用户名" id="username" v-model="username" @blur="require($event)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon iconfont">&#xe604;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="password" placeholder="请输入旧密码" id="oldpwd" v-model="oldpwd" @blur="require($event)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon iconfont">&#xe604;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="password" placeholder="请输入新密码" id="newpwd" v-model="newpwd" @blur="require($event)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-media"><i class="icon iconfont">&#xe604;</i></div>
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="password" placeholder="请重新输入新密码" id="repwd" v-model="repwd" @blur="require($event)">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content-block">
                <div class="row">
                    <div class="col-50"><a href="javascript:void(0)" class="button button-big button-fill button-danger" @click="submit">提交</a></div>
                    <div class="col-50"><a v-link="{path:'/'}" class="button button-big button-fill">返回登录</a></div>
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
    var url = urlAPI.url.modpwd;
    module.exports = {
        data: function () {
            return {
                username: '',
                oldpwd: '',
                newpwd: '',
                repwd: '',
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
                    // 设置错误信息
                    if (ele.id === 'username') {
                        this.promot.promotMsg = '用户名不能为空！';
                    } else if (ele.id === 'oldpwd') {
                        this.promot.promotMsg = '请输入旧密码！';
                    } else if (ele.id === 'newpwd') {
                        this.promot.promotMsg = '请输入新密码！';
                    } else if (ele.id === 'repwd') {
                        this.promot.promotMsg = '请再次输入新密码！';
                    }
                    // 错误消息提示框
                    this.showpromot();
                } else {
                    if (ele.id === 'repwd' && this.repwd !== this.newpwd) {
                        this.promot.promotMsg = '两次密码输入不相同！';
                        // 错误消息提示框
                        this.showpromot();
                    }
                }
            },
            showpromot: function () {
                // 显示错误消息提示框
                this.promot.promot = true;
                // 1s 后隐藏错误消息
                var _this = this;
                setTimeout(function () {
                    _this.promot.promot = false;
                }, 1600);
            },
            submit: function () {
                // 提交前首先进行验证
                if (!this.username) {
                    this.promot.promotMsg = '用户名不能为空！';
                    // 错误信息框
                    this.showpromot();
                } else if (!this.oldpwd) {
                    this.promot.promotMsg = '请输入旧密码！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.newpwd) {
                    this.promot.promotMsg = '请输入新密码！';
                    // 提示信息框
                    this.showpromot();
                } else if (!this.repwd) {
                    this.promot.promotMsg = '请再次输入新密码！';
                    // 提示信息框
                    this.showpromot();
                } else if (this.repwd && this.repwd !== this.newpwd) {
                    this.promot.promotMsg = '两次密码输入不一致！';
                    // 提示信息框
                    this.showpromot();
                } else {
                    this.$http({
                        url: url + '?date=' + new Date().getTime(),
                        method: 'POST',
                        body: {
                            username: this.username,
                            oldpwd: this.oldpwd,
                            newpwd: this.newpwd
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
                            this.promot.promotMsg = '密码修改成功，请重新登录…';
                            var _this = this;
                            setTimeout(function () {
                                _this.$route.router.go('/');
                            }, 800);
                        } else {
                            // 提交失败的处理方法
                            this.promot.promotMsg = '用户名或密码错误，修改失败！';
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
                if (window.localStorage.getItem('username') !== null) {
                    this.username = unescape(window.localStorage.getItem('username'));
                    this.oldpwd = unescape(window.atob(window.localStorage.getItem('password')));
                }
            }
        }
    }
</script>
