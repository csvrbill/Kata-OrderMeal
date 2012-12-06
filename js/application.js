/*
 * 默认加载函数，
 * 在系统没有创建order的本地存储对象时创建他。
 */
$(document).ready(function(){
	if(!window.localStorage.order)
	{
		var order = "";
		window.localStorage.order = order;
	}
});

/*
 * “选人”页面列表函数
 * 打印人员清单，构造LI列表
 */
function showUser(){
	var str = "";
	$.each(users,function(n,value) { 
		str += "<li><a href='#' onclick='selectUser(\""+value.name+"\")'>"+value.name+"</a></li>";
	});
	$("#nav").html(str);
};

/*
 * “选餐厅”页面列表函数
 * 打印餐厅清单，构造LI列表
 */
function showRestaurant(){
	var str = "";
	$.each(restaurants,function(n,value) { 
		str += "<li><a href='#' onclick='selectRestaurant(\""+value.name+"\")'>"+value.name+"</a></li>";
	});
	$("#nav").html(str);
};

/*
 * “选套餐”页面列表函数
 * 根据所选的餐厅打印套餐清单，构造LI列表
 */
function showFood(){
	if(!window.localStorage.restaurant)
	{
		alert("请先选择餐厅，谢谢！");
		location='./order.html';
	}
	var str = "";
	var restaurant = window.localStorage.restaurant;
	$.each(foods[restaurant],function(n,value) { 
		str += "<li><a href='#' onclick='selectFood(\""+value.name+"\",\""+value.price+"\")'>"+value.name+"<p class=\"ui-li-aside\">￥"+value.price+"</p>"+"</a></li>";
	});
	
	$("#nav").html(str);
};

/*
 * “选人”页面处理函数
 * 获取所选的信息，将信息保存在本地存储中
 */
function selectUser(name){
	window.localStorage.user = name;
	location='./order.html';
};

/*
 * “选餐厅”页面处理函数
 * 获取所选的信息，将信息保存在本地存储中
 */
function selectRestaurant(name){
	window.localStorage.restaurant = name;
	location='./order.html';
};

/*
 * “选套餐”页面处理函数
 * 获取所选的信息，将信息保存在本地存储中
 */
function selectFood(name,price){
	window.localStorage.food = name;
	window.localStorage.pre = price;
	location='./order.html';
};

/*
 * 帮订餐页面默认加载函数
 * 获取本地存储的信息填到表单中
 */
function initOrder(){
	$("#user").attr("value",window.localStorage.user);
	$("#restaurant").attr("value",window.localStorage.restaurant);
	$("#food").attr("value",window.localStorage.food);
};

/*
 * 帮订餐页面提交
 * 提交已经选好信息的订单
 */
function submitOrder(){
	if(!(window.localStorage.user && window.localStorage.food))
	{
		alert("很抱歉，您的选择不完整，谢谢！");
		location='./order.html';
	}
	var order = window.localStorage.order;
	var user = window.localStorage.user;
	var restaurant = window.localStorage.restaurant;
	var food = window.localStorage.food;
	var pre = window.localStorage.pre;
	
	var orderinfo = ""; 
	orderinfo = user+","+restaurant+","+food+","+pre+";";
	order = order + orderinfo;
	window.localStorage.order = order;
	localStorage.removeItem("food");
	localStorage.removeItem("user");
	localStorage.removeItem("pre");
	location = './order.html';
};

/*
 * 展示订单数据
 */
function showOrdered(){
	var str = "";	
	str += "<li data-role=\"list-divider\" role=\"heading\" class=\"ui-li ui-li-divider ui-bar-b\">"+countSelected().length+"人已定</li>";
	str += orderList();
	var lstr = countUnSelected(countSelected());
	var head = "<li data-role=\"list-divider\" role=\"heading\" class=\"ui-li ui-li-divider ui-bar-b\">"+window.localStorage.UnNum+"人未定</li>";
	lstr = head + lstr;
	str = str + lstr; 
	$("#nav").html(str);
}

/*
 * 清空本地存储
 */
function clearSystem()
{
	window.localStorage.clear();
}

/*
 * 显示订单页脚部分统计信息
 */
function countOrder(){
	var str = "<h4>"+countSelected().length+"人已定，"+ window.localStorage.UnNum +"人未定，总计："+countPrice()+"元</h4>";
	$("#footer").html(str);
}
/*
 * 生成已选人员数组
 */
function countSelected(){
	var arr = new Array();
	if(window.localStorage.order != "" && window.localStorage.order)
	{
		var orderRow = window.localStorage.order.split(";");
		for(var k = 0;k<orderRow.length-1;k++)
		{
			flag = 0;
			var OrderInfo = orderRow[k].split(",");
			for(var m = 0;m<arr.length;m++)
			{
				if(arr[m] == OrderInfo[0]){
					flag = 1;
					break;
				}
			}
			if(flag == 0){
				arr[arr.length] = OrderInfo[0];
			}
		}
	}
	return arr;
}

/*
 * 生成未选人员数组
 */
function countUnSelected(){
	var lstr = "";
	var num = 0;
	var flag =0;
	var arr=countSelected();
	$.each(users,function(n,value) { 
		for(var i =0;i<arr.length;i++)
		{
			flag = 0;
			if(value.name == arr[i])
			{
				flag = 1;
				break;
			}
		}
		if(flag == 0){
			num = num+1;
			lstr += "<li>"+value.name+"</li>";
		}
	});
	window.localStorage.UnNum = num;
	return lstr;
}

/*
 * 生成订单列表
 */
function orderList(){
	if(window.localStorage.order != "" && window.localStorage.order)
	{
		var orderRow = window.localStorage.order.split(";");
		var str="";
		for(var i = 0;i<orderRow.length-1;i++)
		{
			var OrderInfo = orderRow[i].split(",");
			var user = OrderInfo[0];
			var restaurant = OrderInfo[1];
			var food = OrderInfo[2];
			var pre = OrderInfo[3];
			
			str += "<li>";
			
			if(pre>12)
			{
				var over = pre - 12;
				str += "<p class=\"ui-li-aside\"><font color='red'><font>"+"￥"+pre+"(超过：￥"+over+")"+"</font></font></p>";
			}
			else
			{
				str += "<p class=\"ui-li-aside\"><font><font>"+"￥"+pre+"</font></font></p>";
			}
			str += "<h3 class=\"ui-li-heading\"><font><font>"+user+"</font></font></h3>";
			str += "<p class=\"ui-li-desc\"><font><font>"+restaurant+" "+food+"</font></font></p>";
			str += "</li>";
		}
		return str;
	}
	else
	{
		return "";
	}
}

/*
 * 计算总价
*/
function countPrice(){
	if(window.localStorage.order == "" || !window.localStorage.order)
	{
		return 0;
	}
	var price=0;
	var orderRow = window.localStorage.order.split(";");
	for(var i = 0;i<orderRow.length-1;i++)
	{
		var OrderInfo = orderRow[i].split(",");
		var pre = OrderInfo[3];
		price = parseFloat(pre) + parseFloat(price);
	}
	return price;
} 