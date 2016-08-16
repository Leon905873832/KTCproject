<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="我的审批"></heading>
        <div class="content">
            <tabItem :tabs="tabs" v-ref:tab></tabItem>
        </div>
    </div>
</template>
<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var tabItem = require('../components/tab.vue');      // 引入tab选项卡
    var urlAPI = require('../js/urlAPI.js');
    var url = urlAPI.url.apprList;
    module.exports = {
        data: function () {
            return {
                tabs: {
                    tabOptions: [   // 选项卡
                        {
                            'reimItem': '待审批'
                        },
                        {
                            'reimItem': '已审批'
                        }
                    ],
                    classColor: ['color-primary', 'color-success'],
                    icon: ['&#xe60d;', '&#xe615;'],
                    isCur: '',          // 切换tab标签的样式
                    tabUrls: url,               // 选项url
                    tabLink: 'apprdetail',      // 页面跳转连接到该模板
                    isApprove: false            // 判断是否审批界面，显示和隐藏审批人
                },
                scroll: {
                    startX: 0,
                    endX: 0,
                    startY: 0,
                    endY: 0,
                    scrolltop: 0,
                    scrollheight: 0,
                    clientheight: 0
                }
            }
        },
        components: {
            heading: Header,
            tabitem: tabItem         // 注册tab选项卡，组件名为tabitem
        }
    }
</script>