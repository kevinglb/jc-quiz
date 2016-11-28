$(document).ready(function(){
	$(".startWrap .ageWrap .yesBtn").bind('click',function(){
		$(".startWrap .ageWrap").fadeOut();
		$(".startWrap .swipeWrap").fadeIn();
	});

	var quizSwiper = new Swiper('.swiper-container',
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

	
});