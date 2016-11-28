var currentUrl = window.location.href;

var shareData = {
    title: "用Rocher好好说谢谢",
    desc: "有一份感恩，在这里等你",
    imgUrl: "http://thanksgiving.ferrero-rocher.com.cn/image/shareImg.jpg",
    link: currentUrl
};

window.setTimeout(function(){
    $.ajax({
        type: 'GET',
        url: 'api/index.php',
        dataType: 'json',
        cache: false,
        success: function(data){
        	console.log(data);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage', 'onMenuShareQQ','onMenuShareWeibo','previewImage','downloadImage','chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function(){
        		wx.onMenuShareTimeline({
            		title:shareData.title, // 分享标题
            		link: shareData.link, // 分享链接
            		imgUrl: shareData.imgUrl, // 分享图标
            		success: function () {},
            		cancel: function () {}
        		});
        		//分享发给朋友
        		wx.onMenuShareAppMessage({
            		title:shareData.title, // 分享标题
            		desc: shareData.desc, // 分享描述
            		link: shareData.link, // 分享链接
            		imgUrl: shareData.imgUrl, // 分享图标
            		type: '', // 分享类型,music、video或link，不填默认为link
            		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            		success: function () {},
            		cancel: function () {}
        		});
        		//分享发给qq
        		wx.onMenuShareQQ({
            		title:shareData.title, // 分享标题
            		desc: shareData.desc, // 分享描述
            		link: shareData.link, // 分享链接
            		imgUrl: shareData.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {},
            cancel: function () {}
        });
        //分享发给微博
        wx.onMenuShareWeibo({
            title:shareData.title, // 分享标题
            desc: shareData.desc, // 分享描述
            link: shareData.link, // 分享链接
            imgUrl: shareData.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {},
            cancel: function () {}
        });
    });
    wx.error(function(res){});
    }
    });
},2000);

    
