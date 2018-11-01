var watchClassroom;
if (!watchClassroom)
	watchClassroom = {};

watchClassroom.unitData = [];
watchClassroom.buildingData = [];
watchClassroom.roomNoData = [];

watchClassroom.roomId = "";
watchClassroom.beginDate = "";
watchClassroom.timeData = [];

watchClassroom.onLoad = function(){

	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#watchClassroom").find(".userInfoArea_userName").text(tel);
	$("#watchClassroom").find(".userInfoArea_mailAddr").text(email);

	var authType = localStorage.getItem("role");
	if(authType == "user"){
		common.setLeftToolAuth("watchClassroom","user");
	}else if(authType == "manager"){
		common.setLeftToolAuth("watchClassroom","manager");
	}
	var myDate = new Date();
	$("#watchClassroom_datepicker" ).datepicker({
		inline: true,
		minDate: myDate,
		onSelect: function (dateText, inst) {
				watchClassroom.beginDate = inst.selectedYear + "-" +(inst.selectedMonth + 1) + "-" + inst.selectedDay;
				watchClassroom.timeDataPush(watchClassroom.beginDate);
		},
	});

	common.getLeftCount(function(){
		common.setLeftCountToPage("watchClassroom");
		watchClassroom.getSelectRoom("1");
	});

};
watchClassroom.changeSelect = function(e,type){
	var value = $(e).children('option:selected').val();
	if(type == '0'){
		if(value == ""){
			$("#watchClassroom_building").html("");
			$("#watchClassroom_room").html("");
			return;
		}
		watchClassroom.getSelectRoom("2",value);
	}else if(type == "1"){
		if(value == ""){
			$("#watchClassroom_room").html("");
			return;
		}
		var unitSelect = $("#watchClassroom_managerCompany").children('option:selected').val();
		watchClassroom.getSelectRoom("3",unitSelect,value);
	}else if(type == "2"){
		watchClassroom.roomId = $("#watchClassroom_room").children('option:selected').val();
		var myDate = new Date();
		watchClassroom.beginDate = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();

		//初始化日期
		watchClassroom.timeDataPush(watchClassroom.beginDate);
	}
};
watchClassroom.getSelectRoom = function(type,unit,building,roomNo){

	var url = Global.BASE_URL + VisitUrl.SELECTROOM;
	var param = {};
	if(type == "1"){
		$("#watchClassroom_managerCompany").html("");
		$("#watchClassroom_building").html("");
		$("#watchClassroom_room").html("");
		param.unit = "";
		param.building = "";
		param.roomNo = "";
	}else if(type == "2"){
		$("#watchClassroom_building").html("");
		$("#watchClassroom_room").html("");
		param.unit = unit;
		param.building = "";
		param.roomNo = "";
	}else if(type == "3"){
		$("#watchClassroom_room").html("");
		param.unit = unit;
		param.building = building;
		param.roomNo = "";
	}

	LogicUtil.doLogic(url, false, param, [], function(e) {
		var dataList = (new Function('return ' + e.dataList))();
		if(type == "1"){
			watchClassroom.unitData = dataList;
			var managerCompanySelect = $("#watchClassroom_managerCompany");
				for (var i = 0; i < watchClassroom.unitData.length + 1; i++) {
					var option = "";
					if(i == 0){
						option = '<option value="" selected>选择管理单位</option>';
					}else{
						option = '<option value ="' + watchClassroom.unitData[i-1].unit + '">' + watchClassroom.unitData[i-1].unit + '</option>';
						
					}
					managerCompanySelect.append(option);
				}
		}else if(type == "2"){
			watchClassroom.buildingData = dataList;

			var buildingSelect = $("#watchClassroom_building");
				for (var i = 0; i < watchClassroom.buildingData.length + 1; i++) {
					var option = "";
					if(i == 0){
						option = '<option value="" selected>选择楼宇</option>';
					}else{
						option = '<option value ="' + watchClassroom.buildingData[i-1].building + '">' + watchClassroom.buildingData[i-1].building + '</option>';
						
					}
					buildingSelect.append(option);
				}
		}else if(type == "3"){
			watchClassroom.roomNoData = dataList;

			var roomSelect = $("#watchClassroom_room");
				for (var i = 0; i < watchClassroom.roomNoData.length + 1; i++) {
					var option = "";
					if(i == 0){
						option = '<option value="" selected>选择房间号</option>';
					}else{
						option = '<option value ="' + watchClassroom.roomNoData[i-1].roomId + '">' + watchClassroom.roomNoData[i-1].roomNo + '</option>';
						
					}
					roomSelect.append(option);
				}
		}
		
	},function(error){
		console.log(error);
	});
};
watchClassroom.checkTimeChoose = function(){
	var timeIndex = "";
	var returnStatus = "0";//0没问题，1不连续，2未选择
	for (var i = 0; i < watchClassroom.timeData.length; i++) {
		if(watchClassroom.timeData[i].state == "2"){
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
watchClassroom.timeDataPush = function(beginDate){
	var url = Global.BASE_URL + VisitUrl.QUERYORDERTIMEUSED;
	var param = {
		roomId : watchClassroom.roomId,
		orderdate : beginDate
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
		watchClassroom.timeData = e.timelist;
		console.log(watchClassroom.timeData);
		for (var i = 0; i < watchClassroom.timeData.length; i++) {
			var timeItemEach = $("#timeItem_" + (i + 8));
			if(watchClassroom.timeData[i].state == "0"){
				if(timeItemEach.hasClass('watchClassroom_timeItemDisabled')){
					timeItemEach.removeClass('watchClassroom_timeItemDisabled');
				}
				if(timeItemEach.hasClass('watchClassroom_timeItemOnChoose')){
					timeItemEach.removeClass('watchClassroom_timeItemOnChoose');
				}
				timeItemEach.attr("title","");
				timeItemEach.next().text("");
				timeItemEach.next().hide();
			}else{
				var statusText = common.subStringByUnderline(watchClassroom.timeData[i].state);
				var name = common.subStringByUnderline(statusText);
				timeItemEach.attr("title",statusText);
				timeItemEach.addClass('watchClassroom_timeItemDisabled');

				timeItemEach.next().text(name);
				timeItemEach.next().show();
			}
		}
    },function(error){
    	console.log(error);
    });
	
};