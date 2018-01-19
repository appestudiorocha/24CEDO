	$("#alert1").hide(); 
	$("#alert2").hide(); 
	var url = "http://www.24cedo.com";
	var lenguage = localStorage.getItem('lenguage') || 'en';
	var usuario = localStorage.getItem('usuario') || '';
	var lenguageApi = localStorage.getItem("lenguageApi") || '';

	if (localStorage.getItem("lenguageApi")) {
		var parametros = {
			"lenguage" : lenguage
		}; 
		console.log(lenguage);	
		$.ajax({
			data:  parametros, 
			url: url+'/api/lenguage/lenguage.php',
			type:  'get', 
			beforeSend: function () {
				$(".loading").show();
			},
			success: function (data) {
				$(".loading").hide();
				localStorage.setItem("lenguageApi",data);
				$("#signInIndex").html(data.text.signIn);
				$("#loginIndex").html(data.text.login);
				$("#myAccountNav").html(data.text.myAccount);
				$("#myLocationNav").html(data.text.myLocation);
				$("#callUsNav").html(data.text.callUs);
				$("#signOutNav").html(data.text.signOut);
				$("#needDoctorMap").html(data.text.buttonDoctor);
				$("#hiAlert").html(data.text.alertRequest)
				$("#keepCalm").html(data.text.alertRequest2)
				$("#willCall").html(data.text.alertRequest3)
				$("#question").html(data.text.questionRequest)
				$("#yes").html(data.text.yes);
				$("#no").html(data.text.no);
				$("#comming").html(data.text.doctorComing);
				$("#pain").html(data.text.successRequest);			
			}
		});
	}

	if(usuario) {		  
		var usuarioFinal = jQuery.parseJSON(usuario);		
		console.log(usuarioFinal);
		$("#idUser").val(usuarioFinal[0].data.idUser);
		$("#postal").val(usuarioFinal[0].data.postal);
		$("#nombreAlert1").html(usuarioFinal[0].data.nombre);
	}

	$("#myAccount").on("click", function() {
		if (typeof navigator !== "undefined" && navigator.app) { 		
			navigator.app.loadUrl('http://www.24cedo.com/api/users/login.users.sesion.php?email='+usuarioFinal[0].data.emailApp+"&password="+usuarioFinal[0].data.passwordApp+"", {openExternal: true});
		} else { 
			window.open("http://www.24cedo.com/api/users/login.users.sesion.php?email="+usuarioFinal[0].data.emailApp+"&password="+usuarioFinal[0].data.passwordApp+"", "_blank");
		}
	});

	$("#signIn").on("click", function() {
		if (typeof navigator !== "undefined" && navigator.app) { 
			navigator.app.loadUrl('http://www.24cedo.com/register', {openExternal: true});
		} else { 
			window.open("http://www.24cedo.com/register", "_blank");
		}
	});

	$('#loginForm').on('submit',function(e){
		e.preventDefault();
		var parametros = {
			"email" : $("[name='email']").val(),
			"password" : $("[name='password']").val()
		}; 
		console.log(parametros);
		$.ajax({
			data:  parametros, 
			url: url+'/api/users/login.users.and.php',
			type:  'get', 
			beforeSend: function () {
				$(".loading").show();
			},
			success: function (data) {
				$(".loading").hide();
				console.log(data);
				var obj = jQuery.parseJSON(data);
				var count = (obj.length);
				if(count != 0) {
					localStorage.setItem("usuario",data)
					document.location.href= "map.html"; 				
				} else {
					$(".mensajeLogin").show();
					$(".mensajeLogin").html("We do not have users with this data.");		
				}
			}
		});
	})

	$('#doctorForm').on('submit',function(e){
		e.preventDefault();
		var parametros = {
			"idUser" : $("#idUser").val(),
			"postal" : $("#postal").val(),
			"longitude" : $("#longitude").val(),
			"latitude" : $("#latitude").val()
		};  
		$.ajax({
			data:  parametros, 
			url: url+'/api/maps/insert.maps.php',
			type:  'post',
			beforeSend: function () {
				$(".loading").show();
			}, 
			success: function (data) {
				var leng = lenguage;
				$(".loading").hide();
				console.log(data);
				console.log(data[1].resultado);
				if(data[1].resultado == 0) {
					$("#yes").prop("disabled","disabled");
					$("#yes").attr("disabled","disabled");
					$('#alert1').slideToggle();
					$('#alert2').slideToggle();
					$('#nombreAlert2').html(data[0].apellido);
					$('#universidad').html(data[0].universidad);
					$('#licencia').html(data[0].licencia);
					$('#imagenAlert2').attr("src",url + "/" + data[0].imagen);					
				} else {
					switch (leng) {
						case "es":
						navigator.notification.alert(data[1].es, null, "24 CEDO", "Cerrar");
						break;
						case "en":
						navigator.notification.alert(data[1].en, null, "24 CEDO", "Close");
						break;
						case "pt":
						navigator.notification.alert(data[1].pt, null, "24 CEDO", "Fechar");
						break;		
						case "ha":
						navigator.notification.alert(data[1].ha, null, "24 CEDO", "Close");
						break;	
						default:
						navigator.notification.alert(data[1].en, null, "24 CEDO", "Close");
						break;
					}					
				}			
			}
		});
	})

	function signOut() {
		localStorage.setItem("usuario","");
		document.location.href= "index.html";
	} 

	function needDoctor() { $("#alert1").slideToggle(); }  
	
	function needGeo() {
		navigator.geolocation.getCurrentPosition(onSuccessMap, onErrorMap, {enableHighAccuracy: true, maximumAge: 3000});
	}

	function onSuccessMap(position) {
		console.log(position.coords); 
		$("#latitude").val(position.coords.latitude);
		$("#longitude").val(position.coords.longitude);
		var myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		var mapOptions = {
			zoom: 19,
			center: myLatlng,
			disableDefaultUI: true 		
		}
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		var marker = new google.maps.Marker({ position: myLatlng, title:"Hello World!", icon: "img/marker.png" });
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setMap(map);
	}

	function onErrorMap(error) {
		alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
	}

	function lenguageChange(len) {
		localStorage.setItem('lenguage',len)
		var parametros = {
			"lenguage" : len
		}; 
		console.log(len);
		$.ajax({
			data:  parametros, 
			url: url+'/api/lenguage/lenguage.php',
			type:  'get', 
			beforeSend: function () {
				$(".loading").show();
			},
			success: function (data) {
				$(".loading").hide(); 			
				localStorage.setItem("lenguageApi",data);  			
				$("#signInIndex").html(data.text.signIn);
				$("#loginIndex").html(data.text.login);
				$("#myAccountNav").html(data.text.myAccount);
				$("#myLocationNav").html(data.text.myLocation);
				$("#callUsNav").html(data.text.callUs);
				$("#signOutNav").html(data.text.signOut);
				$("#needDoctorMap").html(data.text.buttonDoctor);
				$("#hiAlert").html(data.text.alertRequest)
				$("#keepCalm").html(data.text.alertRequest2)
				$("#willCall").html(data.text.alertRequest3)
				$("#question").html(data.text.questionRequest)
				$("#yes").html(data.text.yes);
				$("#no").html(data.text.no);
				$("#comming").html(data.text.doctorComing);
				$("#pain").html(data.text.successRequest);
			}
		});
	}

	document.addEventListener("offline", onOffline, false);

	function onOffline() { alert('You are now offline!'); }

	document.addEventListener('deviceready', function () {    		
		var notificationOpenedCallback = function(jsonData) {
			console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
		};
		window.plugins.OneSignal
		.startInit("73ac52d9-9cd8-4d34-b584-e26de2d2e22e")
		.handleNotificationOpened(notificationOpenedCallback)
		.endInit();		

		if(usuario) {
			window.plugins.OneSignal.sendTag("cod", usuarioFinal[0].data.idUser);
		}

	}, false);
