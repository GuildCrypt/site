// Developed by Kai Micah Mills (https://www.upwork.com/fl/kaimicahmills)

$(document).ready(function() {

    // Prevent image dragging

	$("img").on("dragstart", function(event) {

        event.preventDefault();

	});

	// Rotate background image

	$(".splash").css("background", "url(/assets/media/images/hero-image-1.jpg) no-repeat center center");
	$(".splash").css("background-size", "cover");

	window.backgroundImage = 1;

	window.setInterval(function() {

		if(window.backgroundImage === 1) {

			$(".splash").css("background", "url(/assets/media/images/hero-image-2.jpg) no-repeat center center");
			$(".splash").css("background-size", "cover");
			window.backgroundImage = 2;

		} else if(window.backgroundImage === 2) {

			$(".splash").css("background", "url(/assets/media/images/hero-image-3.jpg) no-repeat center center");
			$(".splash").css("background-size", "cover");
			window.backgroundImage = 3;

		} else if(window.backgroundImage === 3) {

			$(".splash").css("background", "url(/assets/media/images/hero-image-1.jpg) no-repeat center center");
			$(".splash").css("background-size", "cover");
			window.backgroundImage = 1;

		}

	}, 5000);

	// Scroll down arrow

	$("i.scroll-down").click(function() {
		window.scrollTo({
			top: window.innerHeight + 1,
			behavior: 'smooth'
		})
	});

	// Change flow chart

	$(".section.flow a.button").click(function() {

		$(".section.flow a.button").removeClass("active");
		$(this).addClass("active");
		$(".flow-chart").hide();

		if($(this).is(":nth-of-type(1)")) {

			$(".flow-chart.one").show();

		} else if($(this).is(":nth-of-type(2)")) {

			$(".flow-chart.two").show();

		} else if($(this).is(":nth-of-type(3)")) {

			$(".flow-chart.three").show();

		}

	});

	// Search

	$("input.search").keypress(function() {

		$(".section.browse .row.upper-row").hide();
		$('.section.browse h3.title:contains(" '+ $(this).val() +'")').closest(".upper-row").show();

	});

	// Mobile menu

	window.mobileShown = false;

	$(".mobile-menu").click(function() {

		if(window.mobileShown === false) {

			$(".links").addClass("shown");
			window.mobileShown = true;

		} else if(window.mobileShown === true) {

			$(".links").removeClass("shown");
			window.mobileShown = false;

		}

	});

});
