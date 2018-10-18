var watchAppointment;
if (!watchAppointment)
	watchAppointment = {};

watchAppointment.pageNum = 1;
watchAppointment.onLoad = function(){
	watchAppointment.pageNum = 1;

	var authType = localStorage.getItem("role");
	if(authType == "admin"){
		common.setLeftToolAuth("watchAppointment","admin");
	}else if(authType == "manager"){
		common.setLeftToolAuth("watchAppointment","manager");
	}
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#watchAppointment").find(".userInfoArea_userName").text(tel);
	$("#watchAppointment").find(".userInfoArea_mailAddr").text(email);
	

	var searchVal = $("#watchAppointment_searchInput").val();
	watchAppointment.pushListData(searchVal);

	

};

watchAppointment.pushListData = function(content){
	var url = Global.BASE_URL + VisitUrl.MANAGER_QUERYAPPLYLIST;
	var param = {
		type : "1",
		pn : watchAppointment.pageNum,
		ps : 10,
		applyStatus : "3",
		content : content
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {

		var dataList = (new Function('return ' + e.dataList))();
		console.log(dataList);	

		var list = $("#watchAppointment_classroomApprovalList");
		for (var i = 0; i < dataList.length; i++) {

			var newPoint = dataList[i].applyStatus == "1" ? "block" : "none";
			var btnState = dataList[i].applyStatus == "3" ? "block" : "none";
			var alreadyApply = dataList[i].applyStatus == "3" ? '<span class="fontColor_blue">（已同意）</span>' : '';

			var ymd = common.subStringBySpaceGetBefore(dataList[i].orderdate);
			var weekMiddle = common.subStringBySpace(dataList[i].orderdate);
			var week = common.getWeek(common.subStringBySpace(weekMiddle));

			var times = common.getAppointmentTime(dataList[i].times);

			var itemStr = '<li id="' + dataList[i].applyId + '"><div class="registApprovalList_newPoint bgColor_blue" style="display:' + newPoint + '"></div><div class="registApprovalList_typeAndTime">' + 
						  '<div class="registApprovalList_type fontColor_listTypeAndTime">预约申请</div>' + 
						  '<div class="registApprovalList_time fontColor_listTypeAndTime">' + dataList[i].actiondate + '</div></div><div class="registApprovalList_nameAndOperate">' + 
						  '<div class="registApprovalList_name">' + dataList[i].unit + ' - ' + dataList[i].building + ' - ' + dataList[i].roomNo + alreadyApply + '</div>' + 
						  '<button style="display:' + btnState + '" class="registApprovalList_button fontColor_wordWhite bgColor_blue" onclick="watchAppointment.doPrint(this);">打印</button></div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">' +
						  '<div class="classroomApprovalList_leftText">预约人：' + dataList[i].name + '</div>' + 
						  '<div class="classroomApprovalList_RightText">申请设备：' + dataList[i].devices + '</div></div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">' + 
						  '<div class="classroomApprovalList_leftText">预约时间：' + ymd + ' ' + week + ' ' + times + '</div>' + 
						  '<div class="classroomApprovalList_RightText">预计人数：' + dataList[i].num + '人</div></div>' + 
						  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">活动内容：' + dataList[i].content + '</div></li>';
        	
			list.append(itemStr);
		}		

		if(dataList.length >= 10){
			$("#watchAppointment_listMoreBtn").show();
		}
		common.getLeftCount(function(){
			common.setLeftCountToPage("watchAppointment");
		});

    },function(error){
    	console.log(error);
    });
};
watchAppointment.getMoreListContent = function(){
	watchAppointment.pageNum++;
	var searchVal = $("#watchAppointment_searchInput").val();
	watchAppointment.pushListData(searchVal);
};
watchAppointment.doSearch = function(){
	watchAppointment.pageNum = 1;
	$("#watchAppointment_classroomApprovalList").html("");
	var searchVal = $("#watchAppointment_searchInput").val();
	watchAppointment.pushListData(searchVal);
};
watchAppointment.doPrint = function(e){
	var applyId = $(e).parents("li").attr("id");
	console.log(applyId);

	var Url = Global.BASE_URL + VisitUrl.EXPORTORDER;
	var param = {
		applyId : applyId,
	}
	LogicUtil.doLogic(Url, false, param, [], function(datas) {
		window.open(Global.PRINT_URL + datas.path);
	});
};