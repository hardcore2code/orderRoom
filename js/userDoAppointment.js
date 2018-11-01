var userDoAppointment;
if (!userDoAppointment)
	userDoAppointment = {};

userDoAppointment.pageNum = "";
userDoAppointment.appointmentType = "0";
userDoAppointment.cycleMode = "";

userDoAppointment.unitData = [];
userDoAppointment.buildingData = [];
userDoAppointment.roomNoData = [];

userDoAppointment.roomId = "";
userDoAppointment.personNum = "";
userDoAppointment.meettingContent = "";
userDoAppointment.tools = "";
userDoAppointment.beginDate = "";
userDoAppointment.timeData = [];

userDoAppointment.ifcheckrepeat = "0";

userDoAppointment.onLoad = function(){

	userDoAppointment.pageNum = "";
	userDoAppointment.changePage("1");
	userDoAppointment.appointmentType = "0";
	userDoAppointment.cycleMode = "";
	userDoAppointment.ifcheckrepeat = "0"

	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#userDoAppointment").find(".userInfoArea_userName").text(tel);
	$("#userDoAppointment").find(".userInfoArea_mailAddr").text(email);

	var authType = localStorage.getItem("role");
	if(authType == "user"){
		common.setLeftToolAuth("userDoAppointment","user");
	}else if(authType == "manager"){
		common.setLeftToolAuth("userDoAppointment","manager");
	}
	common.getLeftCount(function(){
		common.setLeftCountToPage("userDoAppointment");
		userDoAppointment.getSelectRoom("1");
	});

};
userDoAppointment.changePage = function(pageNum){
	console.log(pageNum)
	if(userDoAppointment.pageNum != pageNum){

		if(pageNum == "2"){
			var room = $("#userDoAppointment_room").children('option:selected').val();
			
			var personNum = $("#userDoAppointment_personNum").val();
			var meettingContent = $("#userDoAppointment_meetingContent").val();

			if(!room || room == ""){
				common.showErrorToast('userDoAppointment',"请选择房间");
				return;
			}
			if(personNum == ""){
				common.showErrorToast('userDoAppointment',"请填写参与人数");
				return;
			}
			if(meettingContent == ""){
				common.showErrorToast('userDoAppointment',"请填写会议内容");
				return;
			}
			userDoAppointment.roomId = room;
			userDoAppointment.personNum = personNum;
			userDoAppointment.meettingContent = meettingContent;
			
			userDoAppointment.tools = '';
			var devicesList = $("#userDoAppointment_device").find("div");

			for (var i = 0; i < devicesList.length; i++) {
				if($(devicesList[i]).hasClass('uda_deviceSelect')){
					if(userDoAppointment.tools == ""){
						userDoAppointment.tools += $(devicesList[i]).text();
					}else{
						userDoAppointment.tools += "," + $(devicesList[i]).text();
					}
					
				}
				
			}

		}

		if(pageNum == "" && userDoAppointment.appointmentType == "1"){
			//0没问题，1不连续，2未选择
			if(userDoAppointment.checkTimeChoose() == "1"){
				common.showErrorToast('userDoAppointment',"您选择的会议时间不连续，请重新选择");
				return;
			}else if(userDoAppointment.checkTimeChoose() == "2"){
				common.showErrorToast('userDoAppointment',"请选择会议时间");
				return;
			}
			
			pageNum = "4";
			$("#userDoAppointment").parent().find("#ui-datepicker-div").remove();
			$("#batch_datepicker").append('<input type="text" class="userDoAppointment_batchDatePicker">');
			$("#batch_datepicker").find("input").datepicker({  
		        dateFormat:"yy-mm-dd",
		        minDate: userDoAppointment.beginDate
		    });
			$("#userDoAppointment_page" + userDoAppointment.pageNum).hide();
			$("#userDoAppointment_page" + pageNum).show();
			userDoAppointment.pageNum = pageNum;
			

			
		}else if(pageNum == "" && userDoAppointment.appointmentType == "0"){
			//0没问题，1不连续，2未选择
			if(userDoAppointment.checkTimeChoose() == "1"){
				common.showErrorToast('userDoAppointment',"您选择的会议时间不连续，请重新选择");
				return;
			}else if(userDoAppointment.checkTimeChoose() == "2"){
				common.showErrorToast('userDoAppointment',"请选择会议时间");
				return;
			}

			var url = Global.BASE_URL + VisitUrl.ORDERROOM;
			var param = {
				roomId : userDoAppointment.roomId,
				personNum : userDoAppointment.personNum,
				content : userDoAppointment.meettingContent,
				roomDevices : userDoAppointment.tools,
				type : userDoAppointment.appointmentType,
				loopType : "",
				enddate : "",
				orderdate : userDoAppointment.beginDate,
				ifcheckrepeat: userDoAppointment.ifcheckrepeat
			};

			param.time89 = userDoAppointment.timeData[0].state == "2" ? "1" : "0";
			param.time910 = userDoAppointment.timeData[1].state == "2" ? "1" : "0";
			param.time1011 = userDoAppointment.timeData[2].state == "2" ? "1" : "0";
			param.time1112 = userDoAppointment.timeData[3].state == "2" ? "1" : "0";
			param.time1213 = userDoAppointment.timeData[4].state == "2" ? "1" : "0";
			param.time1314 = userDoAppointment.timeData[5].state == "2" ? "1" : "0";
			param.time1415 = userDoAppointment.timeData[6].state == "2" ? "1" : "0";
			param.time1516 = userDoAppointment.timeData[7].state == "2" ? "1" : "0";
			param.time1617 = userDoAppointment.timeData[8].state == "2" ? "1" : "0";
			param.time1718 = userDoAppointment.timeData[9].state == "2" ? "1" : "0";
			param.time1819 = userDoAppointment.timeData[10].state == "2" ? "1" : "0";
			param.time1920 = userDoAppointment.timeData[11].state == "2" ? "1" : "0";
			param.time2021 = userDoAppointment.timeData[12].state == "2" ? "1" : "0";
			param.time2122 = userDoAppointment.timeData[13].state == "2" ? "1" : "0";

			LogicUtil.doLogic(url, false, param, [], function(e) {

				if(e.resFlagRepeat && e.resFlagRepeat === '0'){
					$("#dismissApplicationDialog_udaText").text(e.msg)
					$("#dismissApplicationDialog_uda").show();
				}else{
					pageNum = "3";
					if(userDoAppointment.pageNum != ""){
						$("#appointmentTopNav_page" + userDoAppointment.pageNum).removeClass('appointmentTopNavBar_onChoose');
						$("#userDoAppointment_page" + userDoAppointment.pageNum).hide();
					}
					$("#appointmentTopNav_page" + pageNum).addClass('appointmentTopNavBar_onChoose');
					$("#userDoAppointment_page" + pageNum).show();
					userDoAppointment.pageNum = pageNum;

					common.getLeftCount(function(){
						common.setLeftCountToPage("userDoAppointment");
					});
				}
			},function(error){
				console.log(error);
			});
			
		}else{
			if(userDoAppointment.pageNum != ""){
				if(userDoAppointment.pageNum != "4"){
					$("#appointmentTopNav_page" + userDoAppointment.pageNum).removeClass('appointmentTopNavBar_onChoose');
					$("#userDoAppointment_page" + userDoAppointment.pageNum).hide();	
				}
			}
			if(pageNum == "2" && userDoAppointment.pageNum == "4"){
				$("#batch_datepicker").html("");
				$("#appointmentTopNav_page2").removeClass('appointmentTopNavBar_onChoose');
				$("#userDoAppointment_page" + userDoAppointment.pageNum).hide();
			}
			if(pageNum == "2" && userDoAppointment.pageNum == "1"){
				var myDate = new Date();
				userDoAppointment.beginDate = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
				console.log(userDoAppointment.beginDate);

				$("#userDoAppointment_datepicker" ).datepicker({
					inline: true,
					minDate: myDate,
					onSelect: function (dateText, inst) {
					   userDoAppointment.beginDate = inst.selectedYear + "-" +(inst.selectedMonth + 1) + "-" + inst.selectedDay;
					   userDoAppointment.timeDataPush(userDoAppointment.beginDate);
					},
				});
				//初始化日期
				userDoAppointment.timeDataPush(userDoAppointment.beginDate);
			}
			if(pageNum == "3" && userDoAppointment.pageNum == "4"){

				if(userDoAppointment.cycleMode === ""){
					common.showErrorToast('userDoAppointment',"请选择循环模式");
					return;
				}
				var endDate = $("#batch_datepicker").find("input").val();
				if(endDate == ""){
					common.showErrorToast('userDoAppointment',"请选择时间跨度");
					return;
				}

				console.log("bbbb")
				var param = {
					roomId : userDoAppointment.roomId,
					personNum : userDoAppointment.personNum,
					content : userDoAppointment.meettingContent,
					roomDevices : userDoAppointment.tools,
					type : userDoAppointment.appointmentType,
					loopType : userDoAppointment.cycleMode,
					enddate : endDate,
					orderdate : userDoAppointment.beginDate
				};

				param.time89 = userDoAppointment.timeData[0].state == "2" ? "1" : "0";
				param.time910 = userDoAppointment.timeData[1].state == "2" ? "1" : "0";
				param.time1011 = userDoAppointment.timeData[2].state == "2" ? "1" : "0";
				param.time1112 = userDoAppointment.timeData[3].state == "2" ? "1" : "0";
				param.time1213 = userDoAppointment.timeData[4].state == "2" ? "1" : "0";
				param.time1314 = userDoAppointment.timeData[5].state == "2" ? "1" : "0";
				param.time1415 = userDoAppointment.timeData[6].state == "2" ? "1" : "0";
				param.time1516 = userDoAppointment.timeData[7].state == "2" ? "1" : "0";
				param.time1617 = userDoAppointment.timeData[8].state == "2" ? "1" : "0";
				param.time1718 = userDoAppointment.timeData[9].state == "2" ? "1" : "0";
				param.time1819 = userDoAppointment.timeData[10].state == "2" ? "1" : "0";
				param.time1920 = userDoAppointment.timeData[11].state == "2" ? "1" : "0";
				param.time2021 = userDoAppointment.timeData[12].state == "2" ? "1" : "0";
				param.time2122 = userDoAppointment.timeData[13].state == "2" ? "1" : "0";
				var checkurl = Global.BASE_URL + VisitUrl.CHECKTIMERIGHT;
				LogicUtil.doLogic(checkurl, false, param, [], function(e) {
					var url = Global.BASE_URL + VisitUrl.ORDERROOM;
					LogicUtil.doLogic(url, false, param, [], function(e) {
						$("#appointmentTopNav_page2").removeClass('appointmentTopNavBar_onChoose');
						$("#userDoAppointment_page" + userDoAppointment.pageNum).hide();

						$("#appointmentTopNav_page" + pageNum).addClass('appointmentTopNavBar_onChoose');
						$("#userDoAppointment_page" + pageNum).show();

						userDoAppointment.pageNum = pageNum;

						common.getLeftCount(function(){
							common.setLeftCountToPage("userDoAppointment");
						});

				    },function(error){
				    	console.log(error);
				    });
			    },function(error){
			    	console.log(error);
			    });
			    
			}else{
				$("#appointmentTopNav_page" + pageNum).addClass('appointmentTopNavBar_onChoose');
				$("#userDoAppointment_page" + pageNum).show();

				userDoAppointment.pageNum = pageNum;
			}
		}

		
	}
};
userDoAppointment.chooseAppointmentType = function(self,type){
	if(type != userDoAppointment.appointmentType){
		$(self).find('.userDoAppointment_typeImg').attr("src","image/checkbox_o.png");
		if(type == "0"){
			$(self).next().find('.userDoAppointment_typeImg').attr("src","image/checkbox.png");
		}else{
			$(self).prev().find('.userDoAppointment_typeImg').attr("src","image/checkbox.png");
		}
		userDoAppointment.appointmentType = type;
	}
	
};
userDoAppointment.onChooseTime = function(itemId){
	var item = $("#timeItem_" + itemId);
	if(!item.hasClass('userDoAppointment_timeItemDisabled')){

		if(userDoAppointment.timeData[itemId - 8].state == "0"){
			item.addClass('userDoAppointment_timeItemOnChoose');
			userDoAppointment.timeData[itemId - 8].state = "2";
		}else{
			item.removeClass('userDoAppointment_timeItemOnChoose');
			userDoAppointment.timeData[itemId - 8].state = "0";
		}
	}
	
};
userDoAppointment.chooseCycleMode = function(itemType){
	if(userDoAppointment.cycleMode != itemType){
		if(userDoAppointment.cycleMode == ""){
			$("#cycleMode_" + itemType).addClass('userDoAppointment_timeItemOnChoose');
		}else{
			$("#cycleMode_" + itemType).addClass('userDoAppointment_timeItemOnChoose');
			if(itemType == "1"){
				$("#cycleMode_2").removeClass('userDoAppointment_timeItemOnChoose');
			}else{
				$("#cycleMode_1").removeClass('userDoAppointment_timeItemOnChoose');
			}
		}
		userDoAppointment.cycleMode = itemType;
	}else{
		$("#cycleMode_" + itemType).removeClass('userDoAppointment_timeItemOnChoose');
		userDoAppointment.cycleMode = "";
	}
};
userDoAppointment.changeSelect = function(e,type){
	var value = $(e).children('option:selected').val();

	if(type == '0'){

		$("#userDoAppointment_personNumText").text('房间 xxx 平方米；可容纳 xxx 人');
		$("#userDoAppointment_deviceText").text('可用设备：');
		$("#userDoAppointment_device").html("");

		if(value == ""){
			$("#userDoAppointment_building").html("");
			$("#userDoAppointment_room").html("");
			return;
		}
		userDoAppointment.getSelectRoom("2",value);


	}else if(type == "1"){

		$("#userDoAppointment_personNumText").text('房间 xxx 平方米；可容纳 xxx 人');
		$("#userDoAppointment_deviceText").text('可用设备：');
		$("#userDoAppointment_device").html("");

		if(value == ""){
			$("#userDoAppointment_room").html("");
			return;
		}
		var unitSelect = $("#userDoAppointment_managerCompany").children('option:selected').val();
		userDoAppointment.getSelectRoom("3",unitSelect,value);

	}else if(type == "2"){
		$("#userDoAppointment_device").html("");

		if(value == ""){
			$("#userDoAppointment_personNumText").text('房间 xxx 平方米；可容纳 xxx 人');
			$("#userDoAppointment_deviceText").text('可用设备：');
		}else{
			var unitSelect = $("#userDoAppointment_room").children('option:selected').val();
			for (var i = 0; i < userDoAppointment.roomNoData.length; i++) {
				if(userDoAppointment.roomNoData[i].roomId == unitSelect){
					$("#userDoAppointment_personNumText").text('房间 ' + userDoAppointment.roomNoData[i].area + ' 平方米；可容纳 ' + userDoAppointment.roomNoData[i].num + ' 人');
					$("#userDoAppointment_deviceText").text('可用设备：' + userDoAppointment.roomNoData[i].devices);

					var deviceBg = $("#userDoAppointment_device");
					if(userDoAppointment.roomNoData[i].devices != ""){
						var deviceList = userDoAppointment.roomNoData[i].devices.split(",");
						for (var j = 0; j < deviceList.length; j++) {
							var item = '<div class="uda_deviceItem" onclick="userDoAppointment.deviceChoose(this);">' + deviceList[j] + '</div>';
							deviceBg.append(item);
						}
					}
					break;
				}
			}
			
		}
	}
	
};
userDoAppointment.getSelectRoom = function(type,unit,building,roomNo){

	var url = Global.BASE_URL + VisitUrl.SELECTROOM;
	var param = {};
	if(type == "1"){
		$("#userDoAppointment_managerCompany").html("");
		$("#userDoAppointment_building").html("");
		$("#userDoAppointment_room").html("");
		param.unit = "";
		param.building = "";
		param.roomNo = "";
	}else if(type == "2"){
		$("#userDoAppointment_building").html("");
		$("#userDoAppointment_room").html("");
		param.unit = unit;
		param.building = "";
		param.roomNo = "";
	}else if(type == "3"){
		$("#userDoAppointment_room").html("");
		param.unit = unit;
		param.building = building;
		param.roomNo = "";
	}

	LogicUtil.doLogic(url, false, param, [], function(e) {
		var dataList = (new Function('return ' + e.dataList))();
		if(type == "1"){
			userDoAppointment.unitData = dataList;
			var managerCompanySelect = $("#userDoAppointment_managerCompany");
		    for (var i = 0; i < userDoAppointment.unitData.length + 1; i++) {
		    	var option = "";
		    	if(i == 0){
		    		option = '<option value="" selected>选择管理单位</option>';
		    	}else{
		    		option = '<option value ="' + userDoAppointment.unitData[i-1].unit + '">' + userDoAppointment.unitData[i-1].unit + '</option>';
		    		
		    	}
		    	managerCompanySelect.append(option);
		    }
		}else if(type == "2"){
			userDoAppointment.buildingData = dataList;

			var buildingSelect = $("#userDoAppointment_building");
		    for (var i = 0; i < userDoAppointment.buildingData.length + 1; i++) {
		    	var option = "";
		    	if(i == 0){
		    		option = '<option value="" selected>选择楼宇</option>';
		    	}else{
		    		option = '<option value ="' + userDoAppointment.buildingData[i-1].building + '">' + userDoAppointment.buildingData[i-1].building + '</option>';
		    		
		    	}
		    	buildingSelect.append(option);
		    }
		}else if(type == "3"){
			userDoAppointment.roomNoData = dataList;

			var roomSelect = $("#userDoAppointment_room");
		    for (var i = 0; i < userDoAppointment.roomNoData.length + 1; i++) {
		    	var option = "";
		    	if(i == 0){
		    		option = '<option value="" selected>选择房间号</option>';
		    	}else{
		    		option = '<option value ="' + userDoAppointment.roomNoData[i-1].roomId + '">' + userDoAppointment.roomNoData[i-1].roomNo + '</option>';
		    		
		    	}
		    	roomSelect.append(option);
		    }
		}
		
    },function(error){
    	console.log(error);
    });
};
userDoAppointment.checkTimeChoose = function(){
	var timeIndex = "";
	var returnStatus = "0";//0没问题，1不连续，2未选择
	for (var i = 0; i < userDoAppointment.timeData.length; i++) {
		if(userDoAppointment.timeData[i].state == "2"){
			if(timeIndex === ""){
				timeIndex = i;
			}else{
				console.log(i - timeIndex);
				if((i - timeIndex) > 1){
					returnStatus = "1";
					break;
				}else{
					timeIndex = i;
				}
			}
		}
	}
	if(timeIndex === ""){
		returnStatus = "2";
	}

	return returnStatus;
};
userDoAppointment.timeDataPush = function(beginDate){
	var url = Global.BASE_URL + VisitUrl.QUERYORDERTIMEUSED;
	var param = {
		roomId : userDoAppointment.roomId,
		orderdate : beginDate
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
		userDoAppointment.timeData = e.timelist;
		console.log(userDoAppointment.timeData);
		for (var i = 0; i < userDoAppointment.timeData.length; i++) {
			var timeItemEach = $("#timeItem_" + (i + 8));
			if(userDoAppointment.timeData[i].state == "0"){
				if(timeItemEach.hasClass('userDoAppointment_timeItemDisabled')){
					timeItemEach.removeClass('userDoAppointment_timeItemDisabled');
				}
				if(timeItemEach.hasClass('userDoAppointment_timeItemOnChoose')){
					timeItemEach.removeClass('userDoAppointment_timeItemOnChoose');
				}
				timeItemEach.attr("title","");
				timeItemEach.next().text("");
				timeItemEach.next().hide();
			}else{
				var statusText = common.subStringByUnderline(userDoAppointment.timeData[i].state);
				var name = common.subStringByUnderline(statusText);
				timeItemEach.attr("title",statusText);
				timeItemEach.addClass('userDoAppointment_timeItemDisabled');

				timeItemEach.next().text(name);
				timeItemEach.next().show();
			}
		}
    },function(error){
    	console.log(error);
    });
	
};
userDoAppointment.deviceChoose = function(e){
	var self = $(e);
	if(!self.hasClass('uda_deviceSelect')){
		self.addClass('uda_deviceSelect');
	}else{
		self.removeClass('uda_deviceSelect');
	}
};
userDoAppointment.cancel = function(){
	$("#dismissApplicationDialog_udaText").text("")
	$("#dismissApplicationDialog_uda").hide();
	userDoAppointment.ifcheckrepeat = "0"
};
userDoAppointment.goonSubmit = function(){
	userDoAppointment.ifcheckrepeat = "1"
	userDoAppointment.changePage("");
	userDoAppointment.cancel();
};