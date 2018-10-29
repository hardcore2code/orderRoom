var managerApproval;
if (!managerApproval)
	managerApproval = {};

managerApproval.pageNum = 1;
managerApproval.approvalDataList = [];
managerApproval.onLoad = function(){

	managerApproval.pageNum = 1;

	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	
	$("#managerApproval").find(".userInfoArea_userName").text(tel);
	$("#managerApproval").find(".userInfoArea_mailAddr").text(email);
	

	common.setLeftToolAuth("managerApproval","admin");
	managerApproval.getManagerPageData("");

};

managerApproval.getManagerPageData = function(content){
	$("#managerApproval_listMoreBtn").hide();
	var url = Global.BASE_URL + VisitUrl.MANAGER_QUERYAPPLYLIST;
	var param = {
		type : "0",
		pn : managerApproval.pageNum,
		ps : 10,
		content : content
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {

		var dataList = (new Function('return ' + e.dataList))();
		console.log(dataList);
		var list = $("#managerApproval_registApprovalList");
		for (var i = 0; i < dataList.length; i++) {
			var point = dataList[i].applyStatus == "1" ? "block" : "none";

			var applyStatusStr =  '';
			if(dataList[i].applyStatus == "3"){
				applyStatusStr =  '<span class="fontColor_blue">（已同意）</span>';
			}else if(dataList[i].applyStatus == "4"){
				applyStatusStr =  '<span class="fontColor_red">（已拒绝）</span>';
			}

			var listItemStr = '<li id="' + dataList[i].applyId + '"><div class="registApprovalList_newPoint bgColor_blue" style="display:' + point + '"></div><div class="registApprovalList_typeAndTime">' + 
							  '<div class="registApprovalList_type fontColor_listTypeAndTime">注册申请' + applyStatusStr + '</div>' + 
							  '<div class="registApprovalList_time fontColor_listTypeAndTime">' + dataList[i].actiondate + '</div></div><div class="registApprovalList_nameAndOperate">' + 
							  '<div class="registApprovalList_name">' + dataList[i].NAME + ' - ' + dataList[i].TEL +'</div>' + 
							  '<button class="registApprovalList_button fontColor_wordWhite bgColor_pink" style="display:' + point + '" onclick="managerApproval.refuseBtnListener(this)">驳回</button>' + 
							  '<button class="registApprovalList_button fontColor_wordWhite bgColor_blue" style="display:' + point + '" onclick="managerApproval.approvalBtnListener(this)">批准</button>' + 
							  '</div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">邮箱：' + dataList[i].MAIL + '</div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">一卡通号：' + dataList[i].cardId + '</div></li>';

		    list.append(listItemStr);

		}
			
		if(dataList.length >= 10){
			$("#managerApproval_listMoreBtn").show();
		}

		if(managerApproval.pageNum == 1){
			managerApproval.approvalDataList = [];
			managerApproval.approvalDataList = dataList;
		}else{
			for (var i = 0; i < dataList.length; i++) {
				managerApproval.approvalDataList.push(dataList[i]);
			}
		}

		common.getLeftCount(function(){
			common.setLeftCountToPage("managerApproval");
		});

    },function(error){
    	console.log(error);
    });
};
managerApproval.getMoreListContent = function(){
	managerApproval.pageNum++;
	var searchVal = $("#managerApproval_searchInput").val();
	managerApproval.getManagerPageData(searchVal);
};
managerApproval.doSearch = function(){
	managerApproval.pageNum = 1;
	$("#managerApproval_registApprovalList").html("");
	var searchVal = $("#managerApproval_searchInput").val();
	managerApproval.getManagerPageData(searchVal);
};
managerApproval.refuseBtnListener = function(e){
	var applyUserId = $(e).parents("li").attr("id");

	var applyUrl = Global.BASE_URL + VisitUrl.APPROVE;
	var param = {
		applyId : applyUserId,
		applyStatus : "4"
	}
	LogicUtil.doLogic(applyUrl, false, param, [], function(datas) {
		
		for (var i = 0; i < managerApproval.approvalDataList.length; i++) {
			if(applyUserId == managerApproval.approvalDataList[i].applyId){
				managerApproval.approvalDataList[i].applyStatus = "4";
				$(e).css("display","none");
				$(e).next().css("display","none");
				$(e).parents("li").find(".registApprovalList_type").append('<span class="fontColor_red">（已拒绝）</span>');
				break;
			}
		}
		common.getLeftCount(function(){
			common.setLeftCountToPage("managerApproval");
		});
	});

	
};
managerApproval.approvalBtnListener = function(e){
	var applyUserId = $(e).parents("li").attr("id");

	var applyUrl = Global.BASE_URL + VisitUrl.APPROVE;
	var param = {
		applyId : applyUserId,
		applyStatus : "3"
	}
	LogicUtil.doLogic(applyUrl, false, param, [], function(datas) {
		for (var i = 0; i < managerApproval.approvalDataList.length; i++) {
			if(applyUserId == managerApproval.approvalDataList[i].applyId){
				managerApproval.approvalDataList[i].applyStatus = "3";
				$(e).css("display","none");
				$(e).prev().css("display","none");
				$(e).parents("li").find(".registApprovalList_type").append('<span class="fontColor_blue">（已同意）</span>');
				break;
			}
		}
		common.getLeftCount(function(){
			common.setLeftCountToPage("managerApproval");
		});
	});
	
};