$(function(){
	$(window).scroll(function() {
	    if ($(this).scrollTop() < 200) {
	    	console.log("kurang 200")
	        $("#ft").fadeOut();
	    }
	    else {
	    	console.log("lebih 200")
	        $("#ft").fadeIn();
	    }
	});
})