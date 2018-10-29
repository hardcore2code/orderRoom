var managerAppointment;
if (!managerAppointment)
	managerAppointment = {};

managerAppointment.pageNum = 1;
managerAppointment.appointmentDataList = [];
managerAppointment.refuseItem = ''
managerAppointment.onLoad = function(){

	managerAppointment.pageNum = 1;

	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	var blackListCount =  localStorage.getItem("blackListCount") ? localStorage.getItem("blackListCount") : '';
	$("#managerAppointment").find(".userInfoArea_userName").text(tel);
	$("#managerAppointment").find(".userInfoArea_mailAddr").text(email);
	$("#managerAppointment").find(".unManagerApprovedCount").text(blackListCount);

	common.setLeftToolAuth("managerAppointment","manager");
	managerAppointment.getManagerPageData("");

};
managerAppointment.getManagerPageData = function(content){
	$("#managerAppointment_listMoreBtn").hide();
	var url = Global.BASE_URL + VisitUrl.QUERYMANAGERAPPLYLIST;
	var param = {
		type : "1",
		pn : managerAppointment.pageNum,
		ps : 10,
		content : content
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {

		var dataList = (new Function('return ' + e.dataList))();
		console.log(dataList);
		var list = $("#managerAppointment_classroomApprovalList");
		for (var i = 0; i < dataList.length; i++) {

			var newPoint = dataList[i].applyStatus == "1" ? "block" : "none";

			var applyStatus =  '';
			if(dataList[i].applyStatus == "3"){
				applyStatus =  '<span class="fontColor_blue">（已同意）</span>';
			}else if(dataList[i].applyStatus == "4"){
				applyStatus =  '<span class="fontColor_red">（已拒绝）</span>';
			}

			var printStatus = dataList[i].applyStatus == "3" ? 'block' : 'none';

			var dateList = dataList[i].dateList.split(",");

			var itemStr = '<li id="' + dataList[i].applyId + '" data-id="' + dataList[i].orderId + '"><div class="registApprovalList_newPoint bgColor_blue" style="display:' + newPoint + '"></div><div class="registApprovalList_typeAndTime">' + 
						  '<div class="registApprovalList_type fontColor_listTypeAndTime">预约申请</div>' + 
						  '<div class="registApprovalList_time fontColor_listTypeAndTime">' + dataList[i].actiondate + '</div></div><div class="registApprovalList_nameAndOperate">' + 
						  '<div class="registApprovalList_name">' + dataList[i].unit + ' - ' + dataList[i].building + ' - ' + dataList[i].roomNo + applyStatus + '</div>' + 
						  '<button class="registApprovalList_button fontColor_wordWhite bgColor_blue" style="display:' + printStatus + '" onclick="managerAppointment.doPrint(this);">打印</button>' + 
						  '<button class="registApprovalList_button fontColor_wordWhite bgColor_orange" style="display:' + printStatus + '" onclick="managerAppointment.doDelOrder(this);">删除</button>' + 
						  '<button class="registApprovalList_button fontColor_wordWhite bgColor_pink" style="display:' + newPoint + '" onclick="managerAppointment.refuseBtnListener(this)">驳回</button>' +  
						  '<button class="registApprovalList_button fontColor_wordWhite bgColor_blue" style="display:' + newPoint + '" onclick="managerAppointment.approvalBtnListener(this)">批准</button>' + 
						  '</div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">' + 
						  '<div class="classroomApprovalList_leftText">预约人：' + dataList[i].name + '</div>' + 
						  '<div class="classroomApprovalList_RightText">申请设备：' + (dataList[i].roomDevices == "" ? "无" : dataList[i].roomDevices) + '</div></div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime"><div style="width:60%;float:left">';

			console.log("dateList");
			var appointmentTime = '';
			for (var j = 0; j < dateList.length; j++) {
				var dateItem = common.subStringByUnderlineGetBefore(dateList[j]);
				var timeItemStr = common.subStringByUnderline(dateList[j]);

				var ymd = common.subStringBySpaceGetBefore(dateItem);
				var week = common.getWeek(common.subStringBySpace(dateItem));

				var timeItem = managerAppointment.getActionTime(timeItemStr);

				itemStr += '<div class="classroomApprovalList_leftText cral_apprTime" data-timeText="' + ymd + ' ' + week + ' ' +  timeItem +'">预约时间：' + ymd + ' ' + week + ' ' +  timeItem + '</div>'

			}

			
			
			itemStr += '</div><div class="classroomApprovalList_RightText">预计人数：' + dataList[i].personNum + '人</div></div>' + 
					   '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">活动内容：' + dataList[i].content + '</div></li>'

		    list.append(itemStr);

		}
		if(managerAppointment.pageNum == 1){
			managerAppointment.appointmentDataList = [];
			managerAppointment.appointmentDataList = dataList;
		}else{
			for (var i = 0; i < dataList.length; i++) {
				managerAppointment.appointmentDataList.push(dataList[i]);
			}
		}
			
		if(dataList.length >= 10){
			$("#managerAppointment_listMoreBtn").show();
		}

		common.getLeftCount(function(){
			common.setLeftCountToPage("managerAppointment");
		});

    },function(error){
    	console.log(error);
    });
};
managerAppointment.getMoreListContent = function(){
	managerAppointment.pageNum++;
	var searchVal = $("#managerAppointment_searchInput").val();
	managerAppointment.getManagerPageData(searchVal);
};
managerAppointment.doSearch = function(){
	managerAppointment.pageNum = 1;
	$("#managerAppointment_classroomApprovalList").html("");
	var searchVal = $("#managerAppointment_searchInput").val();
	managerAppointment.getManagerPageData(searchVal);
};
managerAppointment.refuseBtnListener = function(e){
	managerAppointment.refuseItem = e;
	$("#dismissApplicationDialog_appo").show();
};
managerAppointment.approvalBtnListener = function(e){
	var roomId = $(e).parents("li").attr("id");
	var apprTime = $(e).parents("li").find(".cral_apprTime").attr("data-timeText");

	var applyUrl = Global.BASE_URL + VisitUrl.APPROVE;
	var param = {
		applyId : roomId,
		reason : "",
		applyStatus : "3",
		approveDate : apprTime
	}
	LogicUtil.doLogic(applyUrl, false, param, [], function(datas) {
		for (var i = 0; i < managerAppointment.appointmentDataList.length; i++) {
			if(roomId == managerAppointment.appointmentDataList[i].applyId){
				managerAppointment.appointmentDataList[i].applyStatus = "3";
				$(e).parents("li").find(".registApprovalList_name").append('<span class="fontColor_blue">（已同意）</span>');
				$(e).css("display","none");
				$(e).prev().css("display","none");
				$(e).prev().prev().css("display","block");
				break;
			}
		}
		
		common.getLeftCount(function(){
			common.setLeftCountToPage("managerAppointment");
		});
	});
	
};
managerAppointment.getActionTime = function(timeItemStr){
	var timeList = timeItemStr.split("-");
	var firstFlag = "0";
	var firstIndex = 0;
	var index = 0;

	var timeItem = "";
	for (var i = 1; i <= timeList.length; i++) {
		if(timeList[i-1] == "1"){
			index = i;
		}
		if(timeList[i-1] == "1" && firstFlag == "0"){
			firstFlag = "1";
			firstIndex = i;
		}
	}
	if(firstIndex != 0){
		timeItem = (firstIndex + 7) + ":00" + "-" + (index + 8) + ":00";
	}
	return timeItem;

};
managerAppointment.doPrint = function(e){
	var applyId = $(e).parents("li").attr("id");

	var Url = Global.BASE_URL + VisitUrl.EXPORTORDER;
	var param = {
		applyId : applyId,
	}
	LogicUtil.doLogic(Url, false, param, [], function(datas) {
		window.open(Global.PRINT_URL + datas.path);
	});
};
managerAppointment.doDelOrder = function(e){
	var orderId = $(e).parents("li").attr("data-id");

	var Url = Global.BASE_URL + VisitUrl.DELORDER;
	var param = {
		orderId : orderId,
	}
	LogicUtil.doLogic(Url, false, param, [], function(datas) {
		$(e).parents("li").remove();
	});
};
managerAppointment.reasonSubmit = function(){
	var reason = $("#dismissApplReason_appo").val();
	if(reason == ''){
		$("#dad_appo_hint").css("visibility","visible");
		return
	}
	$("#dad_appo_hint").css("visibility","hidden");

	if(managerAppointment.refuseItem !== ''){
		var roomId = $(managerAppointment.refuseItem).parents("li").attr("id");
		var apprTime = $(managerAppointment.refuseItem).parents("li").find(".cral_apprTime").attr("data-timeText");
		var applyUrl = Global.BASE_URL + VisitUrl.APPROVE;
		var param = {
			applyId : roomId,
			reason : reason,
			applyStatus : "4",
			approveDate : apprTime
		}
		LogicUtil.doLogic(applyUrl, false, param, [], function(datas) {
			for (var i = 0; i < managerAppointment.appointmentDataList.length; i++) {
				if(roomId == managerAppointment.appointmentDataList[i].applyId){
					managerAppointment.appointmentDataList[i].applyStatus = "4";
					$(managerAppointment.refuseItem).css("display","none");

					$(managerAppointment.refuseItem).next().css("display","none");
					$(managerAppointment.refuseItem).parents("li").find(".registApprovalList_name").append('<span class="fontColor_red">（已拒绝）</span>');
					break;
				}
			}
			
			common.getLeftCount(function(){
				common.setLeftCountToPage("managerAppointment");
			});
			managerAppointment.reasonCancel();
		});
	}
	
};
managerAppointment.reasonCancel = function(){
	managerAppointment.refuseItem = ''
	$("#dad_appo_hint").css("visibility","hidden");
	$("#dismissApplicationDialog_appo").hide();
};
