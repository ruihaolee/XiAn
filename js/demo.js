// By  ruihaoLee 2016.4.27

(function () {
	var needBounding = {
		canvasBounding : {
			width : 800,
			height : 500,
			image : null
		},
		arcPosition : {
			x : 350,
			y : 150,
			r : 40
		}
	};
	var ifShow = false;
	var blurCanvas = null;
	var clickFuns = {
		clickBoxHandle : function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		console.log(ifShow);
		//console.log(target.id);
		switch(target.id){
			case 'reset' :
					if (ifShow) {
						ifShow = false;
						blurCanvas.arcPosition.r = 40;
						blurCanvas.drawArcImage();
						return;
					}
					this.getRandomXY();
					blurCanvas.drawArcImage();
					break;
			case 'show':
					//alert('show');
					window.requestAnimationFrame(blurCanvas.showAnimate.bind(blurCanvas));
					break;
			default : break;		
			}
		},
		getRandomXY : function(){
			var r = needBounding.arcPosition.r;
			var x = Math.floor(Math.random() * needBounding.canvasBounding.width);
			var y = Math.floor(Math.random() * needBounding.canvasBounding.height);
			if ((x + r) > needBounding.canvasBounding.width || (x - r) < 0 || (y + r) > needBounding.canvasBounding.height || (y - r) < 0) {
				arguments.callee();
				return;
			}
			blurCanvas.arcPosition.x = x;
			blurCanvas.arcPosition.y = y;
			//console.log(blurCanvas.arcPosition);
		}
	}

	function BlurCanvas (needBounding){
		this.canvasBounding = needBounding.canvasBounding;
		this.arcPosition = needBounding.arcPosition;

		var canvas = document.getElementById('canvas');
		canvas.width = this.canvasBounding.width;
		canvas.height = this.canvasBounding.height;

		this.context = canvas.getContext('2d');
	}
	BlurCanvas.prototype = {
		constructor : BlurCanvas,
		init : function(){
			this.drawArcImage()
		},
		drawArcImage : function(){
			//console.log(this.canvasBounding);
			
			this.context.clearRect(0, 0, this.canvasBounding.width, this.canvasBounding.height);
			this.context.save();
			this.clipArc();

			this.context.drawImage(this.canvasBounding.image, 0, document.documentElement.clientHeight * 0.15, this.canvasBounding.width, this.canvasBounding.height, 0, 0, this.canvasBounding.width, this.canvasBounding.height);
			this.context.restore();
		},
		clipArc : function(){
			//console.log(this.arcPosition);
			this.context.beginPath();
			this.context.arc(this.arcPosition.x, this.arcPosition.y, this.arcPosition.r, 0, 2 * Math.PI, true);
			this.context.closePath();
			this.context.clip();
		},
		showAnimate : function(){
			ifShow = true;
			this.drawArcImage();
			if (this.arcPosition.r <= 2000) {
				this.arcPosition.r += 2;
				window.requestAnimationFrame(this.showAnimate.bind(blurCanvas));
			}
		}
	}

	var startCanvas = function(){
		var windowBounding = {
			width : document.body.clientWidth,
			height : document.body.clientHeight
		};
		for(var name in windowBounding){
			needBounding.canvasBounding[name] = windowBounding[name];
		}

		var image = new Image();
		image.src = '../XiAn/img/ok.jpg';
		needBounding.canvasBounding.image = image;
		image.onload = function(){
			blurCanvas = new BlurCanvas(needBounding);
			blurCanvas.init();
		}

		var canvasButtonBox = document.getElementById('canvasButtonBox');
		canvasButtonBox.addEventListener('click', clickFuns.clickBoxHandle.bind(clickFuns), false);
	}
// -----------------------
	function SlideClick(){
		this.distanceSlide = 0;
		this.clientHeight = document.documentElement.clientHeight;
		this.clientWidth = document.documentElement.clientWidth;
		// console.log(this.clientWidth);
		// console.log(this.clientHeight);
	};
	SlideClick.getOffsetTop = function(element){
		var scrollTop = 0;
		while(element){
			scrollTop += element.offsetTop;
			element = element.offsetParent;
		}
		return scrollTop;		
	}
	SlideClick.prototype = {
		whiteButtonClickhandle : function (event){
			var event = event || window.event;
			var target = event.target || event.srcElement;
			this.getSlidePosition(target.id);
		},
		getSlidePosition : function (whichButton){
			switch(whichButton){
				case 'header_button':
						if(!this.getSlidePosition.container)
							this.getSlidePosition.container = document.getElementById('container');
						var scrollTop = SlideClick.getOffsetTop(this.getSlidePosition.container);
						if (this.clientWidth < 960) {
							this.distanceSlide = scrollTop / 2;
						}
						else{
							this.distanceSlide = this.clientHeight * 0.8;
						}
						break;
				case 'green_button':
						if(!this.getSlidePosition.textOne)
							this.getSlidePosition.textOne = document.getElementById('f1');
						var scrollTop = SlideClick.getOffsetTop(this.getSlidePosition.textOne);
						if (this.clientWidth < 960){
							this.distanceSlide = (scrollTop / 5) * 4;
						}
						else{
							this.distanceSlide = this.clientWidth * 0.8;
						}
						break;
				default: break;return;
			}
			this.slideAnimate();
		},
		slideAnimate : function(){
			if (this.isChrome())
				var docSrc = $(document.body);				
			else
				var docSrc = $(document.documentElement);
			docSrc.animate({
				scrollTop : this.distanceSlide + 'px'
			});
		},
		isChrome : function(){
			var ua = navigator.userAgent.toLowerCase();
			try{
				var ifChrome = ua.match(/(webkit)[ \/]([\w.]+)/)[1];
			}
			catch(e){
				return false;
			}
			return ifChrome;
		}
	}

	var winWidth = null;
	var scrollListen = {
		elesPos : {
			f1 : null,
			f2 : null,
			text1 : null,
			green_block : null,
			spots_text : null
		},
		scrollHandle : function (event){
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop > this.elesPos.f1) {
				if (winWidth > 960)
					$('#text1').css({
						'-webkit-transform' : 'rotateY(0deg)',
						'transform' : 'rotateY(0deg)'
					});					
				else
					$('#text1').css({
						'-webkit-transform' : 'rotateX(0deg)',
						'transform' : 'rotateX(0deg)'
					});
			}
			if (scrollTop > (this.elesPos.text1 + 250) || scrollTop < (this.elesPos.green_block - 100)) {
				if (winWidth > 960)
					$('#text1').css({
						'-webkit-transform' : 'rotateY(90deg)',
						'transform' : 'rotateY(90deg)'
					});		
				else
					$('#text1').css({
						'-webkit-transform' : 'rotateX(65deg)',
						'transform' : 'rotateX(65deg)'
					});
			}
			if (scrollTop > this.elesPos.text1) {
				if (winWidth > 960){
					$('#f2').css('right' , '-50%');
					$('#text2').css('left' , '-50%');					
				}
				else{
					$('#f2').css('right' , '0');
					$('#text2').css('left' , '0');					
				}
			}
			if(scrollTop > this.elesPos.spots_text || scrollTop < this.elesPos.green_block) {
				$('#f2').css('right' , '100%');
				$('#text2').css('left' , '100%');
				$('.spot_img').css('opacity', 1);
			}
			if (scrollTop > this.elesPos.f2) {
				$('#spots_text').find('div').css('opacity', 1).end().find('p').css('opacity',1);
			}
		},
		setElesPos : function(){
			for(var idName in this.elesPos){
				var posEle = document.getElementById(idName);
				if (idName == 'f1') 
					this.elesPos[idName] = (SlideClick.getOffsetTop(posEle) / 5) * 3;
				else
					this.elesPos[idName] = SlideClick.getOffsetTop(posEle);
			}
			console.log(this.elesPos);
		}
	}

	var picClick = {
		spotsName : ['回民街', '钟楼', '半坡遗址', '西安城墙', '秦始皇兵马俑', '夜西安', '大雁塔', '碑林'],
		nowPic : 0,
		picBoxClickhandle : function(event){
			if (!this.picBoxClickhandle.shadow) {
				this.picBoxClickhandle.shadow = document.getElementById('shadow');
			}
			this.picBoxClickhandle.shadow.style.display = 'block';

			var event = event || window.event;
			var target = event.target || event.srcElement;
			var whichPic = target.getAttribute('name');
			this.animatePic(whichPic);
		},
		animatePic : function(whichPic){
			var perPic = document.getElementsByName('pic_' + this.nowPic)[0];
			var clickPic = document.getElementsByName(whichPic)[0];
			var shadow_text = document.getElementById('shadow_text');
			this.nowPic = whichPic.substr(4,1);
			this.shadow_text.innerHTML = this.spotsName[Math.floor(this.nowPic) - 1];
			perPic.style.opacity = '0';
			clickPic.style.opacity = '1';
		},
		shadowPicClick : function(event){
			var shadow_text = document.getElementById('shadow_text');
			var perPic = document.getElementsByName('pic_' + this.nowPic)[0];
			if (this.nowPic == 8)
				this.nowPic = 1;
			else
				this.nowPic++;
			this.shadow_text.innerHTML = this.spotsName[Math.floor(this.nowPic) - 1];
			var nowPic = document.getElementsByName('pic_' + this.nowPic)[0];
			perPic.style.opacity = '0';
			nowPic.style.opacity = '1';		
		},
		closeShadow : function(event){
			var event = event || window.event;
			var target = event.target || event.srcElement;
			if (target.id == 'shadow') {
				this.picBoxClickhandle.shadow.style.display = 'none';
			}
		}
	}

	var pageStart = {
		setBackgroudPositon : function(){
			var clientHeight = document.documentElement.clientHeight;
			var posY = clientHeight * 0.15 * -1;
			var header_img = document.getElementById('header_img');
			var posStr = '0px ';
			posStr = posStr + posY + 'px';
			console.log(posStr);
			header_img.style.backgroundPosition = posStr;			
		},
		init : function(){
			picClick.shadow_text = document.getElementById('shadow_text');

			scrollListen.setElesPos();
			var slide = new SlideClick();
			$('.whiteButton').bind('click', slide.whiteButtonClickhandle.bind(slide));
			document.addEventListener('scroll', scrollListen.scrollHandle.bind(scrollListen), false);
			winWidth = document.body.clientWidth;
			if(winWidth > 640){
				startCanvas();
				this.setBackgroudPositon();
				var spotsBox = document.getElementById('spotsBox');
				var shadow_picBox = document.getElementById('shadow_picBox');
				var shadow = document.getElementById('shadow');
				spotsBox.addEventListener('click', picClick.picBoxClickhandle.bind(picClick), false);
				shadow_picBox.addEventListener('click', picClick.shadowPicClick.bind(picClick), false);
				shadow.addEventListener('click', picClick.closeShadow.bind(picClick), false);
			}			
		}
	}

	window.onload = function(){
		pageStart.init();
	}
})();