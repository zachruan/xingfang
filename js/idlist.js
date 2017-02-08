var idlistData = {
	initIDList:function(listParent){
		var list = '<div id="idListContainer">' + 
					'<span>请选择证件类型</span>' +
					'<form class="mui-input-group">' +
						'<div class="mui-input-row mui-radio">' +
							'<label data-id = "1">身份证</label>' +
							'<input data-name="身份证" name="radio1" type="radio">' +
						'</div>' +
						'<div class="mui-input-row mui-radio">' +
							'<label data-id = "1">居住证</label>' +
							'<input data-name="居住证" name="radio1" type="radio">' +
						'</div>' +
						'<div class="mui-input-row mui-radio">' +
							'<label data-id="2">军官证</label>' +
							'<input data-name="军官证" name="radio1" type="radio">' +
						'</div>' +
						'<div class="mui-input-row mui-radio">' +
							'<label data-id="3">士兵证</label>' +
							'<input data-name="士兵证" name="radio1" type="radio">' +
						'</div>' +
						'<div class="mui-input-row mui-radio">' +
							'<label data-id="4">警官证</label>' +
							'<input data-name="警官证" name="radio1" type="radio">' +
						'</div>' +
						'<div class="mui-input-row mui-radio">' +
							'<label data-id="5">港澳台居民身份证</label>'+
							'<input data-name="港澳台居民身份证" name="radio1" type="radio">' +
						'</div>'+
						'<div class="mui-input-row mui-radio">' +
							'<label data-id="6">护照</label>' +
							'<input data-name="护照" name="radio1" type="radio">'+
						'</div>'+
						'<div class="mui-input-row mui-radio">'+
							'<label data-id="7">户口簿</label>'+
							'<input data-name="户口簿" name="radio1" type="radio">'+
						'</div>'+
						'<div class="mui-input-row mui-radio">'+
							'<label data-id="99">其他证件</label>'+
							'<input data-name="其他证件" name="radio1" type="radio">'+
						'</div>'+
					'</form>'+
				'</div>';
		listParent.append(list);
		var existID = document.getElementById('documentType').innerText;
		if(existID!='请选择'){
			console.log('当前储存的证件类型----'+existID);
			document.querySelector('[data-name="'+existID+'"]').checked = true;
		}
	}
}

var indexBase = {
	indexBaseInit:function(indexParent){
		var indexBase = '<div id="resultContainer">'+
							'<span id="currentArea">省份</span>'+
						'</div>' +
						'<div id="mainBox" class="mui-content"></div>';
		indexParent.append(indexBase);				
	}
}
