(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$(".toggle-password").click(function() {

	  $(this).toggleClass("fa-eye fa-eye-slash");
	  var input = $($(this).attr("toggle"));
	  if (input.attr("type") == "password") {
	    input.attr("type", "text");
	  } else {
	    input.attr("type", "password");
	  }
	});

})(jQuery);

function handle(){
	alert("Hello");
}
let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

scanner.addListener('scan', function(content) {
	alert(content);
});

Instascan.Camera.getCameras().then(function(cameras) {
	if (cameras.length > 0) {
		scanner.start(cameras[0]);
	} else {
		console.error('No cameras found.');
	}
}).catch(function(e) {
	console.error(e);
});