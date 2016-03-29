'use strict';

angular.module('myApp')

.controller('edit-EscalaEvaluacionCtrl', ['$scope','$location','datosEscalaEvaluacion','Execute','$route','$window', function($scope,$location,datosEscalaEvaluacion,Execute,$route,$window){
 var NombreActual;
	var datos ={
		Accion:"S",
		SQL:"SELECT PEV_CONS,PEV_DESC FROM ESC_PARA_EVAL"
	}		

	 Execute.SQL(datos).then(function(result) { 
	 	if (result.data[0]!=null)
			$scope.listParametro = result.data; 	
	 });	

	

	if ($route.current.params.idescalaEvaluacion==0)
	{
		$scope.tiTulo = "Nuevo Escala Evaluación";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar Escala Evaluación";
		$scope.buttonText="Actualizar";
	}



	  datosEscalaEvaluacion.$promise.then(function(datos){   

	  	$scope.Datos = datos[0];
	  	NombreActual = datos[0].EEV_CALI;

	  });


	$scope.volver = function()
	{
		$location.path('/escalaEvaluacion');
	}	


	$scope.save = function(item)
	{
		 var insertar =
              {
                Accion:"S",
                SQL:"SELECT EEV_CALI FROM ESC_ESCA_EVAL WHERE EEV_CALI='" + item.EEV_CALI + "'"
              }
            Execute.SQL(insertar).then(function(result) { 
            if (result.data[0]!=null && NombreActual!=result.data[0].EEV_DESC)
               {
               	 $window.alert('Ya existe la calificación');
               }
               else 
               {
               			if (item.EEV_CONS ==undefined)
							{																				
								var datos2 ={
					    			Accion:"I",
					    			SQL:"INSERT INTO ESC_ESCA_EVAL (EEV_CALI,EEV_PAEV_CONS) VALUES (" + item.EEV_CALI + "," + item.EEV_PAEV_CONS + ")"
									}

					 			Execute.SQL(datos2).then(function(result) { 					 	
					 								 			
					 			$window.alert("Ingresado");	
					 			$location.path('/escalaEvaluacion');			
								});
							}		

						else
							{
			 					datos2 ={
			    				Accion:"U",
			    				SQL:"UPDATE  ESC_ESCA_EVAL set EEV_CALI='" + item.EEV_CALI + "',EEV_PAEV_CONS="+  item.EEV_PAEV_CONS  + " WHERE EEV_CONS=" + item.EEV_CONS + ""
								}

			 					Execute.SQL(datos2).then(function(result) { 			 				
			 					$window.alert("Actualizado");	
			 					$location.path('/escalaEvaluacion');
			 					});

							}
               }
           });








	}  

}])