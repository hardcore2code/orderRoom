var appointmentSummaryPerson;
if (!appointmentSummaryPerson)
	appointmentSummaryPerson = {};

appointmentSummaryPerson.table = "";
appointmentSummaryPerson.searchVal = "";

appointmentSummaryPerson.onLoad = function(){

	var authType = localStorage.getItem("role");
	if(authType == "admin"){
		common.setLeftToolAuth("appointmentSummaryPerson","admin");
	}else if(authType == "manager"){
		common.setLeftToolAuth("appointmentSummaryPerson","manager");
	}else if(authType == "user"){
		common.setLeftToolAuth("appointmentSummaryPerson","user");
	}
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#appointmentSummaryPerson").find(".userInfoArea_userName").text(tel);
	$("#appointmentSummaryPerson").find(".userInfoArea_mailAddr").text(email);

  appointmentSummaryPerson.searchVal = $("#appointmentSummaryPerson_searchInput").val();
	appointmentSummaryPerson.getPageData();
	
};
appointmentSummaryPerson.getPageData = function(){
	common.getLeftCount(function(){
		common.setLeftCountToPage("appointmentSummaryPerson");

		var url = Global.BASE_URL + VisitUrl.STATISTICS_PERSON;
		appointmentSummaryPerson.table = $('#appointmentSummaryPerson_table').DataTable({
			"serverSide" : true,
			"autoWidth": false, //自适应宽度，
			// "sScrollY" : 382, //DataTables的高  
			"columnDefs": [
					{"targets": 0, "width": "33.33%"},  // 设置第一列的宽度
					{"targets": 1, "width": "33.33%"},
					{"targets": 2, "width": "33.33%"},
			],
			"lengthMenu": [10, 20, 30],   // 显示每页显示的条数  
			"stripeClasses": ["odd", "even"],   // 为奇偶行添加样式
			"searching": false,       // 是否允许开启本地检索功能
			"bFilter": false,         // 去掉 搜索框
			"paging": true,            // 是否开启本地分页
			"lengthChange": true, //是否允许产品改变表格每页显示的记录数
			"info": true,             // 控制是否显示表格左下角的信息
			"pageLength": 10,      // 每页显示的条数
			"bSort": false,
			"pagingType": "full_numbers",
			"language": {
					"lengthMenu": "每页 _MENU_ 条记录 ",
					"zeroRecords": "没有找到记录",
					"info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页,共 _TOTAL_ 条 )",
					"infoEmpty": "无记录",
					"search": "搜索 : _INPUT_",
					"paginate": {
							"first": "首页",
							"last": "尾页",
							"next": "下一页",
							"previous": "前一页"
					},
					"infoFiltered": "(从 _MAX_ 条记录过滤)"
			},
			"data": null,
			"columns":[
				{data: 'name'},    // 有几列就解析几次
				{data: 'classTime'},
				{data: 'roomName'} 
			],
			ajax:function(data, callback, settings){
				var param = {
					pn: ((data.start/data.length) +1)+"",
					name: appointmentSummaryPerson.searchVal,
					ps: data.length +""
				};
				LogicUtil.doLogic(url, false, param, [], function(e) {
					var res = {}
					var dataList = (new Function('return ' + e.dataList))();

					for(var i = 0; i < dataList.length; i++){
						var dateList = dataList[i].dateList.split(",");
						var classTime = ''
						dataList[i].classTime = '';
						for (var j = 0; j < dateList.length; j++) {
							var dateItem = common.subStringByUnderlineGetBefore(dateList[j]);
							var timeItemStr = common.subStringByUnderline(dateList[j]);

							var ymd = common.subStringBySpaceGetBefore(dateItem);
							var week = common.getWeek(common.subStringBySpace(dateItem));

							var timeItem = appointmentSummaryPerson.getActionTime(timeItemStr);
							classTime += ymd + ' ' + week + ' ' +  timeItem + '<br/>';
						}
						dataList[i].classTime = classTime;
					}
					res.recordsTotal = e.totalRow;
					res.recordsFiltered = e.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
					res.data = dataList
					callback(res);
					
				},function(error){
					console.log(error);
				});
			},
		})
	});
};
appointmentSummaryPerson.doSearch = function(){
	// $("#appointmentSummaryPerson_classroomApprovalList").html("");
	// appointmentSummaryPerson.getPageData(searchVal);
	appointmentSummaryPerson.searchVal = $("#appointmentSummaryPerson_searchInput").val();
	var param = {
		pn: "1",
		name: appointmentSummaryPerson.searchVal,
		ps: "10"
	};
	var url = Global.BASE_URL + VisitUrl.STATISTICS_PERSON;
	LogicUtil.doLogic(url, false, param, [], function(e) {
		var dataList = (new Function('return ' + e.dataList))();

		for(var i = 0; i < dataList.length; i++){
			var dateList = dataList[i].dateList.split(",");
			var classTime = ''
			dataList[i].classTime = '';
			for (var j = 0; j < dateList.length; j++) {
				var dateItem = common.subStringByUnderlineGetBefore(dateList[j]);
				var timeItemStr = common.subStringByUnderline(dateList[j]);

				var ymd = common.subStringBySpaceGetBefore(dateItem);
				var week = common.getWeek(common.subStringBySpace(dateItem));

				var timeItem = appointmentSummaryPerson.getActionTime(timeItemStr);
				classTime += ymd + ' ' + week + ' ' +  timeItem + '<br/>';
			}
			dataList[i].classTime = classTime;
		}
		for(var i = 0 ; i < dataList.length ; i++)
		{
				appointmentSummaryPerson.table.row(i).columns = dataList[i];
		}
		appointmentSummaryPerson.table.draw();
		
	},function(error){
		console.log(error);
	});
};
appointmentSummaryPerson.getActionTime = function(timeItemStr){
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