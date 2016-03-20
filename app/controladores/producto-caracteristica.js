'use strict';
 angular.module('myApp')

.controller('productoCaracteristicaCtrl', ['$scope','$window','Execute', function($scope,$window,Execute){
	   
    $scope.settingsPanel ={
         width: 950,
         height: 300,
         autoUpdate:true
    }

    $scope.jqxButtonsSettings ={

    }

		var datos ={
    		Accion:"S",
    		SQL:"SELECT PRO_CODI,CONCAT(PRO_NOMB,' ',PRO_CODI_MUES) AS Nombre FROM ESC_PROD"
    	}
		
		$scope.listProducto =[];   
    	 Execute.SQL(datos).then(function(result) { 
           if (result.data[0]!=null)           		
    	 	   $scope.listProducto = result.data;    	 	     	    	
    	    var care ={
    		Accion:"S",
    		SQL:"SELECT CAR_CODI,CAR_NOMB FROM ESC_CARA"
    	  }
         $scope.listCaracteristica =[];
    	 Execute.SQL(care).then(function(result) { 
    	 	if (result.data[0]!=null)           		
         		$scope.listCaracteristica = result.data;

            var detalle = {
                Accion:"S",
                SQL :"SELECT P.PRO_NOMB As Nombre,C.CAR_NOMB,P.PRO_CODI,C.CAR_CODI FROM ESC_CARA_PROD As CP INNER JOIN  ESC_PROD AS P ON " +
                    " P.PRO_CODI = CP.CPR_PROD_CODI INNER JOIN ESC_CARA AS C ON C.CAR_CODI = CP.CPR_CARA_CODI "
            }

                Execute.SQL(detalle).then(function(result) { 
                	if (result.data[0]!=null)
                    	$scope.listProductoCaracteristica = result.data;

                });


    	 });

    	 });

    $scope.onClicEliminar  = function(item,object)
    {
        var datosItem = item;
        $scope.listProductoCaracteristica.splice(object.$index,1);
        
    }        

    $scope.onClicAgregar = function(selProducto,selCaracterizacion)    
    {
        if (selProducto==undefined || selProducto=="")
        {
            $window.alert("Seleccione un producto");
            return;
        }

        if (selCaracterizacion==undefined || selCaracterizacion=="")
        {
            $window.alert("Seleccione una característica");
            return;
        }

        if ($scope.listProductoCaracteristica==undefined)
        	$scope.listProductoCaracteristica=[];

        var ingresar ={
        		PRO_CODI:selProducto.PRO_CODI,
        		Nombre:selProducto.Nombre,
        		CAR_CODI:selCaracterizacion.CAR_CODI,
        		CAR_NOMB:selCaracterizacion.CAR_NOMB
        }
        var existe =false;
         angular.forEach($scope.listProductoCaracteristica, function(value, key){

   		   if (value.PRO_CODI==ingresar.PRO_CODI && value.CAR_CODI==ingresar.CAR_CODI)
   		   {
   		   		existe=true;
   		   }
   		});

        if (!existe) 
			$scope.listProductoCaracteristica.splice(0,0,ingresar);
        else
            $window.alert("Ya existe la combinación");
       
    }

    $scope.onClicGuardar = function()
    {
    	var datos = [];

    	datos ={
		 	Accion:"D",
		  	SQL:"DELETE FROM ESC_CARA_PROD "
		}	

		 Execute.SQL(datos).then(function(result) { 

		 	if (result.data[0].estado=="ok")
		 	{
                var insertSQL =[]
		 		angular.forEach($scope.listProductoCaracteristica, function(value, key){
		  		datos ={
		  				Accion :"I",
		  				SQL:"INSERT INTO ESC_CARA_PROD (CPR_CARA_CODI,CPR_PROD_CODI) " +
		  				" VALUES (" + value.CAR_CODI + "," + value.PRO_CODI + ")"
		  				}
                insertSQL.splice(0,0,datos);                        		  				  	 
		  		});

                Execute.SQLMulti(insertSQL).then(function(result) { 

                        if (result.data[0]=="fallo")
                        {
                            $window.alert(result.data[0].msg);
                        }
                        else
                         $window.alert("Actualizado");   

                    });         	
		 	}
		 	else
		 	{
    			$window.alert(result.data[0].msg);
		 	}

		 });



    	
		 
    }

   

}])