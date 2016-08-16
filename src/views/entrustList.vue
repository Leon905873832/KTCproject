<template>
    <div class="page">
        <!--标题栏-->
        <heading art-title="我的委托"></heading>
        <div class="content">
            <entrust :tabs="tabs"></entrust>
        </div>
    </div>
</template>
<script type="text/javascript">
    var Header = require('../components/header_2.vue');
    var entrust = require('../components/etab.vue');      // 引入tab选项卡
    var urlAPI = require('../js/urlAPI.js');
    var url = urlAPI.url.entrustList;
    module.exports = {
        data: function () {
            return {
                tabs: {
                    tabOptions: [   // 选项卡
                        {
                            'entrustItem': '未处理'
                        },
                        {
                            'entrustItem': '已处理'
                        },
                        {
                            'entrustItem': '我的委托'
                        }
                    ],
                    tabUrls: url       // 选项url
                }
            }
        },
        components: {
            heading: Header,
            entrust: entrust         // 注册tab选项卡，组件名为tabitem
        }
    }
</script>