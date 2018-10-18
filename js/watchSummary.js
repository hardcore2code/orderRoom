var watchSummary;
if (!watchSummary)
	watchSummary = {};

watchSummary.onLoad = function(){

	var authType = localStorage.getItem("role");
	if(authType == "admin"){
		common.setLeftToolAuth("watchSummary","admin");
	}else if(authType == "manager"){
		common.setLeftToolAuth("watchSummary","manager");
	}else if(authType == "user"){
		common.setLeftToolAuth("watchSummary","user");
	}
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#watchSummary").find(".userInfoArea_userName").text(tel);
	$("#watchSummary").find(".userInfoArea_mailAddr").text(email);
	

	var searchVal = $("#watchSummary_searchInput").val();
	watchSummary.getPageData(searchVal);
	
};
watchSummary.watchBuildingState = function(e){
	var roomId = $(e).parents("li").attr("id");
	window.location.href = "watchSummaryDetails.html?roomId=" + roomId;
};
watchSummary.getPageData = function(content){
	var url = Global.BASE_URL + VisitUrl.QUERYROOMLIST;
	var param = {
		params : content
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {

		var dataList = (new Function('return ' + e.dataList))();
		console.log(dataList);
		var list = $("#watchSummary_classroomApprovalList");
		for (var i = 0; i < dataList.length; i++) {
			
			var listItemStr = '<li id="' + dataList[i].roomId + '"><div class="registApprovalList_nameAndOperate">' + 
							  '<div class="registApprovalList_name">' + dataList[i].unit + ' - ' + dataList[i].building + ' - ' + dataList[i].roomNo + '</div>' + 
							  '<button class="registApprovalList_button fontColor_wordWhite bgColor_blue" onclick="watchSummary.watchBuildingState(this);">查看</button></div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">类别：' + dataList[i].type + '</div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">面积：' + dataList[i].area + '平方米</div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">容纳人数：' + dataList[i].num + '人</div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">可用设备：' + dataList[i].devices + '</div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">管理员：' + dataList[i].name + '</div></li>';

			list.append(listItemStr);
		}
		common.getLeftCount(function(){
			common.setLeftCountToPage("watchSummary");
		});

    },function(error){
    	console.log(error);
    });
};
watchSummary.doSearch = function(){
	var searchVal = $("#watchSummary_searchInput").val();
	$("#watchSummary_classroomApprovalList").html("");
	watchSummary.getPageData(searchVal);
};