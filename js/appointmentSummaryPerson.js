var appointmentSummaryPerson;
if (!appointmentSummaryPerson)
	appointmentSummaryPerson = {};

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

	// var searchVal = $("#appointmentSummaryPerson_searchInput").val();
	appointmentSummaryPerson.getPageData();
	
};
appointmentSummaryPerson.getPageData = function(content){
	
	var res = {
		list: [{
			name: "12312",
			tel: "2018-02-30 周五 10：00 - 12：00 <br/> 2018-02-30 周五 10：00 - 12：00 <br/> 2018-02-30 周五 10：00 - 12：00",
			code: "123123"
		},{
			name: "12312",
			tel: "2018-02-30 周五 10：00 - 12：00",
			code: "123123"
		},{
			name: "12312",
			tel: "2018-02-30 周五 10：00 - 12：00",
			code: "123123"
		},{
			name: "12312",
			tel: "2018-02-30 周五 10：00 - 12：00",
			code: "123123"
		},{
			name: "12312",
			tel: "2018-02-30 周五 10：00 - 12：00",
			code: "123123"
		},{
			name: "12312",
			tel: "2018-02-30 周五 10：00 - 12：00",
			code: "123123"
		}]
	}
	  
	$('#appointmentSummaryPerson_table').DataTable({
		data : res.list,
		"autoWidth": false, //自适应宽度，
		"sScrollY" : 382, //DataTables的高  
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
		"columns":[
			{data: 'name'},    // 有几列就解析几次
			{data: 'tel'},
			{data: 'code'} 
		]
	})


	var url = Global.BASE_URL + VisitUrl.STATISTICS_PERSON;
	var param = {
		params : content
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {

		var dataList = (new Function('return ' + e.dataList))();
		
		common.getLeftCount(function(){
			common.setLeftCountToPage("appointmentSummaryPerson");
		});

	},function(error){
		console.log(error);
	});
};
appointmentSummaryPerson.doSearch = function(){
	var searchVal = $("#appointmentSummaryPerson_searchInput").val();
	$("#appointmentSummaryPerson_classroomApprovalList").html("");
	appointmentSummaryPerson.getPageData(searchVal);
};