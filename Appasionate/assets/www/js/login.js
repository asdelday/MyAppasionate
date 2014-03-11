var SERVIDOR = 'http://rodcode.com/appasionate/';

document.addEventListener("deviceready", onDeviceReady, false);

///////////////////////
// Dispositivo listo //
///////////////////////
function onDeviceReady() {
	//borrarLoginStoraged();
	new FastClick(document.body);

	$('#loginContainer').show();
	$('#registroContainer').hide();

	document.addEventListener("backbutton", onBackKeyDown, false);
}

/////////////////////
// Salir de la APP //
/////////////////////
function onBackKeyDown(){
    navigator.app.exitApp();
}

///////////////////
// Redireccionar //
///////////////////
function redireccionarAplicacion() {
	location.href='map.html';
}


////////////////////////////////
// Click en el boton de LOGIN //
////////////////////////////////
function onClickLogin() {
	$('#loginErrors').html('');
	var isError = false;

	var email = $('#inputEmail').val();
	var pass = $('#inputPassword').val();

	if (email == '') {
		printEmptyEmail();
		isError = true;
	} else if (!isEmail(email)) {
		printWrongEmail();
		isError = true;
	}

	if (pass == '') {
		printEmptyPassword();
		isError = true;
	}

	if (!isError) {
		conectar(email, pass);
	}
}


//////////////
// CONECTAR //
//////////////
function conectar(email, pass) {
	var parametros = {"email" : email, "pass" : pass};

	$.ajax({
		url: SERVIDOR + 'login.php',
		type:'POST',
		data:parametros,
		dataType:'json',
		beforeSend: function () {
            $('#loadingModal').modal('show');
        },
		error:function(jqXHR,text_status,strError){
			$('#loadingModal').modal('hide');
			navigator.notification.alert(
			    'No se pudo establecer conexión con el servidor.',
			    null,
			    'Conexión',
			    'Aceptar'
			);
		},
		timeout:60000,
		success:function(data){
			$('#loadingModal').modal('hide');
			$("#loginErrors").html("");

			if (data.length > 0) {
				borrarLoginStoraged();

				// Si esta activado el recuerdame...
				if ($('#recordar').is(":checked")) {
					localStorage.login = JSON.stringify(data[0]);
				} else {
					sessionStorage.login = JSON.stringify(data[0]);
				}

				redireccionarAplicacion();

			} else {
				printWrongLogin();
			}
		}
	});

}


///////////////////////////////////
// Click en el boton de REGISTRO //
///////////////////////////////////
function onClickIrRegistro() {
	$('#loginContainer').fadeOut('400', function() {
		$("#loginErrors").html("");
		$('#registroContainer').fadeIn('400');
	});

}

function onClickVolverLogin() {
	$('#registroContainer').fadeOut('400', function() {
		$("#loginErrors").html("");
		$('#loginContainer').fadeIn('400');
	});
}

///////////////////
// VALIDAR EMAIL //
///////////////////
function isEmail(email) {
  	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  	return regex.test(email);
}


//////////////////////
// IMPRIMIR ERRORES //
//////////////////////
function printWrongEmail() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> Email no válido.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printEmptyEmail() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> Campo de email vacio.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printEmptyPassword() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> Campo de contraseña vacio.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printWrongLogin() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> No existe ningún usuario con los datos proporcionados.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printEmptyRegistro() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> Debe rellenar todos los campos para registrarse.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printEmailIsInDataBase() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> El Email proporcionado ya se encuentra en uso.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printPasswordsNoCoinciden() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> Las contraseñas proporcionadas no coinciden.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printCodNoExiste() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> El Código proporcionado no exite, porfavor pregunte a su profesor el código.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printPasswordDemasiadoCorta() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-danger alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Error!</strong> La contraseña proporcionada es demasiado corta (mínimo 6 carácteres).';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}

function printRegistroCorrecto() {
	var cadena = '<div style="margin: 5px 5% 5px 5%;" class="alert alert-success alert-dismissable">';
  		cadena += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  		cadena += '<strong>Correcto!</strong> El registro se ha completado correctamente.';
	cadena += '</div>';

	$('#loginErrors').append(cadena);
}


///////////////////////////////
// LIMPIAR VARIABLES LOCALES //
///////////////////////////////
function borrarLoginStoraged() {
    localStorage.removeItem("login");
	sessionStorage.removeItem("login");
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// 	REGISTRO
//////////////////////////////////////////////////////////////////////////
function onClickRegistrarse() {
	$('#loginErrors').html("");
	// Recoger datos.
	var email = $('#inputEmailReg').val();
	var pass = $('#inputPasswordReg').val();
	var passRep = $('#inputRepetirPasswordReg').val();
	var nombre = $('#inputNombreReg').val();
	var apellidos = $('#inputApellidosReg').val();
	var cod = $('#inputCodReg').val();

	//////////////////
	// VALIDACIONES //
	//////////////////
	var isNotEmpty = true;
	var isOk = true;

	// Comprobar campos vacios
	if (!isNotCampoVacioFromRegistro(email, pass, passRep, nombre, apellidos, cod)) {
		printEmptyRegistro();
		isOk = false;
		isNotEmpty = false;
	}

	// Comprobar email
	if (!isEmail(email) && isNotEmpty) {
		printWrongEmail();
		isOk = false;
	}

	// Comprobar si existe algun usuario con ese email
	if (isNotEmpty) {
		$.ajax({
			url: SERVIDOR + 'testEmail.php',
			type:'POST',
			data:{"email" : email},
			dataType:'text',
			beforeSend: function () {
		    	$('#loadingModal').modal('show');
		    },
			error:function(jqXHR,text_status,strError){
				printEmailIsInDataBase();
				isOk = false;
			},
			timeout:60000,
			success:function(data){
				if (data != 0) {
					printEmailIsInDataBase();
					isOk = false;
				}
			},
			complete: function() {

				// Comprobar contraseñas
				if (pass.length < 6) {
					isOk = false;
					printPasswordDemasiadoCorta();
				}
				else if (pass != passRep) {
					isOk = false;
					printPasswordsNoCoinciden();
				}

				// Comprobar si existe el cod
				$.ajax({
					url: SERVIDOR + 'testCod.php',
					type:'POST',
					data:{"cod" : cod},
					dataType:'text',
					error:function(jqXHR,text_status,strError){
						printEmailIsInDataBase();
						isOk = false;
					},
					timeout:60000,
					success:function(data){
						if (data == 0) {
							printCodNoExiste();
							isOk = false;
						}
					},
					complete: function() {

						// Comprobar contraseñas
						if (isOk) {
							registrarUsuario(email, pass, passRep, nombre, apellidos, cod);
						}
						else {
							$('#loadingModal').modal('hide');
						}
					}
				});
			}
		});
	}
}

function registrarUsuario(email, pass, passRep, nombre, apellidos, cod) {
	var parametros = {"email" : email, "pass" : pass, "passRep" : passRep, "nombre" : nombre, "apellidos" : apellidos, "cod" : cod};

	$.ajax({
		url: SERVIDOR + 'registrarUsuario.php',
		type:'POST',
		data:parametros,
		dataType:'text',
		error:function(jqXHR,text_status,strError){
			$('#loadingModal').modal('hide');
			navigator.notification.alert(
			    'No se pudo realizar el registro.',
			    null,
			    'Registro',
			    'Aceptar'
			);
		},
		timeout:60000,
		success:function(data){
			$('#loadingModal').modal('hide');

			if (data == 1) {
				printRegistroCorrecto();
			} else {
				navigator.notification.alert(
				    'Error en el registro.',
				    null,
				    'Registro',
				    'Aceptar'
				);
			}
		}
	});
}

function isNotCampoVacioFromRegistro(email, pass, passRep, nombre, apellidos, cod) {
	var centinela = true;

	if (email == "") {
		centinela = false;
	} else if (pass == "") {
		centinela = false;
	} else if (passRep == "") {
		centinela = false;
	} else if (nombre == "") {
		centinela = false;
	} else if (apellidos == "") {
		centinela = false;
	} else if (cod == "") {
		centinela = false;
	}

	return centinela;
}