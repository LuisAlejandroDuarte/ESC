'use strict';

angular.module('myApp')

.controller('edit-CaracterizacionCtrl', ['$scope','$location','datosCaracterizacion','Execute','$route','$window', function($scope,$location,datosCaracterizacion,Execute,$route,$window){
var NombreActual;	
	if ($route.current.params.idCaracterizacion==0)
	{
		$scope.tiTulo = "Nueva Caracterización";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar Caracterización";
		$scope.buttonText="Actualizar";
	}



	  datosCaracterizacion.$promise.then(function(datos){   

	  	$scope.Datos = datos[0];
		NombreActual=datos[0].CAR_NOMB;

	  });


	$scope.volver = function()
	{
		$location.path('/caracterizacion');
	}	


	$scope.save = function(item)
	{

		 var insertar =
              {
                Accion:"S",
                SQL:"SELECT CAR_NOMB FROM ESC_CARA WHERE CAR_NOMB='" + item.CAR_NOMB + "'"
              }
            Execute.SQL(insertar).then(function(result) { 
            if (result.data[0]!=null && NombreActual!=result.data[0].CAR_NOMB)
               {
               	 $window.alert('Ya existe el nombre');
               }
               else 
               {
               		if (item.CAR_CODI ==undefined)
						{
						var datos ={
			    			Accion:"I",
			    			SQL:"INSERT INTO ESC_CARA (CAR_NOMB) VALUES ('" + item.CAR_NOMB + "')"
						}

			 			Execute.SQL(datos).then(function(result) { 			 			
			 				$window.alert('Ingresado');
		 					$location.path('/caracterizacion');

			 			});
						
						}

					else
					{
						 datos ={
			    		Accion:"U",
			    		SQL:"UPDATE  ESC_CARA set CAR_NOMB='" + item.CAR_NOMB + "' WHERE CAR_CODI=" + item.CAR_CODI + ""
						}

				 			Execute.SQL(datos).then(function(result) { 			 	
				 			$window.alert('Actualizado');
			 				$location.path('/caracterizacion');

			 			});

					}
               }   
            }); 
	}  

}])