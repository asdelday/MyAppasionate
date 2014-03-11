var SERVIDOR = 'http://rodcode.com/appasionate/';
// Declaraci—n de variables globales
var myScrollMenu, cuerpo, menuprincipal, wrapper, estado, myPosition, myLng, myLat, myLatLng, map, myMarker;
var marcadores;

// Guardamos en variables elementos para poder rescatarlos despuŽs sin tener que volver a buscarlos
cuerpo = document.getElementById("cuerpo");
menuprincipal = document.getElementById("menuprincipal");
wrapper = document.getElementById("wrapper");

var you = {
	path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
	fillColor: "yellow",
	fillOpacity: 0.8,
	scale: 1,
	strokeColor: "gold",
	strokeWeight: 14
};

var app = {
    // Constructor de la app
    initialize: function() {
        $('#loadingModal').modal('show');

    	// Estado inicial mostrando capa cuerpo
    	estado="cuerpo";

    	// Creamos el elemento style, lo a–adimos al html y creamos la clase cssClass para aplicarsela al contenedor wrapper
	    var heightCuerpo=window.innerHeight-46;
	    var style = document.createElement('style');
	    style.type = 'text/css';
	    style.innerHTML = '.cssClass { position:absolute; z-index:2; left:0; top:46px; width:100%; height: '+heightCuerpo+'px; overflow:auto;}';
	    document.getElementsByTagName('head')[0].appendChild(style);

	    // A–adimos las clases necesarias
		cuerpo.className = 'page center';
		menuprincipal.className = 'page center';
		wrapper.className = 'cssClass';

		// Creamos los 2 scroll mediante el plugin iscroll, uno para el menœ principal y otro para el cuerpo
		myScrollMenu = new iScroll('wrapperMenu', { hideScrollbar: true });

        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
    	// Ejecutamos la funci—n FastClick, que es la que nos elimina esos 300ms de espera al hacer click
    	new FastClick(document.body);
    	document.addEventListener("backbutton", onBackKeyDown, false);


    	navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true});
    },

};

// Inicia el mapa con la localizacion del usuario.
function onSuccess(position) {
	myLat = position.coords.latitude;
	myLng = position.coords.longitude;

	myLatLng = new google.maps.LatLng(myLat, myLng);

	var mapOptions = {
		center: myLatLng,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  	createMarkerMyPosition();

  	// Rellenar menu marcadores
    rellenarMenuMarcadores();

	$('#loadingModal').modal('hide');

	/*Codigo Plugin (lo guardo para futuros ejemplos
	cordova.exec(
        successCallback, // success callback function
        errorCallback, // error callback function
        'AppGps', // mapped to our native Java class called "AppGps"
        'gps_on', // with this action name
        [{}]
	);*/
}

/* Codigo Plugin (lo guardo para futuros ejemplos
function successCallback(message) {
	alert(message);
}

function errorCallback(message) {
	alert(message);
}
*/

// Muestra error de geolocalizacion y muestra el mapa en un punto predeterminado
function onError(error) {
	navigator.notification.alert(
	    'Error en la geolocalización, asegurese de tener activado el GPS del dispositivo.',
	    null,
	    'Geolocalización',
	    'Aceptar'
	);

	myLat = 28.400;
	myLng = -16.500;

	myLatLng = new google.maps.LatLng(myLat, myLng);

	var mapOptions = {
		center: myLatLng,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	createMarkerMyPosition();

	// Rellenar menu marcadores
    rellenarMenuMarcadores();

	$('#loadingModal').modal('hide');
}

// Funci—n para a–adir clases css a elementos
function addClass( classname, element ) {
    var cn = element.className;
    if( cn.indexOf( classname ) != -1 ) {
    	return;
    }
    if( cn != '' ) {
    	classname = ' '+classname;
    }
    element.className = cn+classname;
}

// Funci—n para eliminar clases css a elementos
function removeClass( classname, element ) {
    var cn = element.className;
    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
    cn = cn.replace( rxp, '' );
    element.className = cn;
}

// Funcion encargada de los eventos para el MENU de marcadores
function menu(opcion){

	// Si pulsamos en el bot—n de "menu" entramos en el if
	if(opcion=="menu"){
		if(estado=="cuerpo"){
			cuerpo.className = 'page transition right';
			estado="menuprincipal";
			$('#menuIcon').attr("class", "glyphicon glyphicon-remove-circle");
		}else if(estado=="menuprincipal"){
			cuerpo.className = 'page transition center';
			estado="cuerpo";
			$('#menuIcon').attr("class", "glyphicon glyphicon-map-marker");
		}
	// Si pulsamos un bot—n del menu principal entramos en el else
	}else{
		var arrayLatLng = opcion.split(", ");
		var positionOpcion = new google.maps.LatLng(arrayLatLng[0], arrayLatLng[1]);
		map.setCenter(positionOpcion);
		map.setZoom(18);

		// A–adimos las clases necesarias para que la capa cuerpo se mueva al centro de nuestra app y muestre el contenido
		cuerpo.className = 'page transition center';
		estado="cuerpo";

		$('#menuIcon').attr("class", "glyphicon glyphicon-map-marker");

	}

}

// rellena el menu con los marcadores del usuario
function rellenarMenuMarcadores() {

	var parametros = {"cod" : usuario.cod};

	$.ajax({
		url: SERVIDOR + 'obtenerMarcadores.php',
		type:'POST',
		data:parametros,
		dataType:'json',
		error:function(jqXHR,text_status,strError){
			navigator.notification.alert(
			    'No se pudo establecer conexión con el servidor.',
			    null,
			    'Conexión',
			    'Aceptar'
			);
		},
		timeout:60000,
		success:function(data){
			completarMenu(data);

		}
	});
}

// Rellena el menu con sus componentes
function completarMenu(data) {
	var menu = $('#ulMenu');
	myLatLngItem = myLat + ", " + myLng;

	// ENCABEZADO MENU
	var firstItem = "";
	firstItem += '<a style="text-decoration:none" href="javascript:menu(\'' + myLatLngItem + '\');">';
		firstItem += '<li>';
			firstItem += '<span class="glyphicon glyphicon-map-marker"></span>';
			firstItem += ' Marcadores: ' + usuario.nombre + ' ' + usuario.apellidos;
		firstItem += '</li>';
	firstItem += '</a>';
	menu.html(firstItem);

	// ITEMS DEL MENU
	var color = 1;
	for (var i = 0; i < data.length; i++) {
	    var latLngItem = String(data[i].lat + ', ' + data[i].lng);
	    var item = "";

	    item += '<li id="' + "item" + i + '" class="color' + color + '">';
		    item += '<a href="javascript:menu(\'' + latLngItem + '\');">';
			    item += '<div class="titulo">' + data[i].titulo + '</div>';
			    item += '<div class="descripcion">' + latLngItem + '</div>';
		    item += '</a>';
	    item += '</li>';

	    menu.append(item);

	    // Contador color.
	    if (color == 6) {
	    	color = 1;
	    } else {
	    	color ++;
	    }

	    crearMarcador(data[i]);
	}

	myScrollMenu = new iScroll('wrapperMenu', { hideScrollbar: true });
}

// Crea el marcador y su infoWindow
function crearMarcador(dataMarker) {
	var contentString = '<div id="content">'+
	    '<div id="siteNotice">'+
	    '</div>'+
	    '<h3 id="firstHeading" class="firstHeading">' + dataMarker.titulo + '</h3>'+
	    '<div style="overflow: scroll;max-height:200px" id="bodyContent">'+
	    '<p>' + dataMarker.descripcion + '</p>'+
	    '<img src="' + dataMarker.imagen_path + '"/>'+
	    '</div>'+
	    '</div>';

	var widthPantalla = window.innerWidth;
	var widthInfoWindow = widthPantalla - 120;
	if (widthInfoWindow < 200) {
	    widthInfoWindow = 200;
	}
	var infowindow = new google.maps.InfoWindow({
	    content: contentString,
	    maxWidth: widthInfoWindow
	});

	var positionMarker = new google.maps.LatLng(dataMarker.lat, dataMarker.lng);
	var marker = new google.maps.Marker({
	    position: positionMarker,
	    map: map,
	    title:dataMarker.titulo
	});

	google.maps.event.addListener(marker, 'click', function() {
	  	infowindow.open(map,marker);
	});
}

// Al pulsar el icono de apagado mostramos modal con opciones
function offIcon() {
	$('#offModal').modal('show');
}

// Salir de la APP
function onBackKeyDown(){
    navigator.app.exitApp();
}

// Borra la sesion y regresa a la pagina de logueo
function onClickCerrarSesion() {
	localStorage.removeItem("login");
	sessionStorage.removeItem("login");

	location.href='login.html';
}

// Al pulsar en el boton de geolocalizar
function onClickLocate() {
	$('#loadingModal').modal('show');
	navigator.geolocation.getCurrentPosition(reelocalizar, reelocalizarError, {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true});
}

// Al pulsar en el boton de configuracion
function onClickConfig() {
	navigator.notification.alert(
	    'Configuración para ' + usuario.rol + ': Aun no implementado.',
	    null,
	    'Configuración',
	    'Aceptar'
	);
}

// localiza el dispositivo y actualiza el mapa a esa posicion.
function reelocalizar(position) {
	myLat = position.coords.latitude;
	myLng = position.coords.longitude;

	//alert(myLat + ", " + myLng);

	myLatLng = new google.maps.LatLng(myLat, myLng);
	map.setCenter(myLatLng);
	map.setZoom(16);
	myMarker.setPosition(myLatLng);

	$('#loadingModal').modal('hide');
}

// Muestra error de geolocalizacion y vuelve a la ultima posicion guardada
function reelocalizarError(error) {
	navigator.notification.alert(
	    'Error en la geolocalización, asegurese de tener activado el GPS del dispositivo.',
	    null,
	    'Geolocalización',
	    'Aceptar'
	);

	map.setCenter(myLatLng);
	map.setZoom(16);
	myMarker.setPosition(myLatLng);

	$('#loadingModal').modal('hide');
}

// Crea el marcador de mi posicion
function createMarkerMyPosition() {
	myMarker = new google.maps.Marker({
      	position: myLatLng,
      	map: map,
      	title: 'My Position!',
      	icon: 'http://labs.google.com/ridefinder/images/mm_20_green.png'
  	});

  	// TODO --- Corregir que se cree el marcador cuando no haya conexion.. etc.
}
