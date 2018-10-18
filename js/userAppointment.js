var userAppointment;
if (!userAppointment)
	userAppointment = {};

userAppointment.pageNum = 1;
userAppointment.searchContent = "";
userAppointment.onLoad = function(){
	userAppointment.pageNum = 1;
	userAppointment.searchContent = "";

	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#userAppointment").find(".userInfoArea_userName").text(tel);
	$("#userAppointment").find(".userInfoArea_mailAddr").text(email);
	var authType = localStorage.getItem("role");
	if(authType == "user"){
		common.setLeftToolAuth("userAppointment","user");
	}else if(authType == "manager"){
		common.setLeftToolAuth("userAppointment","manager");
	}
		
	var url = Global.BASE_URL + VisitUrl.QUERYMYAPPLYLIST;
	var param = {
		type: "1",
		pn: userAppointment.pageNum,
		ps: 10,
		content: userAppointment.searchContent
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
		
		var dataList = (new Function('return ' + e.dataList))();
		var appointmentList = $("#managerAppointment_classroomApprovalList");
		for (var i = 0; i < dataList.length; i++) {
			var nowItemPoint = dataList[i].applyStatus == "1" ? '<div class="registApprovalList_newPoint bgColor_blue"></div>' : "";
			
			var passState = "";
			if(dataList[i].applyStatus == "3"){
				passState = '<span class="fontColor_blue">（已同意）</span>';
			}else if(dataList[i].applyStatus == "4"){
				passState = '<span class="fontColor_red">（已拒绝）</span>';
			}
			var printBtnDisplay = dataList[i].applyStatus == "3" ? 'block' : 'none';
			var times = common.getAppointmentTime(dataList[i].times);

			var ymd = common.subStringBySpaceGetBefore(dataList[i].orderdate);
			var weekMiddle = common.subStringBySpace(dataList[i].orderdate);
			var week = common.getWeek(common.subStringBySpace(weekMiddle));
			
			var listItemStr = '<li id="' + dataList[i].applyId + '">' + nowItemPoint + '<div class="registApprovalList_typeAndTime"><div class="registApprovalList_type fontColor_listTypeAndTime">预约申请</div>' + 
							  '<div class="registApprovalList_time fontColor_listTypeAndTime">' + dataList[i].actiondate + '</div></div><div class="registApprovalList_nameAndOperate">' + 
							  '<div class="registApprovalList_name">' + dataList[i].building + ' - ' + dataList[i].type + ' - ' + dataList[i].roomNo + passState + '</div><button class="registApprovalList_button fontColor_wordWhite bgColor_blue" style="display:' + printBtnDisplay + '" onclick="userAppointment.doPrint(this);">打印</button></div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime"><div class="classroomApprovalList_leftText">预约人：' + dataList[i].name + '</div>' + 
							  '<div class="classroomApprovalList_RightText">申请设备：' + (dataList[i].roomDevices == "" ? "无" : dataList[i].roomDevices ) + '</div></div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">' + 
							  '<div class="classroomApprovalList_leftText">预约时间：' + ymd + ' ' + week + ' ' + times + '</div><div class="classroomApprovalList_RightText">预计人数：' + dataList[i].personNum + '人</div></div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">活动内容：' + dataList[i].content + '</div></li>';
			appointmentList.append(listItemStr);
		}
		if(dataList.length >= 10){
			$("#userAppointment_listMoreBtn").show();
		}

		

		common.getLeftCount(function(){
			common.setLeftCountToPage("userAppointment");
		});
		
    },function(error){
    	console.log(error);
    });
};

userAppointment.getMoreListContent = function(){
	$("#userAppointment_listMoreBtn").hide();
	userAppointment.pageNum++;
	var url = Global.BASE_URL + VisitUrl.QUERYMYAPPLYLIST;
	var param = {
		type: "1",
		pn: userAppointment.pageNum,
		ps: 10,
		content: userAppointment.searchContent
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
			
		var dataList = (new Function('return ' + e.dataList))();
		var appointmentList = $("#managerAppointment_classroomApprovalList");
		for (var i = 0; i < dataList.length; i++) {
			var nowItemPoint = dataList[i].applyStatus == "1" ? '<div class="registApprovalList_newPoint bgColor_blue"></div>' : "";
			
			var passState = "";
			if(dataList[i].applyStatus == "3"){
				passState = '<span class="fontColor_blue">（已同意）</span>';
			}else if(dataList[i].applyStatus == "4"){
				passState = '<span class="fontColor_red">（已拒绝）</span>';
			}
			var printBtnDisplay = dataList[i].applyStatus == "3" ? 'block' : 'none';
			var times = common.getAppointmentTime(dataList[i].times);

			var ymd = common.subStringBySpaceGetBefore(dataList[i].orderdate);
			var weekMiddle = common.subStringBySpace(dataList[i].orderdate);
			var week = common.getWeek(common.subStringBySpace(weekMiddle));

			var listItemStr = '<li id="' + dataList[i].applyId + '">' + nowItemPoint + '<div class="registApprovalList_typeAndTime"><div class="registApprovalList_type fontColor_listTypeAndTime">预约申请</div>' + 
							  '<div class="registApprovalList_time fontColor_listTypeAndTime">' + dataList[i].actiondate + '</div></div><div class="registApprovalList_nameAndOperate">' + 
							  '<div class="registApprovalList_name">' + dataList[i].building + ' - ' + dataList[i].type + ' - ' + dataList[i].roomNo + passState + '</div><button class="registApprovalList_button fontColor_wordWhite bgColor_blue" style="display:' + printBtnDisplay + '" onclick="userAppointment.doPrint(this);">打印</button></div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime"><div class="classroomApprovalList_leftText">预约人：' + dataList[i].name + '</div>' + 
							  '<div class="classroomApprovalList_RightText">申请设备：' + dataList[i].roomDevices + '</div></div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">' + 
							  '<div class="classroomApprovalList_leftText">预约时间：' + ymd + ' '+ week + ' ' + times + '</div><div class="classroomApprovalList_RightText">预计人数：' + dataList[i].personNum + '人</div></div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">活动内容：' + dataList[i].content + '</div></li>';
			appointmentList.append(listItemStr);
		}
		if(dataList.length >= 10){
			$("#userAppointment_listMoreBtn").show();
		}
    },function(error){
    	console.log(error);
    });
};
userAppointment.doSearch = function(){
	userAppointment.searchContent = $("#userAppointment_searchInput").val();
	userAppointment.pageNum = 1;
	var url = Global.BASE_URL + VisitUrl.QUERYMYAPPLYLIST;
	var param = {
		type: "1",
		pn: userAppointment.pageNum,
		ps: 10,
		content: userAppointment.searchContent
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
		var dataList = (new Function('return ' + e.dataList))();
		var appointmentList = $("#managerAppointment_classroomApprovalList");
		appointmentList.html("");
		for (var i = 0; i < dataList.length; i++) {
			var nowItemPoint = dataList[i].applyStatus == "1" ? '<div class="registApprovalList_newPoint bgColor_blue"></div>' : "";
			
			var passState = "";
			if(dataList[i].applyStatus == "3"){
				passState = '<span class="fontColor_blue">（已同意）</span>';
			}else if(dataList[i].applyStatus == "4"){
				passState = '<span class="fontColor_red">（已拒绝）</span>';
			}
			var printBtnDisplay = dataList[i].applyStatus == "3" ? 'block' : 'none';
			var times = common.getAppointmentTime(dataList[i].times);

			var listItemStr = '<li id="' + dataList[i].applyId + '">' + nowItemPoint + '<div class="registApprovalList_typeAndTime"><div class="registApprovalList_type fontColor_listTypeAndTime">预约申请</div>' + 
							  '<div class="registApprovalList_time fontColor_listTypeAndTime">' + dataList[i].actiondate + '</div></div><div class="registApprovalList_nameAndOperate">' + 
							  '<div class="registApprovalList_name">' + dataList[i].building + ' - ' + dataList[i].type + ' - ' + dataList[i].roomNo + passState + '</div><button class="registApprovalList_button fontColor_wordWhite bgColor_blue" style="display:' + printBtnDisplay + '">打印</button></div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime"><div class="classroomApprovalList_leftText">预约人：' + dataList[i].name + '</div>' + 
							  '<div class="classroomApprovalList_RightText">申请设备：' + dataList[i].roomDevices + '</div></div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">' + 
							  '<div class="classroomApprovalList_leftText">预约时间：' + common.subStringBySpaceGetBefore(dataList[i].orderdate) + ' ' + times + '</div><div class="classroomApprovalList_RightText">预计人数：' + dataList[i].personNum + '人</div></div>' + 
							  '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">活动内容：' + dataList[i].content + '</div></li>';
			appointmentList.append(listItemStr);
		}
		if(dataList.length >= 10){
			$("#userAppointment_listMoreBtn").show();
		}
    },function(error){
    	console.log(error);
    });
};
userAppointment.doPrint = function(e){
	var applyId = $(e).parents("li").attr("id");

	var Url = Global.BASE_URL + VisitUrl.EXPORTORDER;
	var param = {
		applyId : applyId,
	}
	LogicUtil.doLogic(Url, false, param, [], function(datas) {
	    window.open(Global.PRINT_URL + datas.path);
	});
};