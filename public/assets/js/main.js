
// ===/==================================================login page=======================================================================
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

})
(jQuery);

// const butt = document.getElementById("logout");

// document.getElementById("logout").addEventListener("click", function(){
// 	// localStorage.removeItem("token");
// 	// window.location.href = "/";
// 	alert("You have been logged out")
// })

// const butt = document.querySelector("#logout");

// butt.addEventListener("click", function(){
// 	// localStorage.removeItem("token");
// 	// window.location.href = "/";
// 	alert("You have been logged out")
// });

// googleid.addEventListener("click", (e) => {
// 	alert("You have been logged out")
// });

// document.getElementById("logout").addEventListener("click", function(){
//     // localStorage.removeItem("token");
//     // window.location.href = "/";
//     alert("logged out")
// })
