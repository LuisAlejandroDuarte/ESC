'use strict';

angular.module('myApp')

.controller('edit-AtributoCtrl', ['$scope','$location','datosAtributo','Execute','$route','$window', function($scope,$location,datosAtributo,Execute,$route,$window){
	 $("#jqxLoader").jqxLoader({ width: 250, height: 150 });
 var NombreActual;
	var datos ={
		Accion:"S",
		SQL:"SELECT CAR_CODI,CAR_NOMB FROM ESC_CARA"
	}		

	 Execute.SQL(datos).then(function(result) { 
	 	
		$scope.listCaracterizacion = result.data; 	
	 });	

	

	if ($route.current.params.idAtributo==0)
	{
		$scope.tiTulo = "Nuevo Atributo";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar Atributo";
		$scope.buttonText="Actualizar";
	}



	  datosAtributo.$promise.then(function(datos){   

	  	$scope.Datos = datos[0];
	  	NombreActual = datos[0].ATR_NOMB;

	  });


	$scope.volver = function()
	{
		$location.path('/atributo');
	}	


	$scope.save = function(item)
	{
		  $('#jqxLoader').jqxLoader('open');
		 var insertar =
              {
                Accion:"S",
                SQL:"SELECT ATR_NOMB FROM ESC_ATRIB WHERE ATR_NOMB='" + item.ATR_NOMB + "'"
              }
            Execute.SQL(insertar).then(function(result) { 
            if (result.data[0]!=null && NombreActual!=result.data[0].ATR_NOMB)
               {
               	$('#jqxLoader').jqxLoader('close');  
               	 $window.alert('Ya existe el nombre');

               }
               else 
               {
               			if (item.ATR_CODI ==undefined)
							{												
								var datos2 ={
					    			Accion:"I",
					    			SQL:"INSERT INTO ESC_ATRIB (ATR_NOMB,ATR_CARA_CODI) VALUES ('" + item.ATR_NOMB + "'," + item.ATR_CARA_CODI + ")"
									}

					 			Execute.SQL(datos2).then(function(result) { 					 	
					 			$scope.Datos.ATR_NOMB="";
					 			$scope.Datos.ATR_CARA_CODI ="";
					 			$('#idAtrNomb').focus();
					 			$window.alert("Ingresado");	
					 			$('#jqxLoader').jqxLoader('close');  
					 			$location.path('/atributo');

								});
							}		

						else
							{
			 					datos2 ={
			    				Accion:"U",
			    				SQL:"UPDATE  ESC_ATRIB set ATR_NOMB='" + item.ATR_NOMB + "',ATR_CARA_CODI="+  item.ATR_CARA_CODI  + " WHERE ATR_CODI=" + item.ATR_CODI + ""
								}

			 					Execute.SQL(datos2).then(function(result) { 			 				
			 					$window.alert("Actualizado");
			 					$('#jqxLoader').jqxLoader('close');  	
			 					$location.path('/atributo');
			 					});

							}
               }
           });








	}  

}])