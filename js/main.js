$(document).ready(function(){
	//init
	var JC = {};
	JC.gender = "";

	/*
		at startWrap click on yes button
		setup those animations' timeline
	*/
	$(".startWrap .ageWrap .yesBtn").bind('click',function(){
		$(".startWrap .ageWrap").fadeOut();
		$(".startWrap .swipeWrap").fadeIn();
		if($(".swipeWrap").is(":visible")){
			setTimeout(function(){
				$(".swipeWrap .vicent-pop").addClass("animated");
				$(".swipeWrap .vicent").addClass("animated");
			},1000);
			setTimeout(function(){
				$(".swipeWrap .vicent-pop").hide().removeClass(".animated");
				$(".swipeWrap .swipePrompt").addClass("animated");
				var ele = document.getElementById('swipeWrap');
				detectSwipe(ele,60,switchToQuestion);
			},4900);

			
		}
		
	});

	//click events for answering question
	$(".quizWrap .swiper-slide .answerWrap").bind('click',function(){
		
		var currentQuiz = $(this).parent('swiper-slide').attr('data-quiz');
	});

	//callback function after detectSwipe and get the gender based on direction
	function switchToQuestion(dir){
		$(".quizWrap").addClass("show");
		//init swiper when quizWrap shows
		JC.quizSwiper = new Swiper('.swiper-container',
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
});