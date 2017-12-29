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
		locationLink: '',
        mapWidth: '68',
        mapHeight: '500',
    }
}

new Vue({
	el: '#mapSettings',
	data: {
		zoomLevel: '2',
		centerLat: '40',
		centerLong: '-70',
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
	
    // Add marker on click
	// google.maps.event.addListener(map, 'click', function(event) {
	// 	addMarker(event.latLng, map);
	// });

	// Map settings
	function changeMap() {
		var zoom = document.getElementById('zoomLevel').value;
		zoom = parseInt(zoom);
        //console.log(zoom);
		var latitude = document.getElementById('centerLat').value;
		latitude = parseInt(latitude);
        //console.log(latitude);
		var longitude = document.getElementById('centerLong').value;
		longitude = parseInt(longitude);
        //console.log(latitude);

		map.setCenter(new google.maps.LatLng(latitude, longitude));
		map.setZoom(zoom);

        //google.maps.event.trigger(map, 'resize');
	}	

	// Alter map when settings are changed
	$('#zoomLevel, #centerLat, #centerLong').on('input', function() {
		if ($('#zoomLevel').val().length && $('#centerLat').val().length && $('#centerLong').val().length) {
			changeMap();
		}
	});

	// Add new marker
    var marker;
    var markerId = 0;
    var markers = [];
    var redMarker = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    var blueMarker = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

	$('#addMarkerButton').on('click', function(marker) {
        var latitude = document.getElementById('latitude').value;
        latitude = parseInt(latitude);
        var longitude = document.getElementById('longitude').value;
        longitude = parseInt(longitude);
        var locationName = document.getElementById('locationName').value;
        var locationImage = document.getElementById('locationImage').value;
        var locationDescription = document.getElementById('locationDescription').value; 
        var locationLink = document.getElementById('locationLink').value;

		// Add a new marker
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            label: locationName,
            map: map,
            id: markerId
        });

        markers.push(marker);

        markerId++;

        // Clear form inputs
		$('form#addMarker input').each(function() {
			$(this).val('');
		});

        // Clear form textarea
		$('form#addMarker textarea').val('');

        // Hide map menu placeholder text
        $('h2#menuPlaceholder').hide();

        // Add menu thumbnail
        $('.menu-section.first').append(
            '<div class="thumbnail"' + 
                'style="background-image: url(\'' + locationImage + '\')"' +
            '>' +
                '<p>' + locationName + '</p>' +
            '</div>'
        );

        // Add infowindow
        $('<div class="infowindow">' +
            '<i class="fa fa-times" aria-hidden="true"></i>' +
            '<img src="' + locationImage + '"/>' +
            '<h2>' + locationName + '</h2>' +
            locationDescription +
            '<p><a href="' + locationLink + '" target="_blank">More Info</a></p>' +
        '</div>').insertBefore('#map');
        
        // Show infowindow on thumbnail click
        $('.thumbnail').on('click', function() {
            var thumbNum = $('.thumbnail').index(this); 
            if ($(window).width() > 700) {
                var thumbNum = thumbNum+2;
            } else {
                var thumbNum = thumbNum+1;
            }
            $('.infowindow:nth-of-type(' + thumbNum + ')').fadeIn();
        });

        // Hide infowindow on x click
        $('.infowindow .fa-times').on('click', function() {
            $('.infowindow').fadeOut();
        });
        $('.infowindow').on('click', function(e) {
            e.stopPropagation();
        });

        // Add code to copy code section on add marker button click
        document.getElementById("mapCode").value +=
            '<div class="menu-section-header"></div>' +
                '<div class="menu-section first">' +
                    '<div class="thumbnail" style="background-image: url(' + locationImage + ');" data-lat="{{latitude}}" data-long="{{longitude}}">' +
                '<p>' + locationName + '</p>' +
                '<div class="description">' +
                        '<p>' + locationDescription + '</p>' +
                        '<p><a href="' + locationLink + '" target="_blank">Website</a></p>' +
                '</div>' +
            '</div>' +
        '</div>';

        // Show infowindow on marker click
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                var markerNum = marker.id+2;
                $('.infowindow:nth-of-type(' + markerNum + ')').fadeIn();
            }
        })(marker));

        // Switch icon on marker mouseover and mouseout
        $('.thumbnail').on('mouseenter', function() {
            var num = $('.thumbnail').index(this);
            markers[num].setIcon(blueMarker);
        });
        $('.thumbnail').on('mouseleave', function() {
            var num = $('.thumbnail').index(this); 
            markers[num].setIcon(redMarker);
        });

	});

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
$(document).ready(function() {
//=======================================================
// Show/hide form section
//=======================================================
    var initialHeight = 35;
    var settingsHeight= $('form#mapSettings').outerHeight();
    var addMarkerHeight= $('form#addMarker').outerHeight();
    var getCodeHeight= $('#getCode').outerHeight();
    var settingsCount = 0;
    var addMarkerCount = 0;
    var getCodeCount = 0;

    $('form, #getCode').height(initialHeight);

    $('form#mapSettings h2').on('click', function() {
    	if (settingsCount%2===0) {
    		$(this).parent().animate({'height': settingsHeight});
    		$(this).children('.fa').removeClass('fa-plus-circle').addClass('fa-minus-circle');
    	} else {
    		$(this).parent().animate({'height': initialHeight});
    		$(this).children('.fa').removeClass('fa-minus-circle').addClass('fa-plus-circle');
    	}
    	settingsCount++;
    });

    $('form#addMarker h2').on('click', function() {
    	if (addMarkerCount%2===0) {
    		$(this).parent().animate({'height': addMarkerHeight});
    		$(this).children('.fa').removeClass('fa-plus-circle').addClass('fa-minus-circle');
    	} else {
    		$(this).parent().animate({'height': initialHeight});
    		$(this).children('.fa').removeClass('fa-minus-circle').addClass('fa-plus-circle');
    	}
    	addMarkerCount++;
    });

    $('#getCode h2').on('click', function() {
    	if (getCodeCount%2===0) {
    		$(this).parent().animate({'height': getCodeHeight});
    		$(this).children('.fa').removeClass('fa-plus-circle').addClass('fa-minus-circle');
    	} else {
    		$(this).parent().animate({'height': initialHeight});
    		$(this).children('.fa').removeClass('fa-minus-circle').addClass('fa-plus-circle');
    	}
    	getCodeCount++;
    });

//=======================================================
// Map functionality
//=======================================================
    var mobileBreakpoint = 700;

    // Show/hide menu sections
    var sectionHeight = $('.menu-section').height();
    //$('.menu-section').height(0);

    //$('.menu-section.first').height(sectionHeight+10);

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

    // Set infowindow height
    var mapHeight = $('#map-wrapper').outerHeight();

    // Move menu below map on mobile 
    if ($(window).width() < mobileBreakpoint+1) {
         $('#map-menu').insertAfter('#map');
    }

    // Select all textarea code in copy/paste section when user clicks
    var textBox = document.getElementById("mapCode");
    
    textBox.onfocus = function() {
        textBox.select();
    }
    
});


