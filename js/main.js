$(document).ready(function(){
	//init
	var JC = {};
	var count = 0;
	JC.swiper = null;
	JC.gender = "";
	JC.getAward = false;
	JC.resultContent = [{'type':'calculative','title':'社交心机党','content':'冷眼旁观种种奇葩,无言以对各路槽点囧事,想靠装腔social红出一片天？,腻害了你！'},
						{'type':'warmUp','title':'天生暖场王','content':'秒懂各路梗,深解内涵图,随口解救种种冷场危机！'},
						{'type':'babyBicao', 'title':'壁草宝宝','content':'不想怒刷存在感,就在一边安安静静,做个萌宝吧！'},
						{'type':'topicMaker','title':'话题制燥者','content':'上知票房毒药神演技,下知麻豆爱豆八卦史,叨逼叨是天性,分分钟撩人没鸭梨！'}];
	
	JC.img = {'startWrap':['img/vicent-pop.png','img/vicent-lips.png','img/vicent-eyes.png','img/vicent-head.png'],
			   'quizWrap':['img/quiz-bg.jpg','img/title-bg.png','img/icon.png'],
			   'resultWrap':['img/result-bg.jpg','img/award-bg.png','img/share-bg.png']};

	//get user's openid at the begining
	getOpenId();
	preLoadImg(JC.img.startWrap);
	/*
		at startWrap click on yes button
		setup those animations' timeline
	*/
	$(".startWrap .ageWrap .ageBtn").bind('click',function(){
		if($(this).hasClass("yesBtn")){
			$(".startWrap .ageWrap").fadeOut();
			$(".startWrap .swipeWrap").fadeIn();
			/*load background image for quizWrap*/
			
			preLoadImg(JC.img.quizWrap);
			$(".quizWrap .bgWrap").addClass('loaded');
			if($(".swipeWrap").is(":visible")){
				setTimeout(function(){
					$(".swipeWrap .vicent-pop").addClass("animated");
					$(".swipeWrap .vicent").addClass("animated");
				},1000);
				setTimeout(function(){
					$(".swipeWrap .vicent-pop").hide().removeClass(".animated");
					$(".swipeWrap .swipePrompt").addClass("animated");
					/*load background image for quizWrap*/
					var ele = document.getElementById('swipeWrap');
					detectSwipe(ele,60,switchToQuestion);

				},4900);		
			}	
		}else{
			// noBtn
			return;
		}
	});

	//click events for answering question
	$(".quizWrap .swiper-slide .answerWrap").bind('click',function(){
		var currentQuiz = $(this).parent('.swiper-slide').attr('data-quiz'),
			currentAnswer = $(this).attr('data-an'),
			currentWrap = $(this);

		
		//for single answer quiz
		if(currentQuiz !== '6' && currentQuiz !== '8'){
			if(currentQuiz === '7'){
				gernerateResult(currentAnswer);
			}
			console.log("currentQuiz "+currentQuiz);
			console.log("currentAnswer " + currentAnswer);
			JC.swiper.slideNext();
			uploadAnswer(currentQuiz, currentAnswer);	
		}else if(currentQuiz === '6'){
			var firstAnswer =  currentAnswer;
			if(count !== 2){
				if(currentWrap.hasClass('checked')){
					alert('这个选项已被选择');
					return;
				}else{
					console.log("currentQuiz "+currentQuiz);
					console.log("currentAnswer " + currentAnswer);
					count ++;
				}
			}
			if(count === 2){
				JC.swiper.slideNext();
				var answer = firstAnswer+'|'+currentAnswer;
				console.log('answer'+ answer);
				uploadAnswer(currentQuiz, answer);	
			}
		}else if(currentQuiz === '8'){
			console.log("currentQuiz "+currentQuiz);
			console.log("currentAnswer " + currentAnswer);
			uploadAnswer(currentQuiz, currentAnswer);	
			$('.quizWrap').fadeOut();
			$('.resultWrap').show();
			showResultWrap();
		}
		currentWrap.addClass('checked');
	});


	function showResultWrap(){
		setTimeout(function(){
			$('.resultWrap').addClass('animated');
			setTimeout(function(){
				$('.resultWrap').addClass('completed');
				setTimeout(function(){
					$('.resultWrap .result').show();
					
				},2000);
			},4200);
		},1000);

		//award clostBtn
		$('.resultWrap .awardWrap .closeBtn').bind('click',function(){
			$('.resultWrap .awardWrap').fadeOut();
			if(!$('.resultWrap .result').is(':visible')){
				$('.resultWrap .result').fadeIn();
			}
		});

		//get giftBtn show info inputs
		$('.resultWrap .result .giftBtn').bind('click',function(){
			$('.resultWrap .result').hide();
			$('.resultWrap .awardWrap').fadeIn();
		});

		//phone input
		$('.resultWrap .awardWrap .info input.limited').keypress(function(e){
			var maxlength = $(this).attr('data-maxlength');
			var len = $(this).val().length;
			if(len == maxlength){
				e.preventDefault();
			}else if(len > maxlength){
				var s = $(this).val().substring(0,maxlength);
				$(this).val(s);
			}
		});

		$('.resultWrap .awardWrap .info .getCodeBtn').bind('click',function(e){
			var phoneNumber = $('.resultWrap .awardWrap .info #phone').val();
			if(phoneNumber.length == 0){
				alert('请先输入手机号');
				return;
			}else if(!isValidPhone(phoneNumber)){
				alert('请输入正确的手机号');
				return;
			}else if(isValidPhone(phoneNumber)){
				getVertifyCode(phoneNumber);
			}
		});

		$('.resultWrap .awardWrap .info .submitBtn').bind('click',function(e){

			var phoneNumber = $('.resultWrap .awardWrap .info #phone').val(),
				code = $('.resultWrap .awardWrap .info #code').val(),
				username =  $('.resultWrap .awardWrap .info #fullname').val();
			if(!phoneNumber.length){
				alert('请先输入手机号');
				return;
			}else if(!isValidPhone(phoneNumber)){
				alert('请输入正确的手机号');
				return;
			}else if(code.length != 4){
				alert('请输入4位验证码');
				return;
			}else if(isValidPhone(phoneNumber) && code.length == 4){
				submitInfo(phoneNumber,code);
			}
		});

		$('.resultWrap .awardWrap .award .submitBtn').bind('click',function(e){

			var add = $('.resultWrap .awardWrap .award #add').val();
			if(!add.length){
				alert('请输入您的地址');
			}else{
				uploadAddress(add);
			}	
		});

		$('.resultWrap .awardWrap .tryBtn').bind('click',function(e){
			$('.resultWrap .awardWrap').hide();
			$('.resultWrap .shareWrap').fadeIn();
		});

		$('.resultWrap .shareWrap').bind('click',function(e){
			$('.resultWrap .shareWrap').hide();
			$('.resultWrap .awardWrap').fadeIn();
		});
	}

	//callback function after detectSwipe and get the gender based on direction
	function switchToQuestion(dir){
		$(".quizWrap").addClass("show");
		//init swiper when quizWrap shows
		JC.swiper = new Swiper('.swiper-container',
		{
			noSwiping : true,
			noSwipingClass : 'stop-swiping',	
			onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
    			swiperAnimateCache(swiper); //隐藏动画元素 
    			swiperAnimate(swiper); //初始化完成开始动画

    		}, 
  			onSlideChangeEnd: function(swiper){ 
    			swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
  			}
  		});
		if(dir === "left"){
			JC.gender = "male";
			$(".quizWrap").find(".quiz-8").addClass('male');
		}else if(dir === "right"){
			JC.gender = "female";
			$(".quizWrap").find(".quiz-8").addClass('female');
		}
		$(".startWrap").fadeOut();
		/*load background image for resultWrap*/
		// $(".resultWrap").addClass('loaded');
		preLoadImg(JC.img.resultWrap);
	}


	//generate result and fill in h2 and paragraph
	function gernerateResult(answer){
		var index = parseInt(answer)-1;
		var title = JC.resultContent[index].title,
			content = JC.resultContent[index].content.split(','),
			type = JC.resultContent[index].type;

		var s = '';
		for(var i = 0;i<content.length;i++){
			s += content[i];
			s += '<br>';
		}
		$('.resultWrap .result').addClass(type);
		preLoadImg(['img/'+type+'.png']);
		$('.resultWrap .result .content').find('h2').html(title);
		$('.resultWrap .result .content').find('p').html(s);
	}

	//detect swipe direction on selected element
	function detectSwipe(ele,dis,func){
		if(!ele){ele = document;}
		ele.addEventListener('touchstart', handleTouchStart, false); 
		ele.addEventListener('touchmove', handleTouchMove, false);
		ele.addEventListener('touchend', handleTouchEnd, false);

		var xStart = null, 	
			yStart = null,
			xEnd = null,
    		yEnd = null,
	    	xDiff = 0,
	    	yDiff = 0;

		var dir = "";
		var touchMoved = false;
		var diff = dis || 60;

		function handleTouchStart(e){                                         
			xStart = e.touches[0].clientX;                                      
			yStart = e.touches[0].clientY;                                      
		};                                                
		function handleTouchMove(e){
			e.preventDefault();
			xEnd = e.touches[0].clientX,                                  
			yEnd = e.touches[0].clientY;
			//the click event will be called with touchstart and touchend, we need to detect whether the touch has moved
			touchMoved = true;
		}

		function handleTouchEnd(e){
			if(touchMoved == false){
				return;
			}
			xDiff = xStart - xEnd,
			yDiff = yStart - yEnd;

			if (Math.abs(xDiff) > Math.abs(yDiff) ) {/*most significant*/
				if(xDiff > 0 && xDiff > diff) {
   					dir = "left";
				}else if(xDiff < 0 && Math.abs(xDiff) > diff){
    				dir = "right";
				}else{
					return;
				}                       
			}else{
				if(yDiff > 0 && yDiff > diff) {
    				dir = "up";
				}else if(yDiff < 0 && Math.abs(yDiff) > diff){ 
  	  				dir = "down";
        		}else{
        			return;
        		}
			}

			if(dir !== ""){
				if(typeof func === 'function'){
					func(dir);
				}
			}
			xStart = null;
			yStart = null;
			xEnd = null;
			yEnd = null;  
			touchMoved = false;                                           
		};
	}

	function uploadAnswer(quiz,answer){
		$.ajax({
        	type: 'POST',
        	url: 'api/index.php',
        	dataType: 'json',
        	cache: false,
        	data:{
        		'action':'add_question',
        		'question_no': quiz,
        		'answer': answer,
        		'utm_source': '',
				'utm_medium': ''
        	},
        	success:function(result){
        		if(result == 1){
        			console.log('upload answer successfully');
        		}else if(result === 100){
        			console.log('activity is timeout');
        		}else if(result == 0){
        			console.log('upload answer failed');
        		}
        	}
        });
	}

	function isValidPhone(number){
		var pattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
        if(pattern.test(number)) { 
            return true; 
        }else{ 
            return false; 
        } 
	}

	function getVertifyCode(phoneNumber){
		$.ajax({
			type: 'POST',
        	url: 'api/index.php',
        	dataType: 'json',
        	cache: false,
        	data:{
        		'action':'captcha',
        		'mobile': phoneNumber,
        		'utm_source': '',
				'utm_medium': ''
        	},
        	success:function(result){
        		if(result == 1){
        			alert('验证码已发送,请注意查收短信');
        		}else if(result == 0){
        			alert('抱歉，验证码发送失败');
        		}else if(result == 100){
        			alert('该活动已过期');
        		}
        	}
		});
	}

	function submitInfo(username,phoneNumber, code){
		$.ajax({
			type: 'POST',
        	url: 'api/index.php',
        	dataType: 'json',
        	cache: false,
        	data:{
        		'action':'add_campaign',
        		'mobile': phoneNumber,
        		'user_name': username,
        		'captcha': code,
        		'utm_source': '',
				'utm_medium': ''
        	},
        	success:function(result){
        		if(result == 1){
        			//中奖
        			JC.getAward = true;
        			$('.resultWrap .awardWrap  .info').hide();
        			$('.resultWrap .awardWrap  .award').fadeIn();
        		}else if(result == 0){
        			//未中奖
        			$('.resultWrap .awardWrap .info').hide();
        			$('.resultWrap .awardWrap  .noAward').fadeIn();
        		}else if(result == 4){
        			//验证码错误
        			alert('验证码错误');
        			return;
        		}else if(result == 100){
        			//不在活动期内
        			alert('该活动已过期');
        			return;
        		}
        	}
		});
	}

	function uploadAddress(address){
		$.ajax({
			type: 'POST',
        	url: 'api/index.php',
        	dataType: 'json',
        	cache: false,
        	data:{
        		'action':'update_user',
        		'user_address': address,
        		'utm_source': '',
				'utm_medium': ''
        	},
        	success:function(result){
        		if(result == 1){
        			//更新成功
        			$('.resultWrap .awardWrap .award').hide();
        			$('.resultWrap .awardWrap .infoCompleted').fadeIn();
        		}else if(result == 0){
        			//更新失败
        			$('.resultWrap .awardWrap .award').hide();
        			$('.resultWrap .awardWrap .infoinfoCompleted').fadeIn();
        		}else if(result == 100){
        			alert('该活动已过期');
        			return;
        		}
        	}
		});
	}

	function getOpenId(){
		var currentURL = window.location.href;
		var ajaxURL = 'http://jc.pernod-ricard-china.com/wc/skip.php?type=base&reurl=' + encodeURIComponent(currentURL);
		$.ajax({
			type: 'GET',
        	url: ajaxURL,
        	dataType: 'json',
        	cache: false,
        	success:function(data){
        		console.log(data);
        		if(data.openid){
        			console.log('openid: ' +data.openid);
        			JC.openid = data.openid;
        			$.ajax({
        				type: 'POST',
        				url: 'api/index.php',
        				dataType: 'json',
        				cache: false,
        				data:{
        					action:'add_user',
        					openid: data.openid,
        					utm_source: '',
        					utm_medium: ''
        				},
        				success:function(result){
        					if(result == 1){
        						console.log('upload openid succssfully');
        					}else if(result == 0){
        						console.log('upload openid failed');
        					}else if(result == 100){
        						console.log('activity timeouted');
        					}
        				}
        			});
        		}
        	}
		})
	}

	function preLoadImg(arr){
		for(var i = 0;i<arr.length;i++){
			var img = new Image();
			img.src = arr[i];
		}
	}
});