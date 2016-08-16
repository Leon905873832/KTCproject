var baseUrl = 'http://139.196.211.185/workflow/';
module.exports = {
    tipsShow: {
        isLoad: false,          // 正在加载的提示信息，默认隐藏
        isError: false,         // 请求错误提示，默认隐藏
        errorMsg: '',           // 错误信息提示
        noData: false           // 没有数据时的提示信息
    },
    url: {
        homeUrl: baseUrl + 'menus.do',                                  // 首页功能列表
        reimListUrl: baseUrl + 'tReimbureHeads.do',                     // 我的报销单列表
        reimDetail: baseUrl + 'detailed.do',                            // 报销单详情
        apprList: baseUrl + 'approving.do',                             // 我的审批
        apprDetail: baseUrl + 'approvingdetailed.do',                   // 审批详情
        apprReason: baseUrl + 'update.do',                              // 审批意见
        // 我的委托 js按对应tab的index取值，不能更改顺序
        entrustList: [
            {
                url: baseUrl + 'untreatedentrusts.do'                   // 未处理
            },
            {
                url: baseUrl + 'treatedentrusts.do'                     // 已处理
            },
            {
                url: baseUrl + 'myentrusts.do'                          // 我的委托
            }
        ],
        entrustDetail: baseUrl + 'detailedentrust.do',                  // 委托信息
        entrustReaseon: baseUrl + 'acceptorreject.do',                  // 处理委托
        queryCompany: baseUrl + 'queryCompany.do',                      // 根据usercode查询公司名称
        login: baseUrl + 'login.do',                                    // 登录信息
        modpwd: baseUrl + 'changePassword.do',                          // 修改密码
        newReim: baseUrl + 'addtReimbureHead.do',                       // 新建报销单
        cancelReim: baseUrl + 'cancel.do',                              // 取消报销单
        belongTo: baseUrl + 'selectProject.do',                         // 所属项目
        approval: baseUrl + 'approveUsrs.do',                           // 审批人列表
        invoceStyle: baseUrl + 'attchmenttypes.do',                     // 发票类型列表
        entrust: baseUrl + 'addentrust.do',                             // 委托他人填写
        projectList: baseUrl + 'queryPmProject.do',				        // 项目列表地址
        projectDetail: baseUrl + 'viewPmProjectDetail.do',		        // 项目详情地址
        projectBuild: baseUrl + 'saveOrUpdatePmProject.do',		        // 项目新建地址
        optionItems: baseUrl + 'selectCategoryItem.do',			        // 弹出框条目地址，根据字典值查询
        projectManage: baseUrl + 'queryUserName.do',			        // 查询项目经理
        belongToProject: baseUrl + 'selectProject.do',			        // 查询所属项目地址
        contractList: baseUrl + 'searchContract.do',			        // 合同列表地址
        contractDetail: baseUrl + 'searchDetailContract.do',	        // 合同详情地址
        contractBuild: baseUrl + 'saveOrUpdateContract.do',		        // 合同新建地址
        invoiceList: baseUrl + 'queryProjectInvoicePlan.do',            // 开票列表地址
        invoiceDetail: baseUrl + 'viewProjectInvoicePlanDetail.do',		// 开票详情地址
        invoiceBuild: baseUrl + 'saveOrUpdateInvoicePlan.do',		    // 开票新建地址
        belongToContract: baseUrl + 'selectContract.do',	            // 所属合同地址
        projectMember: baseUrl + 'projectmembers.do',			        // 项目成员地址
        saveProjectMember: baseUrl + 'addorremove.do'                   // 项目成员保存地址
    }
};
