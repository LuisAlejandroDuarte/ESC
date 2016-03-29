'use strict';

angular.module('myApp')

.controller('edit-UsuarioCtrl', ['$scope','$location','datosUsuario','Execute','$route','$window', function($scope,$location,datosUsuario,Execute,$route,$window){

	$scope.listTiposUsuario = [
        {'Id':'0','Nombre':'Administrador'},
        {'Id':'1','Nombre':'Juez'},
        {'Id':'2','Nombre':'Lider'}
	]

 var NombreActual;	

	

	if ($route.current.params.idUsuario==0)
	{
		$scope.tiTulo = "Nuevo usuario";
		$scope.buttonText ="Guardar";
	}
	else
	{
		$scope.tiTulo = "Editar usuario";
		$scope.buttonText="Actualizar";
	}



	  datosUsuario.$promise.then(function(datos){   
	  	$scope.Datos = datos[0];	  		
  		NombreActual = datos[0].PER_NOMB;
  		$scope.showTipoJuez =false;
  		if (datos[0].PER_TIPO_JUEZ!=0 && datos[0].PER_TIPO_JUEZ!=null)
  			$scope.showTipoJuez =true;
  		
  			
  		
	  		var tipoJuez ={
	  			Accion:'S',
	  			SQL:'SELECT TJU_CODI,TJU_NOMB FROM ESC_TJUD'
	  			}
	  			$scope.listTipoJuez =[];
	  			Execute.SQL(tipoJuez).then(function(result) { 			
				  $scope.listTipoJuez = result.data;	  		

				  var entidad ={
				  	Accion:"S",
				  	SQL:"SELECT ENT_CODI,ENT_NOMB FROM ESC_ENTI"
				  }
				  $scope.listEntidad =[];
				  Execute.SQL(entidad).then(function(result) { 			
				  	if (result.data[0]!=null)
				  		$scope.listEntidad = result.data;
				  });

	  		});
	  	

	  });


	$scope.volver = function()
	{
		$location.path('/usuario');
	}	

	$scope.onChangeTipoJuez = function()
	{
		$scope.showTipoJuez =false;
		if ($scope.Datos.PER_TIPO=="1")
			$scope.showTipoJuez =true;
	}

	$scope.save = function(item)
	{
			var tj=0; //Tipo Juez
			var idEntidad=0; //Entidad
    			if (item.PER_TIPO==1)
    			{
					tj = $scope.Datos.PER_TIPO_JUEZ;
					idEntidad = $scope.Datos.PER_ENTI_CODI;
    			}
   			if (item.PER_CODI ==undefined)
				{												
					
				
					var datos2 ={
		    			Accion:"I",
		    			SQL:"INSERT INTO ESC_PERS " +
		    			" (PER_NOMB,PER_APEL,PER_DIRE,PER_TELE,PER_USER,PER_TIPO,PER_PASS " + (item.PER_TIPO==1? ",PER_TIPO_JUEZ,PER_ENTI_CODI":"") + ")" +
		    			" VALUES ('" + item.PER_NOMB + "','" + item.PER_APEL + "', " + 
		    			" '" + item.PER_DIRE + "','" + item.PER_TELE + "', " +
		    			" '" + item.PER_USER + "'," + parseInt(item.PER_TIPO) + ",'" + item.PER_PASS + "'" + (item.PER_TIPO==1? "," + tj + "," + idEntidad : "" ) + ")" 
						}

		 			Execute.SQL(datos2).then(function(result) { 					 			 					 		
		 				$window.alert("Ingresado");	
		 				$location.path('/usuario');			
					});
				}		

			else
				{

					
					if (item.PER_PASS!=undefined && item.PER_PASS!="")
					{					
                    var SQL="UPDATE  ESC_PERS set " + (  idEntidad!=0 ? " PER_ENTI_CODI=" + idEntidad + ",":"") +
    					" PER_NOMB='" + item.PER_NOMB + "', " + 
    					" PER_APEL= '"+  item.PER_APEL  + "', " +
    					" PER_DIRE='" + item.PER_DIRE + "', " +
    					" PER_TELE='" + item.PER_TELE + "', " +
    					" PER_USER='" + item.PER_USER + "', " + 
    					" PER_PASS='" + item.PER_PASS + "', "  +
    					" PER_TIPO_JUEZ='" + tj + "', " +    					
    					" PER_TIPO=" + parseInt(item.PER_TIPO) + " "  +     					
    					" WHERE PER_CODI=" + item.PER_CODI + "";
					datos2 ={
    					Accion:"U",
    					SQL:SQL
						}	
					}
					else
					{
						SQL="UPDATE  ESC_PERS set " + ( idEntidad!=0 ? " PER_ENTI_CODI=" + idEntidad + ",":"") +
    					" PER_NOMB='" + item.PER_NOMB + "', " + 
    					" PER_APEL= '"+  item.PER_APEL  + "', " +
    					" PER_DIRE='" + item.PER_DIRE + "', " +
    					" PER_TELE='" + item.PER_TELE + "', " +
    					" PER_USER='" + item.PER_USER + "', " +
    					" PER_TIPO_JUEZ=" + tj + "," +  
    					" PER_TIPO=" + parseInt(item.PER_TIPO) + ""  +   					
    					" WHERE PER_CODI=" + item.PER_CODI + "";
 						datos2 ={
    					Accion:"U",
    					SQL:SQL
						}
					}

 					Execute.SQL(datos2).then(function(result) { 			 				
 					$window.alert("Actualizado");	
 					$location.path('/usuario');
 					});

				}               
	}  
}])