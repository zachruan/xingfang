//var b = new Base64();
var commonUtilSendActionStr = '';//地址

//	commonUtilSendActionStr = 'http://www.gdwsxf.gov.cn/mess/app/gdwsxf.jsp';//接口版本1.0
	commonUtilSendActionStr = 'http://www.gdwsxf.gov.cn/mess/app/1.0.1/gdwsxf.jsp';//接口版本1.0.1
	
//	commonUtilSendActionStr = 'http://113.65.160.183:8088/mess/app/1.0.1/gdwsxf.jsp';
//	commonUtilSendActionStr = 'http://quickcreate.gicp.net/mess/app/gdwsxf.jsp';//测试地址
	//commonUtilSendActionStr = 'http://192.168.24.222:8080/websiteGX/app/app_server!queryLatestNews.action';
	
var commonUtil = { 
	// 保存
	sendJson: function(pid, dt, actionUrl, callback,errorCallBack,ajaxErrorCallBack) {
		/**
		 * 通用ajax post请求
		 * @param {String} pid 请求的端口
		 * @param {Object} data 提交数据
		 * @param {Function} callback 请求成功回调函数
		 * @param {Function} errorCallBack 服务器返回的错误处理
		 * @param {Function} ajaxErrorCallBack ajax的error回调处理
		 */
		//callback是正确返回数据回调，参数为已解码后的json对象
		//errorCallBack是服务器返回的错误，如时间不对，验证码错误等，需要进行处理
		//ajaxErrorCallBack是ajax的错误回调，如网络异常，中断，404,500等错误，参数为xhr,type,errorThrown 3个
		var id = this.uuid();
		var crt = new Date().pattern("yyyyMMdd:HHmmss");
		var bid = 'b001';
		var pid = pid;
		console.log('dt数据未加密：' + $.toJSON(dt));
		//var yy = dt == '' ? '' : b.encode('' + $.toJSON(dt));
		var yy = dt == '' ? '' : escape('' + $.toJSON(dt));
		//console.log('token数据未加密:' + id + bid + crt + pid + '###' + yy);
		var token = $.md5(id + bid + crt + pid + '###' + yy);
		var hd = {
			id: id,
			bid: bid,
			crt: crt,
			token: token,
			pid: pid
		};
		var request = {
			hd: hd,
			dt: yy
		};
		//调用了jquery.json 库  
		var encoded = $.toJSON(request);
		//console.log('最终发送的数据' + encoded);
		var jsonStr = encoded;
		var actionStr = commonUtilSendActionStr;//地址
		var finalDt;
		common.ajaxPostData(actionStr, jsonStr, verifyData,ajaxErrorCallBack);

		function verifyData(data) { //返回值token验证
			//console.log('data--'+JSON.stringify(data));
			if(data.dt == '' && data.hd.rtc != 0) {
				//console.log('空返回数据头--->' + JSON.stringify(data.hd) + '<---');
				var errorText = data.hd.eds;
				switch(data.hd.rtc){
					case '-1':
						console.log('错误代码:"-1",请求数据格式不正确--'+errorText);
						break;
					case '-12':
						console.log('错误代码:"-12",业务编号不存在--'+errorText);
						break;
					case '-13':
						console.log('错误代码:"-13",业务编号未授权--'+errorText);
						break;
					case '-20':
						console.log('错误代码:"-20",请求时间格式不正确--'+errorText);
						break;
					case '-21':
						console.log('错误代码:"-21",请求时间已过期'+'--'+errorText);
						mui.toast('请检查并调整系统时间');
						break;
					case '-24':
						console.log('错误代码:"-24",请求编号不存在'+'--'+errorText);
						break;
					case '-25':
						console.log('错误代码:"-25",接口编号未授权'+'--'+errorText);
						break;
					case '-26':
						console.log('错误代码:"-26",接口编号已过期'+'--'+errorText);
						break;
					case '-30':
						console.log('错误代码:"-30",加密串验证失败'+'--'+errorText);
						break;
					case '13201':
						mui.toast('验证码错误,请重新获取');
						break;
					case '13202':
						mui.toast('验证码过期，请重新获取');
						break;
					case '13203':
						mui.toast('请重新发送验证码');
						break;
					default:
						//console.log('错误信息为--'+errorText);
						break;
				}
				if(typeof errorCallBack == 'function'){ //如果有错误回调处理方法则执行
					errorCallBack();
				}
				return;
			}
			var returnHd = data.hd;
			var returnedToken = returnHd.token;
			//console.log('returnedToken--'+returnedToken);
			var calToken = $.md5(returnHd.id + returnHd.crt + returnHd.rtc + returnHd.pid + '###' + data.dt);
			//console.log('caltoken--'+calToken);
			if(calToken == returnedToken) {
				var isOk = true;
			} else {
				var isOk = false;
			}
			//console.log('返回的头为--'+JSON.stringify(data.hd));
			console.log('返回数据为--'+unescape(data.dt)); 
			var finalDt = isOk ? JSON.parse(unescape(data.dt)):'token验证错误'+returnedToken;
			//console.log('返回数据解码后--'+unescape(finalDt));
			//finalDt = eval(base64utf8.decode64(data.dt));
			if(typeof finalDt === 'object') {
				//console.log('callbackstart');
				return callback(finalDt);
			} else {
				//console.log(finalDt); 
				//console.log(typeof finalDt);
				//console.log('错误返回---' + returnHd.eds);
				return false;
			}

		}
	},
	initNation2: function() {

	},
	//返回id方法
	uuid: function() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for(var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	},
	//索引查询生成
	createIndexedList: function(el, port, url, dt,deviceHeight) {
		//el为Jquery选择器对象;
		//url为本次列表通信地址
		//port为本次通信接口
		//dt为区域判断和数据对象，格式为{type:'',data:''};,type为district获取区域列表,city获取城市列表，不填为省列表；data为对应传输数据；
		dt = dt || {};
		var self = this;
		var base = '<div id="list" class="mui-indexed-list">' +
			'<div class="mui-indexed-list-search mui-input-row mui-search">' +
			'<input type="search" id="spare" class="mui-input-clear mui-indexed-list-search-input" placeholder="搜索">' +
			'</div>' +
			'<div class="mui-indexed-list-bar"></div>' +
			'<div class="mui-indexed-list-alert"></div>' +
			'<div class="mui-indexed-list-inner">' +
			'<div class="mui-indexed-list-empty-alert">没有数据</div>' +
			'<ul id="dependencyUL" class="mui-table-view"></ul>' +
			'</div>' +
			'</div>';
		el.append(base);
		var list = document.getElementById('list'); 
		if(!deviceHeight){
			//调整容器高度
			list.style.height = (document.body.offsetHeight-44) + 'px';
			//console.log(list.style.height);
		}else{
			list.style.height = deviceHeight; //调整容器高度
		}
		
		var type = dt.type;
		switch(type) {
			case 'city': //获取市级数据
				var data = {
					proid: dt.data
				};
				self.sendJson(port, data, url, setUpList);
				break;
			case 'district': //获取市级下面区域数据
				var data = {
					cid: dt.data
				};
				self.sendJson(port, data, url, setUpList);
				break;
			default: //默认获取省级数据
				self.sendJson(port, '', url, setUpList);
				break;
		}

		function setUpList(data) {
			var json = data;
			//console.log('省市区返回数据---' + JSON.stringify(json));
			var length = json.length;
			var listBar = $('.mui-indexed-list-bar');
			var dependencyUl = $('#dependencyUL');
			var likey='';
		for (var key in json) {
			//console.log("key===" + key);
			liKey = "<li data-group="+key.toUpperCase()+" class='mui-table-view-divider mui-indexed-list-group'>"+key.toUpperCase()+"</li>";
			listBar.append("<a>"+key.toUpperCase()+"</a>");
			for (var i = 0; i < json[key].length; i++) {
				var da = json[key][i];
				var areaCode = da.proid || da.cid;
				//var result = "<li data-value=" + json[key][i].code + " data-tags=" + json[key][i].name + " data-fullname="+ json[key][i].spare +" class='mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left'>" + json[key][i].chinesename + "</li>"
				var result = "<li data-value=" + areaCode + " data-tags=" + da.nameSX + " class='mui-table-view-cell mui-indexed-list-item'>" + da.name.trim() + "</li>";
				liKey += result;
			}
			dependencyUl.append(liKey);
		}
//			for(var key in json) {
//				var da = json[key];
//				var areaCode = da.proid || da.cid;
//				//console.log(areaCode);
//				var result = "<li data-value=" + areaCode + " data-tags=" + da.nameSX + " class='mui-table-view-cell mui-indexed-list-item'>" + da.name + "</li>";
//				likey += result;
//			}
//			dependencyUl.append(likey);
			window.indexedList = new mui.IndexedList(list);
		}
	},
	print: function(){
		console.log('123');
	},
	callLocalPhoto:function(){
		//var f1 = new Array();
		createMaskAndPickList();
		function createMaskAndPickList(){
			var body = $('body');
			var mask = '<div id="photoMask"></div>' +
						'<ul id="photoChoiceList" class="mui-table-view">' +
							'<li id="fromGlaxy" class="mui-table-view-cell p-pick-li">从相册中选择</li>' +
							'<li id="fromCamera" class="mui-table-view-cell p-pick-li">拍照</li>' +
						'</ul>';
			body.append(mask);
			$('#outerBox').addClass('textShadow');
			onClick(function(type){
				clearMaskAndPickList();
				getPhotoFrom(type);
			});
		} 
		function clearMaskAndPickList(){ 
			$('#photoChoiceList').remove();
			$('#photoMask').remove();
			
		}
		
		function onClick(callback){
			var type;
			var mask = document.getElementById('photoMask');
			var list = document.getElementById('photoChoiceList');
			mask.addEventListener('tap',function(){
				this.parentElement.removeChild(this);
				list.parentElement.removeChild(list);
				document.getElementById('outerBox').classList.remove('textShadow');
			});
			mui('#photoChoiceList').on('tap','li',function(){
				if(this == list.childNodes[0]){
					type = 'galaxy';
					callback(type);
				}else{
					type = 'camera';
					callback(type);
				}
				document.getElementById('outerBox').classList.remove('textShadow');
			});
		}
		
		function getPhotoFrom(type){
			if(type == 'galaxy'){
				galleryImg();
			}else if(type == 'camera'){
				cameraimages();
			}else{
				
			}
			// 全局数组对象，添加文件,用于压缩上传使用
			
				//上传单张图片
			function galleryImg() {
				//每次拍摄或选择图片前清空数组对象
				//f1.splice(0, f1.length);
				//document.getElementsByClassName("showimg")[0].innerHTML = null;
				// 从相册中选择图片
				if(mui.os.ios){
					var isGalleryPermitted = plus.navigator.checkPermission('GALLERY');
					if(isGalleryPermitted != 'authorized'){
						//mui.toast('请在系统设置中允许使用相册');
						mui.alert('打开相册功能需要权限，请在系统设置中允许"广东信访"访问相册','提示','我知道了');
						return;
					}
				}
				mui.toast("从相册中选择一张图片");
				plus.gallery.pick(function(path) {
					//console.log('相册中选择图片的路径=='+path);
					showImg(path);
				}, function(e) {
					mui.toast("取消选择图片");
				}, {
					filter: "image",
					multiple: false
				});
			}
			
			// 拍照添加文件
			function cameraimages() {
				//每次拍摄或选择图片前清空数组对象
				//f1.splice(0, f1.length);
				//document.getElementsByClassName("showimg")[0].innerHTML = null;
				if(mui.os.ios){
					var isCameraPermitted = plus.navigator.checkPermission('CAMERA');
					if(isCameraPermitted != 'authorized'){
						//mui.toast('摄像请在系统设置中允许使用摄像头');
						mui.alert('打开拍照功能需要权限，请在系统设置中允许"广东信访"访问相机','提示','我知道了');
						return;
					}
				}
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(p) {
					plus.io.resolveLocalFileSystemURL(p, function(entry) {
						var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
						showImg(localurl);
					});
				}, function(e) {
					//mui.toast("很抱歉，获取失败 ");
					console.log('摄像头错误-'+e);
				});
			}
		}
		function showImg(url) {
			// 兼容以“file:”开头的情况
			if (0 != url.toString().indexOf("file://")) {
				url = "file://" + url;
			}
			var _div_;
			var _img_ = new Image();
			_img_.src = url; // 传过来的图片路径在这里用。
			_img_.onclick = function() {
				plus.runtime.openFile(url);
			};
			_img_.onload = function() {
				var tmph = _img_.height;
				var tmpw = _img_.width;
				var isHengTu = tmpw > tmph;
				var max = Math.max(tmpw, tmph);
				var min = Math.min(tmpw, tmph);
				var bili = min / max;
				if (max > 1200) {
					max = 1200;
					min = Math.floor(bili * max);
				}
				tmph = isHengTu ? min : max;
				tmpw = isHengTu ? max : min;
				_img_.style.border = "1px solid rgb(200,199,204)";
				_img_.style.margin = "10px";
				_img_.style.width = "150px"; 
				_img_.style.height = "150px";
				_img_.onload = null;
				plus.io.resolveLocalFileSystemURL(url, function(entry) {
						entry.file(function(file) {
//							for(var i in file){
//								console.log('--'+i+'--'+file[i]+'--');
//							}
							console.log(file.size + '--' + file.name+'--'+file.path);
							canvasResize(file, {
								width: tmpw,
								height: tmph,
								crop: false,
								quality: 50, //压缩质量
								rotate: 0,
								callback: function(data, width, height) {
									createLi(false);
									createLi(true);
									_div_ = document.getElementsByClassName("showimg")[0];
									_div_.innerHTML = '';
									//f1.push(data);
									_div_.dataset.imgData = data.toString();
									_img_.src = data;
									_div_.appendChild(_img_);
									plus.nativeUI.closeWaiting();
								}
							});
						});
					},
					function(e) {
						plus.nativeUI.closeWaiting();
						console.log(e.message);
					});
			};
		}
		function createLi(type){
			if(type){
				var imgLi = '<li class="mui-table-view-cell imgContainer">'+
							'<div class="showimg"></div>' +
						'</li>';
				$('#photo').after(imgLi);
			}else{
				console.log('清除上次的图片');
				$('.imgContainer').remove();
			}
			
		}	
	}
	,/** 保存  返回完整头部数据hd以及内容dt  */
	sendJsonNew: function(pid, dt, actionUrl, callback) {
		var id = this.uuid();
		var crt = new Date().pattern("yyyyMMdd:HHmmss");
		var bid = 'b001';
		var pid = pid;
		//console.log('dt数据未加密：' + $.toJSON(dt));
		//var yy = dt == '' ? '' : b.encode('' + $.toJSON(dt));
		var yy = dt == '' ? '' : escape('' + $.toJSON(dt));
		//console.log('token数据未加密:' + id + bid + crt + pid + '###' + yy);
		var token = $.md5(id + bid + crt + pid + '###' + yy);
		var hd = {
			id: id,
			bid: bid,
			crt: crt,
			token: token,
			pid: pid
		};
		var request = {
			hd: hd,
			dt: yy
		};
		//调用了jquery.json 库  
		var encoded = $.toJSON(request);
		//console.log('最终发送的数据' + encoded);
		var jsonStr = encoded;
		var actionStr = commonUtilSendActionStr;
		var finalDt;
		common.ajaxPostData(actionStr, jsonStr, verifyData);

		function verifyData(data) { //返回值token验证
			//console.log('data--'+JSON.stringify(data));
			var returnHd = data.hd;
			var returnedToken = returnHd.token;
			//console.log('returnedToken--'+returnedToken);
			var calToken = $.md5(returnHd.id + returnHd.crt + returnHd.rtc + returnHd.pid + '###' + data.dt);
			//console.log('caltoken--'+calToken);
			if(calToken == returnedToken) {
				var isOk = true;
			} else {
				var isOk = false;
			}
			if(data.dt != '') {
				data.dt = unescape(data.dt); 
			}
			return callback(data);
			//console.log('返回数据为:'+base64utf8.decode64(data.dt)); 
			//console.log("输出解密后的data:"+JSON.stringify(data));

		}
	}
};
//时间格式方法
Date.prototype.pattern = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份         
		"d+": this.getDate(), //日         
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
		"H+": this.getHours(), //小时         
		"m+": this.getMinutes(), //分         
		"s+": this.getSeconds(), //秒         
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度         
		"S": this.getMilliseconds() //毫秒         
	};
	var week = {
		"0": "/u65e5",
		"1": "/u4e00",
		"2": "/u4e8c",
		"3": "/u4e09",
		"4": "/u56db",
		"5": "/u4e94",
		"6": "/u516d"
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

var weixinSessionID = {
	getSessionId : function() {
		var c_name = 'JSESSIONID';
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) {
						c_end = document.cookie.length
						return unescape(document.cookie.substring(c_start, c_end));
					}
			}
		}
	}
}

