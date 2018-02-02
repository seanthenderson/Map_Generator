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
        var centerLat = document.getElementById('centerLat').value;
        centerLat = parseInt(centerLat);
        var centerLong = document.getElementById('centerLong').value;
        centerLong = parseInt(centerLong);
        var zoomLevel = document.getElementById('zoomLevel').value;
        var mapWidth = document.getElementById('mapWidth').value;
        var mapHeight = document.getElementById('mapHeight').value;
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
            `<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
            <style>
                #map-wrapper {
                  width: 100%;
                  margin: 20px auto;
                  font-family: Arial, sans-serif;
                  text-align: center;
                  position: relative; }
                  #map-wrapper #map-menu {
                    width: 310px;
                    margin-right: -5px;
                    background: #333;
                    color: #e0e0e0;
                    display: inline-block;
                    vertical-align: top;
                    overflow: scroll; }
                    @media only screen and (max-width: 700px) {
                      #map-wrapper #map-menu {
                        width: auto;
                        height: auto !important; } }
                    #map-wrapper #map-menu h2 {
                      margin: 100px auto;
                      color: #ececec;
                      text-transform: uppercase; }
                    #map-wrapper #map-menu .menu-section-header {
                      margin-bottom: -2px;
                      border-top: solid 1px #666;
                      font-weight: bold;
                      text-align: center;
                      text-transform: uppercase; }
                      #map-wrapper #map-menu .menu-section-header:hover {
                        color: #fff;
                        cursor: pointer; }
                      #map-wrapper #map-menu .menu-section-header:first-of-type {
                        border-top: none; }
                    #map-wrapper #map-menu .menu-section {
                      overflow: scroll;
                      overflow: -moz-scrollbars-none;
                      -ms-overflow-style: none; }
                      #map-wrapper #map-menu .menu-section::-webkit-scrollbar {
                        width: 0px;
                        background: transparent; }
                      #map-wrapper #map-menu .menu-section .thumbnail {
                        width: 155px;
                        height: 155px;
                        margin: 0;
                        background-size: cover;
                        background-repeat: no-repeat;
                        position: relative;
                        display: inline-block;
                        vertical-align: top; }
                        #map-wrapper #map-menu .menu-section .thumbnail:hover {
                          cursor: pointer; }
                        #map-wrapper #map-menu .menu-section .thumbnail p {
                          margin: 0;
                          padding: 10px 0 12px;
                          background: rgba(0, 0, 0, 0.7);
                          color: #fff;
                          font-size: 15px;
                          font-weight: bold;
                          text-shadow: 0 0 3px #000;
                          line-height: 1;
                          opacity: 0.9;
                          position: absolute;
                          bottom: 0;
                          left: 0;
                          right: 0; }
                          #map-wrapper #map-menu .menu-section .thumbnail p:hover {
                            opacity: 1; }
                        #map-wrapper #map-menu .menu-section .thumbnail .description {
                          display: none; }
                  #map-wrapper .infowindow {
                    width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #fff;
                    border: solid 3px #333;
                    color: #333;
                    text-align: left;
                    position: absolute;
                    top: 20px;
                    left: 0;
                    right: 0;
                    z-index: 999;
                    display: none; }
                    @media only screen and (max-width: 700px) {
                      #map-wrapper .infowindow {
                        width: auto;
                        overflow: scroll;
                        top: 10px;
                        left: 10px;
                        right: 10px;
                        bottom: 10px; } }
                    #map-wrapper .infowindow .fa-times {
                      width: 16px;
                      height: 16px;
                      padding: 5px;
                      background: #fff;
                      border: solid 4px #333;
                      border-radius: 100%;
                      color: #333;
                      font-size: 20px;
                      text-align: center;
                      line-height: 16px;
                      position: absolute;
                      top: -13px;
                      right: -13px;
                      z-index: 9999; }
                      #map-wrapper .infowindow .fa-times:hover {
                        color: #000;
                        border: solid 4px #000;
                        cursor: pointer; }
                      @media only screen and (max-width: 700px) {
                        #map-wrapper .infowindow .fa-times {
                          padding: 3px;
                          background: none;
                          border: 0;
                          border-radius: 0;
                          top: 0;
                          right: 0; }
                          #map-wrapper .infowindow .fa-times:hover {
                            color: #000;
                            border: none;
                            cursor: pointer; } }
                    #map-wrapper .infowindow img {
                      width: 250px;
                      margin: 0 0 10px 20px;
                      float: right; }
                      @media only screen and (max-width: 500px) {
                        #map-wrapper .infowindow img {
                          width: 100%;
                          margin: 0 0 10px 0; } }
                    #map-wrapper .infowindow h2 {
                      margin: 0 0 10px;
                      font-size: 35px; }
                      @media only screen and (max-width: 700px) {
                        #map-wrapper .infowindow h2 {
                          font-size: 30px; } }
                      @media only screen and (max-width: 400px) {
                        #map-wrapper .infowindow h2 {
                          font-size: 23px; } }
                    #map-wrapper .infowindow p {
                      line-height: 26px; }
                  #map-wrapper #map {
                    width: 78%;
                    height: 500px;
                    display: inline-block;
                    vertical-align: top; }
                    @media only screen and (max-width: 1000px) {
                      #map-wrapper #map {
                        width: 500px; } }
                    @media only screen and (max-width: 700px) {
                      #map-wrapper #map {
                        width: 100%;
                        height: 500px; } }
                    @media only screen and (max-width: 400px) {
                      #map-wrapper #map {
                        height: 300px; } }
                
                .infowindow img,
                .infowindow-preview img {
                  max-width: 250px; }
            </style>

            <div id="map-wrapper">
                <div id="map-menu">
                    <div class="menu-section-header"></div>
                    <div class="menu-section first">
                        <div class="thumbnail" style="background-image: url( locationImage );" data-lat=" latitude " data-long=" longitude ">
                            <p> locationName </p>
                        </div>
                    </div>
                </div>
                <div id="map"></div>
            </div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaNJxJCuP05lZre6EIh7fHC77ebd57KQw&callback=initMap" async defer></script>

            <script>
                var marker;
                var markerId = 0;
                var markers = [];
                function initMap(map) {
                    var map = new google.maps.Map(document.getElementById("map"), {
                        center: {lat: ${centerLat}, lng: ${centerLong}},
                        zoom: ${zoomLevel},
                    });

                    // Add a new marker
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(${latitude}, ${longitude}),
                        label: "${locationName}",
                        map: map,
                        id: markerId
                    });

                    markers.push(marker);

                    markerId++;
                }
                $("#map").css({"width": "${mapWidth}%", "height": "${mapHeight}px"});

                // Add infowindow
                var infoWindow = <div class="infowindow"><i class="fa fa-times" aria-hidden="true"></i><img src="${locationImage}"/><h2>${locationName}</h2>${locationDescription}<p><a href="${locationLink}" target="_blank">More Info</a></p></div>
                $(infoWindow).insertBefore(#map);
                
                // Show infowindow on thumbnail click
                $(.thumbnail).on(click, function() {
                    var thumbNum = $(.thumbnail).index(this); 
                    if ($(window).width() > 700) {
                        var thumbNum = thumbNum+2;
                    } else {
                        var thumbNum = thumbNum+1;
                    }
                    $(.infowindow:nth-of-type( + thumbNum + )).fadeIn();
                });

                // Hide infowindow on x click
                $(.infowindow .fa-times).on(click, function() {
                    $('.infowindow').fadeOut();
                });
                $('.infowindow').on('click', function(e) {
                    e.stopPropagation();
                });
            </script>`; 

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


