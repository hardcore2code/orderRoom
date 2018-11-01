var appointmentSummary;
if (!appointmentSummary)
	appointmentSummary = {};

appointmentSummary.table = "";
appointmentSummary.searchVal = "";
appointmentSummary.onLoad = function(){

	var authType = localStorage.getItem("role");
	if(authType == "admin"){
		common.setLeftToolAuth("appointmentSummary","admin");
	}else if(authType == "manager"){
		common.setLeftToolAuth("appointmentSummary","manager");
	}else if(authType == "user"){
		common.setLeftToolAuth("appointmentSummary","user");
	}
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#appointmentSummary").find(".userInfoArea_userName").text(tel);
	$("#appointmentSummary").find(".userInfoArea_mailAddr").text(email);
	

	appointmentSummary.searchVal = $("#appointmentSummary_searchInput").val();
	appointmentSummary.getPageData();
	
};
appointmentSummary.getPageData = function(){
	common.getLeftCount(function(){
		common.setLeftCountToPage("appointmentSummary");

		var url = Global.BASE_URL + VisitUrl.STATISTICS_CLASSROOM;
		appointmentSummary.table = $('#appointmentSummary_table').DataTable({
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
				{data: 'roomName'},    // 有几列就解析几次
				{data: 'cnum'},
				{data: 'name'} 
			],
			ajax:function(data, callback, settings){
				var param = {
					pn: ((data.start/data.length) +1)+"",
					name: appointmentSummary.searchVal,
					ps: data.length +""
				};
				LogicUtil.doLogic(url, false, param, [], function(e) {
					var res = {}
					var dataList = (new Function('return ' + e.dataList))();
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
appointmentSummary.doSearch = function(){
	appointmentSummary.searchVal = $("#appointmentSummary_searchInput").val();
	// $("#appointmentSummary_classroomApprovalList").html("");
	// appointmentSummary.getPageData(searchVal);
	var param = {
		pn: "1",
		name: appointmentSummary.searchVal,
		ps: "10"
	};
	var url = Global.BASE_URL + VisitUrl.STATISTICS_CLASSROOM;
	LogicUtil.doLogic(url, false, param, [], function(e) {
		var dataList = (new Function('return ' + e.dataList))();
		for(var i = 0 ; i < dataList.length ; i++)
		{
				appointmentSummary.table.row(i).columns = dataList[i];
		}
		appointmentSummary.table.draw();
		
	},function(error){
		console.log(error);
	});
};