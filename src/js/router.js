var Login = require('../views/loginForm.vue');                  // 登录
var modPwd = require('../views/modifyPwd.vue');                 // 修改密码
var Home = require('../views/home.vue');                        // 主页
var reimList = require('../views/reimList.vue');                // 报销单列表
var newReim = require('../views/newReim.vue');                  // 新建报销单
var apprList = require('../views/apprList.vue');                // 审批人列表
var apprDetail = require('../views/apprDetail.vue');            // 审批人详情
var entrust = require('../views/entrust.vue');                  // 委托他人
var entrustList = require('../views/entrustList.vue');          // 委托列表
var entrustDetail = require('../views/entrustDetail.vue');      // 委托详情
var projectList = require('../views/projectList.vue');          // 项目列表
var projectDetail = require('../views/projectDetail.vue');      // 项目详情
var projectBuild = require('../views/projectBuild.vue');        // 新建项目
var projectMember = require('../views/projectMember.vue');      // 项目成员
var contractList = require('../views/contractList.vue');        // 合同列表
var contractDetail = require('../views/contractDetail.vue');    // 合同详情
var contractBuild = require('../views/contractBuild.vue');      // 新建合同
var invoiceList = require('../views/invoiceList.vue');          // 发票列表
var invoiceDetail = require('../views/invoiceDetail.vue');        // 开票明细
var invoiceBuild = require('../views/invoiceBuild.vue');        // 新建发票

var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);
var router = new VueRouter();
router.map({
    '/': {
        component: Login 		            // 登录页面，默认页面
    },
    '/modpwd': {
        component: modPwd                   // 修改密码页面
    },
    '/home/:userCode': {
        name: 'home', 			            // 给这条路径加上一个名字
        component: Home 		            // 首页功能列表
    },
    '/reimlist/:userCode': {
        name: 'reimlist',
        component: reimList 	            // 报销单列表
    },
    '/newreim/:reimId': {
        name: 'newreim',
        component: newReim 			        // 新建报销单
    },
    '/apprlist/:userCode': {
        name: 'apprlist',
        component: apprList 		        // 审批列表
    },
    '/apprdetail/:reimId': {
        name: 'apprdetail',
        component: apprDetail 		        // 审批详情
    },
    '/entrust/:userCode': {
        name: 'entrust',
        component: entrust 			        // 委托他人
    },
    '/entrustlist/:userCode': {
        name: 'entrustlist',
        component: entrustList 		        // 委托处理列表
    },
    '/entrustdetail/:entrustId': {
        name: 'entrustdetail',
        component: entrustDetail 	        // 委托信息页面
    },
    '/projectList.html': {
        name: 'projectList',
        component: projectList              // 项目列表页面
    },
    '/projectDetail.html': {
        name: 'projectDetail',
        component: projectDetail            // 项目详情页面
    },
    '/projectBuild.html': {
        name: 'projectBuild',
        component: projectBuild             // 新建项目页面
    },
    '/projectMember.html': {
        name: 'projectMember',
        component: projectMember            // 项目成员页面
    },
    '/contractList.html': {
        name: 'contractList',
        component: contractList             // 合同列表页面
    },
    '/contractDetail.html': {
        name: 'contractDetail',
        component: contractDetail           // 合同详情页面
    },
    '/contractBuild.html': {
        name: 'contractBuild',
        component: contractBuild            // 新建合同页面
    },
    '/invoiceList.html': {
        name: 'invoiceList',
        component: invoiceList              // 新建开票页面
    },
    '/invoiceDetail.html': {
        name: 'invoiceDetail',
        component: invoiceDetail            // 开票详情页面
    },
    '/invoiceBuild.html': {
        name: 'invoiceBuild',
        component: invoiceBuild             // 开票详情页面
    }
});
router.beforeEach(function (transition) {
    if (!window.sessionStorage.getItem('userInfo') && transition.to.path !== '/' && transition.to.path !== '/modpwd') {
        transition.redirect('/');
        return false;
    }
    return true;
});
module.exports = router;
