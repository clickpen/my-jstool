Element.prototype.createTurnPage = function(json) {
	var str1 = "<ul class='imgUl'>";
	var str2 = "<span class='btn btnR' title='下一张'>&gt</span><ul class='navUl'>"
	for(var prop in json) {
		str1 += "<li><img src='" + json[prop] + "'></li>";
	}
	str1 += "<li><img src='" + json[1] + "'></li>";
	str1 += "</ul><span class='btn btnL' title='上一张'>&lt</span>";
	for(var prop in json) {
		str2 += "<li num='" + prop + "'></li>";
	}
	str2 += "</ul>";
	this.innerHTML = str1 + str2;
	var ul = this.getElementsByClassName('imgUl')[0];
	console.log(ul.offsetLeft);
	var btnL = this.getElementsByClassName('btnL')[0];
	var btnR = this.getElementsByClassName('btnR')[0];
	var navUl = this.getElementsByClassName('navUl')[0];
	var indexList = navUl.getElementsByTagName('li');
	var botime = null;
	var lock = true;
	var index = 0;
	var len = (function(json) {
		var count = 0;
		for(var prop in json) {
			count++;
		}
		return count;
		})(json)
	var ulmove = {
		'left': 0
	};
	ul.style.width = (len + 1) * 500 + 'px';
	navUl.style.width = 20 * len + 'px';
	changeIndex(0);
	function init() {
		botime = setInterval(function() {
			ulmove.left -= 500;
			index ++;
			startMove(ul, ulmove);
			changeIndex(index %= len);
		}, 3000)
	}
	init();
	btnR.addEventListener('click', function() {
		if(lock) {
			lock = false;
			clearInterval(botime);
			index ++;
			ulmove.left -= 500;
			startMove(ul, ulmove);
			init();
			changeIndex(index %= len);
		}
	})
	btnL.addEventListener('click', function() {
		if(lock) {
			lock = false;
			clearInterval(botime);
			if(ul.offsetLeft == 0) {
				index += len;
				index --;
				ulmove.left = -(500 * len);
				ul.style.left = -(500 * len) + 'px';
				ulmove.left += 500;
				startMove(ul, ulmove);
				init();
				changeIndex(index %= len);
			} else {
				index --;
				ulmove.left += 500;
				startMove(ul, ulmove);
				init();
				changeIndex(index %= len);
			}
		}
	})
	function changeIndex(_index) {
		for(var i = 0; i < indexList.length; i++) {
			indexList[i].className = "";
		}
		indexList[_index].className = "actived";
	}
	for(var i = 0; i < indexList.length; i++) {
		(function(i) {
			indexList[i].addEventListener('click', function() {
				clearInterval(botime);
				ulmove.left = -i * 500;
				startMove(ul, ulmove);
				changeIndex(index = i);
				init();
			})
		})(i)
	}
	function startMove(obj, json) {
		clearInterval(obj.timer);
		lock = false;
		var iSpeed, iCur;
		obj.timer = setInterval(function() {
			var bStop = true;
			for(var attr in json) {
					iCur = parseInt(getStyle(obj, attr));
				iSpeed = (json[attr] - iCur) / 7;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
					obj.style[attr] = iCur + iSpeed + 'px';
				if(iCur != json[attr]) {
					bStop = false;
				}
			}
			if(bStop) {
				clearInterval(obj.timer);
				lock = true;	//函数执行完的时候将锁打开，使下一次点击生效
				index %= len;
			}
			if(ul.offsetLeft <= -(500 * len)) {
				ulmove.left = 0;
				ul.style.left = '0px';
			}
		}, 30)
	}
	function getStyle(obj, attr) {	//封装getStyle
		if(obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return window.getComputedStyle(obj, false)[attr];
		}
	}
}
