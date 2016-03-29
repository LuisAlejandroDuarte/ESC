'use strict';

angular.module('myApp')

.controller('edit-parametroEvaluacionCtrl', ['$scope','$location','datosparametroEvaluacion','Execute','$route','$window', function($scope,$location,datosparametroEvaluacion,Execute,$route,$window){
var NombreActual;	
	if ($route.current.params.idparametroEvaluacion==0)
	{
		$scope.tiTulo = "Nuevo Parámetro Evaluación";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar Parámetro Evaluación";
		$scope.buttonText="Actualizar";
	}



	  datosparametroEvaluacion.$promise.then(function(datos){   

	  	$scope.Datos = datos[0];
		NombreActual=datos[0].PEV_DESC;

	  });


	$scope.volver = function()
	{
		$location.path('/parametroEvaluacion');
	}	


	$scope.save = function(item)
	{

		 var insertar =
              {
                Accion:"S",
                SQL:"SELECT PEV_DESC FROM ESC_PARA_EVAL WHERE PEV_DESC='" + item.PEV_DESC + "'"
              }
            Execute.SQL(insertar).then(function(result) { 
            if (result.data[0]!=null && NombreActual!=result.data[0].PEV_DESC)
               {
               	 $window.alert('Ya existe el nombre');
               }
               else 
               {
               		if (item.PEV_CONS ==undefined)
						{
						var datos ={
			    			Accion:"I",
			    			SQL:"INSERT INTO ESC_PARA_EVAL (PEV_DESC) VALUES ('" + item.PEV_DESC + "')"
						}

			 			Execute.SQL(datos).then(function(result) { 			 			
			 				$window.alert('Ingresado');
		 					$location.path('/parametroEvaluacion');

			 			});
						
						}

					else
					{
						 datos ={
			    		Accion:"U",
			    		SQL:"UPDATE  ESC_PARA_EVAL set PEV_DESC='" + item.PEV_DESC + "' WHERE PEV_CONS=" + item.PEV_CONS + ""
						}

				 			Execute.SQL(datos).then(function(result) { 			 	
				 			$window.alert('Actualizado');
			 				$location.path('/parametroEvaluacion');

			 			});

					}
               }   
            }); 
	}  

}])