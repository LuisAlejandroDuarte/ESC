'use strict';

angular.module('myApp')

.controller('edit-EventoCtrl', ['$scope','$location','datosEvento','Execute','$route','$window', function($scope,$location,datosEvento,Execute,$route,$window){
	$scope.settingsDate =
	{
		culture: 'es-ES',
		formatString: 'dd-MMM-yyyy',
		value :null	
	}	

	//guarda el nombre actual
	var NombreActual;

	if ($route.current.params.idEvento==0)
	{
		$scope.tiTulo = "Nuevo Evento";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar Evento";
		$scope.buttonText="Actualizar";
	}


 
	  datosEvento.$promise.then(function(datos){   

	  	$scope.Datos = datos[0];
	  	if (datos[0].EVE_FECH_FINA=="0000-00-00" || datos[0].EVE_FECH_FINA==undefined || datos[0].EVE_FECH_FINA=="")
	  	{
	  		$scope.habilitarFecha=false;
	  		$scope.Datos.EVE_FECH_FINA=null;
	  	}
	  	else
	  			$scope.habilitarFecha=true;


	  	NombreActual = datos[0].EVE_NOMB;
	  	$scope.ArrayBuffer = datos[0].EVE_DOCU;
	  });


	$scope.volver = function()
	{
		$location.path('/evento');
	}	


	$scope.save = function(item)
	{
		 var insertar =
              {
                Accion:"S",
                SQL:"SELECT EVE_NOMB FROM ESC_EVEN WHERE EVE_NOMB='" + item.EVE_NOMB + "'"
              }
            Execute.SQL(insertar).then(function(result) { 
            if (result.data[0]!=null && NombreActual!=result.data[0].EVE_NOMB)
               {
               	 $window.alert('Ya existe el nombre');
               }
               else 
               {
               	var fechaInicio = new Date(item.EVE_FECH_INIC);
               	var anno =  fechaInicio.getFullYear();
               	var mes =  fechaInicio.getMonth()+1;
               	var dia =  fechaInicio.getDate();
               	fechaInicio = anno + "-" + mes + "-" + dia;   

           	  	var fechaTermina = new Date(item.EVE_FECH_FINA);

           	  	if (item.EVE_FECH_FINA==undefined)
           	  		fechaTermina=null;	
           	  	else
           	  		{
               			anno =  fechaTermina.getFullYear();
               			mes  =  fechaTermina.getMonth()+1;
               			dia  =  fechaTermina.getDate();
               			fechaTermina = anno + "-" + mes + "-" + dia;   
               		}
            	
            		
			               	
               	
         			if (item.EVE_CODI ==undefined)
						{
							var datos ={
			    				Accion:"I",
			    				SQL:"INSERT INTO ESC_EVEN (EVE_NOMB,EVE_DIRE,EVE_FECH_INIC,EVE_FECH_FINA,EVE_DOCU) " +
			    				" VALUES ('" + item.EVE_NOMB + "','" + item.EVE_DIRE + "','" + fechaInicio + "','" + fechaTermina + "','" + $scope.ArrayBuffer + "')"
							}
			 				Execute.SQL(datos).then(function(result) { 			 	
			 					$window.alert('Ingresado');			 								 					
			 					$location.path('/evento');
			 				});						
						}
						else
						{
								var fechaInicio = new Date(item.EVE_FECH_INIC);
               					var anno =  fechaInicio.getFullYear();
               					var mes =  fechaInicio.getMonth()+1;
               					var dia =  fechaInicio.getDate();
               					fechaInicio = anno + "-" + mes + "-" + dia; 


								if (item.EVE_FECH_FINA==undefined || item.EVE_FECH_FINA=="0000-00-00" || item.EVE_FECH_FINA=="")
           	  						fechaTermina=null;	
           	  					else
           	  					{
           	  					 var fechaTermina = new Date(item.EVE_FECH_FINA);
               					 var anno =  fechaTermina.getFullYear();
               					 var mes =  fechaTermina.getMonth()+1;
               					 var dia =  fechaTermina.getDate();
               					  fechaTermina = anno + "-" + mes + "-" + dia; 
           	  						
           	  					}

           	  				if ($scope.ArrayBuffer==undefined || $scope.ArrayBuffer=="")
           	  				    $scope.ArrayBuffer = $scope.Datos.EVE_DOCU;	

							var datos =
							{
			    				Accion:"U",
			    				SQL:"UPDATE  ESC_EVEN set " + 
			    				" EVE_NOMB='" + item.EVE_NOMB + "', " + 
			    				" EVE_DIRE='" + item.EVE_DIRE + "', " +
			    				" EVE_FECH_INIC='" + fechaInicio + "', " +
			    				" EVE_FECH_FINA='" + fechaTermina + "', " +
			    				" EVE_DOCU='" + $scope.ArrayBuffer + "' " +
			    				" WHERE EVE_CODI=" + item.EVE_CODI + ""
							}

			 				Execute.SQL(datos).then(function(result) { 			 	
			 					$window.alert('Actualizado');
			 					$location.path('/evento');
			 				});

						}
               }
           });
	}

$scope.uploadFile = function(arch)
 {
  var tipo;
  var replace;

    if (arch.files[0].size>750000)
    {
      $window.alert("El Archivo debe ser menor a 750 k");
      return;
    }

     $scope.nombreArchivo = arch.files[0].name;


     tipo = arch.files[0].type.split("\/");
    // var fs = require('fs');

    // fs.createReadStream(arch.value).pipe(fs.createWriteStream('/AppInvestigacion/' + arch.value));
      var data;
     var reader = new FileReader();
        reader.onload = function (e) {
            var dato = e.target.result;
            data= new Uint8Array(dato);
            replace = "data:" + tipo[0] + "\/" + tipo[1] + ";base64,";
            $scope.ArrayBuffer = dato;                    
        }
     reader.readAsDataURL(arch.files[0]);        

    //   var fd = new FormData();
    // //Take the first selected file
    // fd.append("file", arch.files[0]);

    //   $http.post('/AppInvestigacion', fd, {
    //     withCredentials: true,
    //     headers: {'Content-Type': undefined }
    // }).success('').error('ffd');
    $scope.$apply();
 }

}])