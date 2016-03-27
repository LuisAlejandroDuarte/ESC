'use strict';
 angular.module('myApp')

.controller('juezProductoEventoCtrl', ['$scope','$window','Execute', function($scope,$window,Execute){
	   
    $scope.settingsPanel ={
         width: 1100,
         height: 300,
         autoUpdate:true
    }

    $scope.settingsDate =
    {
        culture: 'es-ES',
        formatString: 'dd-MMM-yyyy',
        value :null 
    }   
    $scope.jqxButtonsSettings ={

    }
	 	 	     	    	
    	    var evento ={
                Accion:'S',
    		SQL :"SELECT concat(E.EVE_NOMB,'-',P.PRO_NOMB, '-' ,concat(PER.PER_NOMB, ' ',PER.PER_APEL)) AS PRE_NOMB, PE.PRE_CONS " +
            " FROM ESC_PROD_EVEN As PE INNER JOIN  ESC_PROD AS P " +
            " ON  P.PRO_CODI = PE.PRE_PROD_CODI INNER JOIN ESC_EVEN AS E ON PE.PRE_EVEN_CODI = E.EVE_CODI " +
            " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI=PE.PRE_LIDE_CODI WHERE PER.PER_TIPO=2"
    	  }
         $scope.listEvento =[];
    	 Execute.SQL(evento).then(function(result) {             

    	 	if (result.data[0]!=null)           		
         		$scope.listEvento = result.data;
                    var juez ={
                        Accion:"S",
                        SQL:"SELECT PER_CODI,concat(PER_NOMB,' ',PER_APEL) AS PER_NOMB FROM ESC_PERS WHERE PER_TIPO=1"
                        }
                    $scope.listJuez =[];
                    Execute.SQL(juez).then(function(result) { 
                        if (result.data[0]!=null)
                            $scope.listJuez =result.data;    
                    var detalle = {
                        Accion:"S",
                        SQL :"SELECT JPE.JPE_CONS AS CONS, " + 
                        " concat(PER2.PER_NOMB, ' ',PER2.PER_APEL) AS JUEZ_NOMB, PER2.PER_CODI AS JUEZ_CODI, concat(E.EVE_NOMB,'-',P.PRO_NOMB, '-' ,concat(PER.PER_NOMB, ' ',PER.PER_APEL)) AS PRE_NOMB, PE.PRE_CONS " +
                        " FROM ESC_PROD_EVEN As PE INNER JOIN  ESC_PROD AS P " +
                        " ON  P.PRO_CODI = PE.PRE_PROD_CODI INNER JOIN ESC_EVEN AS E ON PE.PRE_EVEN_CODI = E.EVE_CODI " +
                        " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI=PE.PRE_LIDE_CODI INNER JOIN ESC_JUEZ_PROD_EVEN AS JPE ON " +
                        " JPE.JPE_PREV_CONS=PE.PRE_CONS INNER JOIN ESC_PERS AS PER2 ON PER2.PER_CODI = JPE.JPE_JUEZ_CODI WHERE PER.PER_TIPO=2"
                    }

                Execute.SQL(detalle).then(function(result) { 
                	if (result.data[0]!=null)
                    	$scope.listJuezEvento = result.data;

                });
                });

    	       });

 

    $scope.onClicEliminar  = function(item,object)
    {
        var datosItem = item;
        if (item.CONS==-1)
        {
            $scope.listJuezEvento.splice(object.$index,1);
            return;
        }
       

        
    }        

    $scope.onClicAgregar = function(selJuez,selEvento)    
    {        

         if (selJuez==undefined || selJuez=="")
        {
            $window.alert("Seleccione un Juez");
            return;
        }

        if (selEvento==undefined || selEvento=="")
        {
            $window.alert("Seleccione un evento");
            return;
        }

       

        if ($scope.listJuezEvento==undefined)
        	$scope.listJuezEvento=[];

        var ingresar ={
                CONS:-1,
        		JUEZ_CODI:selJuez.PER_CODI,
                JUEZ_NOMB:selJuez.PER_NOMB,
        		PREV_CONS:selEvento.PRE_CONS,      		
                PRE_NOMB:selEvento.PRE_NOMB
        }
        var existe =false;
         angular.forEach($scope.listJuezEvento, function(value, key){

   		   if (value.JUEZ_CODI==ingresar.JUEZ_CODI && value.PREV_CONS==ingresar.PREV_CONS)
   		   {
   		   		existe=true;
   		   }
   		});

        if (!existe) 
			$scope.listJuezEvento.splice(0,0,ingresar);
        else
            $window.alert("Ya existe la combinación");
       
    }

    $scope.onClicGuardar = function()
    {    	

    	
         var insertSQL =[]
        angular.forEach($scope.listJuezEvento, function(value, key){

            if (value.CONS==-1)
            {
               
               var datos ={
                    Accion :"I",
                    SQL:"INSERT INTO ESC_JUEZ_PROD_EVEN (JPE_JUEZ_CODI,JPE_PREV_CONS) " +
                      " VALUES (" + value.JUEZ_CODI + "," + value.PREV_CONS + ")"
                   }
                 insertSQL.splice(0,0,datos);
            }
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
}])