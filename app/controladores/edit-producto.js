'use strict';

angular.module('myApp')

.controller('edit-ProductoCtrl', ['$scope','$location','datosProducto','Execute','$route','$window', function($scope,$location,datosProducto,Execute,$route,$window){
	//guarda el nombre actual
	var NombreActual;
	if ($route.current.params.idProducto==0)
	{
		$scope.tiTulo = "Nuevo Producto";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar Producto";
		$scope.buttonText="Actualizar";
	}


 
	  datosProducto.$promise.then(function(datos){   

	  	$scope.Datos = datos[0];
	  	NombreActual = datos[0].PRO_NOMB;
	  });


	$scope.volver = function()
	{
		$location.path('/producto');
	}	


	$scope.save = function(item)
	{
		 var insertar =
              {
                Accion:"S",
                SQL:"SELECT PRO_NOMB FROM ESC_PROD WHERE PRO_NOMB='" + item.PRO_NOMB + "'"
              }
            Execute.SQL(insertar).then(function(result) { 
            if (result.data[0]!=null && NombreActual!=result.data[0].PRO_NOMB)
               {
               	 $window.alert('Ya existe el nombre');
               }
               else 
               {
         			if (item.PRO_CODI ==undefined)
						{
							var datos ={
			    				Accion:"I",
			    				SQL:"INSERT INTO ESC_PROD (PRO_NOMB,PRO_CODI_MUES) VALUES ('" + item.PRO_NOMB + "','" + item.PRO_CODI_MUES + "')"
							}
			 				Execute.SQL(datos).then(function(result) { 			 	
			 					$window.alert('Ingresado');
			 					$scope.Datos.PRO_NOMB="";
			 					$scope.Datos.PRO_CODI_MUES="";
			 					$('#idProNomb').focus();
			 					$location.path('/producto');
			 				});						
						}
						else
						{
							var datos ={
			    				Accion:"U",
			    				SQL:"UPDATE  ESC_PROD set PRO_NOMB='" + item.PRO_NOMB + "',PRO_CODI_MUES='" + item.PRO_CODI_MUES + "' WHERE PRO_CODI=" + item.PRO_CODI + ""
								}
			 				Execute.SQL(datos).then(function(result) { 			 	
			 					$window.alert('Actualizado');
			 					$location.path('/producto');
			 				});

						}
               }
           });
	}  

}])