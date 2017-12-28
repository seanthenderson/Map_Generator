//======================================
// Vue data
//======================================
function defaultMarkerData() {
    return {
        locationName: '',
    		latitude: '',
    		longitude: '',
    		locationDescription: '',
    		locationImage: '',
    		locationLink: ''
    }
}

new Vue({
	el: '#mapSettings',
	data: {
		zoomLevel: '2',
		centerLat: '40',
		centerLong: '-70',
		mapWidth: '',
		mapHeight: '',
	},
	
	el: '#root',
	data: defaultMarkerData(),
	methods: {
		reset ( keep ) {
      var def = defaultMarkerData();
      def[keep] = this[keep];
      Object.assign(this.$data, def);
    }
	}
})

//======================================
// Map initialization functions
//======================================
var map;

function initMap(map) {

    // Initialize map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.712775, lng: -74.005973},
        zoom: 2,
    });
	
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});

	// Map settings
	function changeMap() {
		var zoom = document.getElementById('zoomLevel').value;
		zoom = parseInt(zoom);
		var latitude = document.getElementById('centerLat').value;
		latitude = parseInt(latitude);
		var longitude = document.getElementById('centerLong').value;
		longitude = parseInt(longitude);

		map.setCenter(new google.maps.LatLng(latitude, longitude));
		map.setZoom(zoom);

        google.maps.event.trigger(map, 'resize');
	}	

	// Alter map when settings are changed
	$('#zoomLevel, #centerLat, #centerLong').on('input', function() {
		if ($('#zoomLevel').val().length && $('#centerLat').val().length && $('#centerLong').val().length) {
			changeMap();
		}
	});

	// Add new marker
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;

	function addMarker() {
		var latitude = document.getElementById('latitude').value;
		latitude = parseInt(latitude);
		var longitude = document.getElementById('longitude').value;
		longitude = parseInt(longitude);
		var locationName = document.getElementById('locationName').value;
		
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(latitude, longitude),
			label: locationName,
			map: map,
		});
	}

	$('#addMarkerButton').click(function() {
		addMarker();
		$('form#addMarker input').each(function() {
			$(this).val('');
		});
		$('form#addMarker textarea').val('');
	});

	// Add map marker arrays
    var locations = [];

    $('.menu-section').each(function() {
        $(this).children('.thumbnail').each(function() {
            x = 0;
            var info = [$(this).children('p'), $(this).attr('data-lat'), $(this).attr('data-long'), x+1];
            locations.push(info);
            x++;
        });    
    });

    var marker, i;
    var markers = [];
    var redMarker = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    var blueMarker = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

    // Add markers to map 
    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            icon: redMarker,
            map: map,
            zIndex: 999,
            id: i
        });

        // Switch icon on marker mouseover and mouseout
        $('.thumbnail').mouseenter(function() {
            var num = $('.thumbnail').index(this);
            markers[num].setIcon(blueMarker);
        });
        $('.thumbnail').mouseleave(function() {
            var num = $('.thumbnail').index(this); 
            markers[num].setIcon(redMarker);
        });

        // Show infowindow on marker click
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                var markerNum = marker.id+2;
                $('.infowindow:nth-of-type(' + markerNum + ')').fadeIn();
            }
        })(marker, i));

        markers.push(marker);
    }

    // Only show first theme on page load
    var theme1 = $('.menu-section').eq(0).children('.thumbnail').length;

    for (x = 0; x <= markers.length-1; x++) {
        if (x < theme1) {
            markers[x].setVisible(true);
        } else {markers[x].setVisible(false)}
    }

    // Hide/show marker group on menu theme click
    $('.menu-section-header').click(function() {
        var themeNum = $('.menu-section-header').index(this);
        var theme1 = $('.menu-section').eq(0).children('.thumbnail').length;
        var theme2 = $('.menu-section').eq(1).children('.thumbnail').length;
        var theme3 = $('.menu-section').eq(2).children('.thumbnail').length;
        var theme4 = $('.menu-section').eq(3).children('.thumbnail').length;
        var theme5 = $('.menu-section').eq(3).children('.thumbnail').length;

        if (themeNum == 0) {
            for (x = 0; x <= markers.length-1; x++) {
                if (x < theme1) {
                    markers[x].setVisible(true);
                } else {markers[x].setVisible(false)}
            }
        } else if (themeNum == 1) {
            for (x = 0; x < markers.length-1; x++) {
                if (x > theme1-1 && x <= (theme1+theme2-1)) {
                      markers[x].setVisible(true);
                } else {markers[x].setVisible(false)}
            }
        } else if (themeNum == 2) {
            for (x = 0; x <= markers.length-1; x++) {
                if (x > (theme1+theme2-1) && x <= (theme1+theme2+theme3-1)) {
                     markers[x].setVisible(true);
                } else {markers[x].setVisible(false)}
           }
        } else if (themeNum == 3) {
            for (x = 0; x <= markers.length-1; x++) {
                if (x > (theme1+theme2+theme3-1) && x <= (theme1+theme2+theme3+theme4-1)) {
                      markers[x].setVisible(true);
                } else {markers[x].setVisible(false)}
            }
        } else if (themeNum == 4) {
            for (x = 0; x <= markers.length-1; x++) {
                if (x >= (theme1+theme2+theme3+theme4-1)) {
                      markers[x].setVisible(true);
                } else {markers[x].setVisible(false)}
            }
        }
    });

	google.maps.event.trigger(map, "resize");
		
}

//=======================================================
// Show/hide form section
//=======================================================
var settingsHeight= $('form#mapSettings').outerHeight();
var addMarkerHeight= $('form#addMarker').outerHeight();
var getCodeHeight= $('#getCode').outerHeight();
var settingsCount = 0;
var addMarkerCount = 0;
var getCodeCount = 0;

$('form, #getCode').height(50);

$('form#mapSettings h2').on('click', function() {
	if (settingsCount%2===0) {
		$(this).parent().animate({'height': settingsHeight});
		$(this).children('.fa').removeClass('fa-plus-circle').addClass('fa-minus-circle');
	} else {
		$(this).parent().animate({'height': 50});
		$(this).children('.fa').removeClass('fa-minus-circle').addClass('fa-plus-circle');
	}
	settingsCount++;
});

$('form#addMarker h2').on('click', function() {
	if (addMarkerCount%2===0) {
		$(this).parent().animate({'height': addMarkerHeight});
		$(this).children('.fa').removeClass('fa-plus-circle').addClass('fa-minus-circle');
	} else {
		$(this).parent().animate({'height': 50});
		$(this).children('.fa').removeClass('fa-minus-circle').addClass('fa-plus-circle');
	}
	addMarkerCount++;
});

$('#getCode h2').on('click', function() {
	if (getCodeCount%2===0) {
		$(this).parent().animate({'height': getCodeHeight});
		$(this).children('.fa').removeClass('fa-plus-circle').addClass('fa-minus-circle');
	} else {
		$(this).parent().animate({'height': 50});
		$(this).children('.fa').removeClass('fa-minus-circle').addClass('fa-plus-circle');
	}
	getCodeCount++;
});

//=======================================================
// Map functionality
//=======================================================
$(document).ready(function() {
    var mobileBreakpoint = 700;

    // Show/hide menu sections
    var sectionHeight = $('.menu-section').height();
    $('.menu-section').height(0);

    $('.menu-section.first').height(sectionHeight+10);

    $('.menu-section-header').click(function() {
        $('.menu-section').animate({'height': '0'}, 400);
        if ($(this).next('.menu-section').outerHeight() == 0) {
            $(this).next('.menu-section').animate({'height': sectionHeight});
        }
    });

    // Set map height equal to menu height
    if ($(window).width() > mobileBreakpoint) {
        $('#map-wrapper, #map-menu').height($('#map-menu').outerHeight() - 4);
    }
     
    // Create an infowindow for each location
    $('.menu-section .thumbnail').each(function() {
        var locationName = $(this).children('p').text();
        var locationImg = $(this).css('background-image');
        locationImg = locationImg.replace('url(','').replace(')','').replace(/\"/gi, "");
        var locationDesc = $(this).children('.description').html();
        
        $('<div class="infowindow"><i class="fa fa-times" aria-hidden="true"></i><img src="' + locationImg + '"/><h2>' + locationName + '</h2>' + locationDesc + '</div>').insertBefore('#map');
    });

    // Set infowindow height
    var mapHeight = $('#map-wrapper').outerHeight();

    // Show infowindow on thumbnail click
    $('.thumbnail').click(function() {
        var thumbNum = $('.thumbnail').index(this); 
        if ($(window).width() > 700) {
            var thumbNum = thumbNum+2;
        } else {var thumbNum = thumbNum+1;}
        $('.infowindow:nth-of-type(' + thumbNum + ')').fadeIn();
    });

    // Hide infowindow on x click
    $('.infowindow .fa-times').click(function() {
        $('.infowindow').fadeOut();
    });
    $('.infowindow').click(function(e) {
        e.stopPropagation();
    });
    
    
    // Move menu below map on mobile 
    if ($(window).width() < mobileBreakpoint+1) {
         $('#map-menu').insertAfter('#map');
    }
	
    //=====================================================================
    // Add new thumbnail to map menu and add location info to code textarea
    //=====================================================================
	$('#addMarkerButton').on('click', function() {
		// Add menu thumbnail
		$('#map-menu').prepend(
			`<div class="thumbnail" v-bind:style="${ backgroundImage}: 'url(' + ${locationImage} + ')' }" data-lat="${latitude}" data-long="${longitude}">
				<p>${locationName}</p>
				<div class="description">
						<p>${locationDescription}</p>
						<p><a v-bind:href="${locationLink}">Website</a></p>
				</div>
			</div>`
		);
		
		// Add code to copy code section on add marker button click
		document.getElementById("mapCode").value +=
					'<div class="menu-section-header"></div>' +
						'<div class="menu-section first">' +
							'<div class="thumbnail" style="background-image: url(' + locationImage + ');" data-lat="{{latitude}}" data-long="{{longitude}}">' +
						'<p>' + locationName + '</p>' +
						'<div class="description">' +
								'<p>' + locationDescription + '</p>' +
								'<p><a href="" target="_blank">Website</a></p>' +
						'</div>' +
					'</div>' +
				'</div>';
	});
    
});


