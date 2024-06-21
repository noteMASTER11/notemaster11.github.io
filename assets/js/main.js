/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: [null, '480px']
	});

	// Hack: Enable IE flexbox workarounds.
	if (browser.name == 'ie')
		$body.addClass('is-ie');

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Forms.

	// Hack: Activate non-input submits.
	$('form').on('click', '.submit', function (event) {

		// Stop propagation, default.
		event.stopPropagation();
		event.preventDefault();

		// Submit form.
		$(this).parents('form').submit();

	});

	// Sidebar.
	if ($sidebar.length > 0) {

		var $sidebar_a = $sidebar.find('a');

		$sidebar_a
			.addClass('scrolly')
			.on('click', function () {

				var $this = $(this);

				// External link? Bail.
				if ($this.attr('href').charAt(0) != '#')
					return;

				// Deactivate all links.
				$sidebar_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
				$this
					.addClass('active')
					.addClass('active-locked');

			})
			.each(function () {

				var $this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
				if ($section.length < 1)
					return;

				// Scrollex.
				$section.scrollex({
					mode: 'middle',
					top: '-20vh',
					bottom: '-20vh',
					initialize: function () {

						// Deactivate section.
						$section.addClass('inactive');

					},
					enter: function () {

						// Activate section.
						$section.removeClass('inactive');

						// No locked links? Deactivate all links and activate this section's one.
						if ($sidebar_a.filter('.active-locked').length == 0) {

							$sidebar_a.removeClass('active');
							$this.addClass('active');

						}

						// Otherwise, if this section's link is the one that's locked, unlock it.
						else if ($this.hasClass('active-locked'))
							$this.removeClass('active-locked');

					}
				});

			});

	}

	// Scrolly.
	$('.scrolly').scrolly({
		speed: 1000,
		offset: function () {

			// If <=large, >small, and sidebar is present, use its height as the offset.
			if (breakpoints.active('<=large')
				&& !breakpoints.active('<=small')
				&& $sidebar.length > 0)
				return $sidebar.height();

			return 0;

		}
	});

	// Spotlights.
	$('.spotlights > section')
		.scrollex({
			mode: 'middle',
			top: '-10vh',
			bottom: '-10vh',
			initialize: function () {

				$(this).addClass('inactive');

			},
			enter: function () {

				$(this).removeClass('inactive');

			}
		})
		.each(function () {

			var $this = $(this),
				$image = $this.find('.image'),
				$img = $image.find('img'),
				x;

			$image.css('background-image', 'url(' + $img.attr('src') + ')');

			if (x = $img.data('position'))
				$image.css('background-position', x);

			$img.hide();

		});

	$('.features')
		.scrollex({
			mode: 'middle',
			top: '-20vh',
			bottom: '-20vh',
			initialize: function () {

				$(this).addClass('inactive');

			},
			enter: function () {

				$(this).removeClass('inactive');

			}
		});

	$(document).ready(function () {

		function calculateYearsSince(dateString) {
			const startDate = new Date(dateString);
			const currentDate = new Date();
			const years = currentDate.getFullYear() - startDate.getFullYear();

			if (currentDate.getMonth() < startDate.getMonth() ||
				(currentDate.getMonth() === startDate.getMonth() && currentDate.getDate() < startDate.getDate())) {
				years--;
			}

			return years;
		}

		const yearsSince = calculateYearsSince('May 2021');
		$('#yearsSince').text(`(${yearsSince} years)`);
	});

	document.addEventListener('DOMContentLoaded', function () {
		function calculateAge(birthDate) {
			const birthDateObj = new Date(birthDate);
			const currentDate = new Date();

			let age = currentDate.getFullYear() - birthDateObj.getFullYear();

			if (currentDate.getMonth() < birthDateObj.getMonth() ||
				(currentDate.getMonth() === birthDateObj.getMonth() && currentDate.getDate() < birthDateObj.getDate())) {
				age--;
			}

			return age;
		}

		const birthDate = '1995-02-11';

		const ageElement = document.getElementById('age');

		ageElement.textContent = calculateAge(birthDate);
	});

	const experiencePeriods = [
		{ start: new Date('January 2020'), end: new Date('April 2021') },
		{ start: new Date('May 2018'), end: new Date('November 2019') },
		{ yearsSince: 3 }
	];

	function calculateTotalExperience(periods) {
		let totalYears = 0;
		let totalMonths = 0;

		periods.forEach(period => {
			if (period.start && period.end) {
				const diff = period.end.getTime() - period.start.getTime();
				const yearDiff = diff / (1000 * 60 * 60 * 24 * 365.25);
				const monthDiff = yearDiff * 12;

				totalYears += Math.floor(yearDiff);
				totalMonths += Math.round(monthDiff % 12);
			} else if (period.yearsSince) {
				const years = Math.floor(period.yearsSince);
				const months = Math.round((period.yearsSince % 1) * 12);

				totalYears += years;
				totalMonths += months;
			}
		});

		const years = Math.floor(totalYears + totalMonths / 12);
		const months = totalMonths % 12;

		return `${years} years ${months} months`;
	}

	const totalExperienceElement = document.getElementById('total-experience');

	const totalExperience = calculateTotalExperience(experiencePeriods);
	totalExperienceElement.textContent = `${totalExperience}`;

	am4core.ready(function () {
		var chart = am4core.create("chartdiv", am4plugins_wordCloud.WordCloud);
		chart.fontFamily = "system-ui";

		var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
		series.data = [
			{ "tag": "Hiring", "count": 2 },
			{ "tag": "KPI", "count": 4 },
			{ "tag": "Python", "count": 1 },
			{ "tag": "Roadmapping", "count": 4 },
			{ "tag": "Product Vision", "count": 4 },
			{ "tag": "MAU", "count": 4 },
			{ "tag": "Waterfall", "count": 4 },
			{ "tag": "CR", "count": 3 },
			{ "tag": "Documentation", "count": 3 },
			{ "tag": "VSCode", "count": 1 },
			{ "tag": "Strategic Thinking", "count": 3 },
			{ "tag": "Prioritization", "count": 3 },
			{ "tag": "Market Analysis", "count": 3 },
			{ "tag": "Risk Assesment", "count": 3 },
			{ "tag": "Leadership", "count": 2 },
			{ "tag": "Estimation", "count": 2 },
			{ "tag": "PyCharm", "count": 1 },
			{ "tag": "User-Centric Approach", "count": 2 },
			{ "tag": "Agile", "count": 2 },
			{ "tag": "Problem-Solving", "count": 2 },
			{ "tag": "Metrics-driven Approach", "count": 1 },
			{ "tag": "Communication", "count": 1 },
			{ "tag": "JS", "count": 1 },
			{ "tag": "Cross-Functionality", "count": 1 },
			{ "tag": "Scrum", "count": 1 }
		];

		series.dataFields.word = "tag";
		series.dataFields.value = "count";

		series.labels.template.propertyFields.fontWeight = "fontWeight";
		series.labels.template.propertyFields.fill = "color";

		series.labels.template.events.on("inited", function (event) {
			var label = event.target;
			var dataItem = label.dataItem;
			var value = dataItem.value;

			if (value > 1) {
				label.fontWeight = "bold";
			} else {
				label.fontWeight = "normal";
			}
			label.fill = am4core.color("#FFFFFF");
		});

		var hoverState = series.labels.template.states.create("hover");
		hoverState.properties.fill = am4core.color("#FF0000");

		series.minFontSize = 10;
		series.maxFontSize = 50;

		chart.logo.disabled = true;
		chart.disabled = false;
	});

	document.addEventListener('DOMContentLoaded', function () {
		particlesJS('particles-js', {
			"particles": {
				"number": {
					"value": 110,
					"density": {
						"enable": true,
						"value_area": 800
					}
				},
				"color": {
					"value": "#ffffff"
				},
				"shape": {
					"type": "circle",
					"stroke": {
						"width": 0,
						"color": "#000000"
					},
					"polygon": {
						"nb_sides": 4
					},
					"image": {
						"src": "img/github.svg",
						"width": 100,
						"height": 100
					}
				},
				"opacity": {
					"value": 0.6,
					"random": true,
					"anim": {
						"enable": false,
						"speed": 1,
						"opacity_min": 0.1,
						"sync": false
					}
				},
				"size": {
					"value": 3,
					"random": true,
					"anim": {
						"enable": true,
						"speed": 3,
						"size_min": 0.1,
						"sync": false
					}
				},
				"line_linked": {
					"enable": true,
					"distance": 150,
					"color": "#ffffff",
					"opacity": 0.4,
					"width": 1
				},
				"move": {
					"enable": true,
					"speed": 0.8,
					"direction": "none",
					"random": true,
					"straight": false,
					"out_mode": "out",
					"bounce": false,
					"attract": {
						"enable": false,
						"rotateX": 600,
						"rotateY": 1200
					}
				}
			},
			"retina_detect": true
		});
	});

})(jQuery);