'use strict';

angular.module('myApp')

.controller('edit-EntidadCtrl', ['$scope','$location','datosEntidad','Execute','$route','$window', function($scope,$location,datosEntidad,Execute,$route,$window){
	var NombreActual;
	if ($route.current.params.idEntidad==0)
	{
		$scope.tiTulo = "Nueva Entidad";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar Entidad";
		$scope.buttonText="Actualizar";
	}



	  datosEntidad.$promise.then(function(datos){   

	  	$scope.Datos = datos[0];
	  	NombreActual = datos[0].ENT_NOMB;

	  });


	$scope.volver = function()
	{
		$location.path('/entidad');
	}	


	$scope.save = function(item)
	{
		var insertar =
              {
                Accion:"S",
                SQL:"SELECT ENT_NOMB FROM ESC_ENTI WHERE ENT_NOMB='" + item.ENT_NOMB + "'"
              }
            Execute.SQL(insertar).then(function(result) { 
            if (result.data[0]!=null && NombreActual!=result.data[0].ENT_NOMB)
               {
               	 $window.alert('Ya existe el nombre');
               }
               else 
               {
               		if (item.ENT_CODI ==undefined)
						{
							var datos ={
			    			Accion:"I",
			    			SQL:"INSERT INTO ESC_ENTI (ENT_NOMB) VALUES ('" + item.ENT_NOMB + "')"
							}
			 				Execute.SQL(datos).then(function(result) { 			 	
			 					$window.alert('Ingresado');
			 					$scope.Datos.ENT_NOMB="";
			 					$('#idEntNomb').focus();
			 					$location.path('/entidad');
			 				});					

						}

						else
							{
								datos ={
						    	Accion:"U",
						    	SQL:"UPDATE  ESC_ENTI set ENT_NOMB='" + item.ENT_NOMB + "' WHERE ENT_CODI=" + item.ENT_CODI + ""
								}

			 					Execute.SQL(datos).then(function(result) { 
			 						$window.alert('Actualizado');
			 						$location.path('/entidad');
			 					});

							}
               }
           });

	}  

}])