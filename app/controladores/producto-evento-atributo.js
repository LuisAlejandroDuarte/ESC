'use strict';
 angular.module('myApp')

.directive('myModaleliminarproductoeventoatributo', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString(); 
                     var eliminar ={
                        Accion:"D",
                        SQL:"DELETE FROM ESC_PROD_EVEN_ATRIB WHERE PEA_CONS="+ Codigo
                        }
            
                    $http.post("services/executesql.php",eliminar)
                        .success(function(data) {   
                         $scope.listProductoEventoAtributo.splice($('#index')[0].innerText,1);    
                        $('#myModal').modal('hide');
                       
                    })
                        .error(function(data) {
                            $('#myModal').modal('hide');
                            alert(data['msg']);                        
            });  
                };
               
            }],

        template : '<div class="modal fade" id="myModal"  tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + 
                    '<div class="modal-dialog">' +
        '<div class="modal-content">' +
            '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                 '<h3 class="modal-title" id="myModalLabel">Advertencia!</h3> ' +
            '</div>' +
            '<div class="modal-body"> ' +
                 '<h4> Desea Borrar ? </h4> ' +
                  '<div><label id="nombre"></label>' +
                   '<div ng-show=false><label id="index"></label>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button ng-click= "afirmaEliminar();" class="btn btn-danger"  id="btnYes" >Si</button>' +
                '<button type="button" class="btn btn-default" data-dismiss="modal"  >No</button>' +
            '</div>' +        
        '</div>' +        
    '</div>' +    
'</div>' +
'</div>',
  
    }
})

.controller('productoEventoAtributoCtrl', ['$scope','$window','Execute', function($scope,$window,Execute){
	   
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
	 	 	     	    	
    	    var productoEvento ={
                Accion:'S',
    		SQL :"SELECT concat(E.EVE_NOMB,'-',P.PRO_NOMB, '-' ,concat(PER.PER_NOMB, ' ',PER.PER_APEL)) AS PRE_NOMB, PE.PRE_CONS " +
            " FROM ESC_PROD_EVEN As PE INNER JOIN  ESC_PROD AS P " +
            " ON  P.PRO_CODI = PE.PRE_PROD_CODI INNER JOIN ESC_EVEN AS E ON PE.PRE_EVEN_CODI = E.EVE_CODI " +
            " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI=PE.PRE_LIDE_CODI WHERE PER.PER_TIPO=2"
    	  }
         $scope.listProductoEvento =[];
    	 Execute.SQL(productoEvento).then(function(result) {             

    	 	if (result.data[0]!=null)           		
         		$scope.listProductoEvento = result.data;
                    var juez ={
                        Accion:"S",
                        SQL:"SELECT PER_CODI,concat(PER_NOMB,' ',PER_APEL) AS PER_NOMB FROM ESC_PERS WHERE PER_TIPO=1"
                        }
                    $scope.listJuez =[];
                    Execute.SQL(juez).then(function(result) { 
                        if (result.data[0]!=null)
                            $scope.listJuez =result.data;   

                       var atributo ={
                            Accion  :"S",
                            SQL:"SELECT ATR_CODI,ATR_NOMB FROM ESC_ATRIB"
                       } 

                       $scope.listAtributo=[];
                       Execute.SQL(atributo).then(function(result) { 
                            if (result.data[0]!=null)
                                $scope.listAtributo =  result.data;

                            var escalaEvaluacion ={
                                Accion:"S",
                                SQL:"SELECT EEV_CONS,EEV_CALI FROM ESC_ESCA_EVAL"
                            }

                            $scope.listEscalaEvaluacion=[];
                            Execute.SQL(escalaEvaluacion).then(function(result) { 
                                if (result.data[0]!=null)
                                    $scope.listEscalaEvaluacion = result.data;

                                  var detalle = {
                                        Accion:"S",
                                        SQL :"SELECT PEA.PEA_CONS, " + 
                                        " concat(PER2.PER_NOMB, ' ',PER2.PER_APEL) AS JUEZ_NOMB, PER2.PER_CODI AS JUEZ_CODI, concat(E.EVE_NOMB,'-',P.PRO_NOMB, '-' ,concat(PER.PER_NOMB, ' ',PER.PER_APEL)) AS PRE_NOMB, PE.PRE_CONS, " +
                                        " A.ATR_CODI,A.ATR_NOMB,EEV.EEV_CONS,EEV.EEV_CALI " +
                                        " FROM ESC_PROD_EVEN As PE INNER JOIN  ESC_PROD AS P " +
                                        " ON  P.PRO_CODI = PE.PRE_PROD_CODI INNER JOIN ESC_EVEN AS E ON PE.PRE_EVEN_CODI = E.EVE_CODI " +
                                        " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI=PE.PRE_LIDE_CODI INNER JOIN ESC_PROD_EVEN_ATRIB AS PEA ON " +
                                        " PEA.PEA_PREV_CONS=PE.PRE_CONS INNER JOIN ESC_PERS AS PER2 ON PER2.PER_CODI = PEA.PEA_JUEZ_CODI INNER JOIN ESC_ATRIB AS A ON " +
                                        " A.ATR_CODI = PEA.PEA_ATRI_CODI INNER JOIN ESC_ESCA_EVAL AS EEV ON EEV.EEV_CONS = PEA.PEA_ESEV_CONS  WHERE PER.PER_TIPO=2"
                                        }

                                        $scope.listProductoEventoAtributo = [];
                                        Execute.SQL(detalle).then(function(result) { 
                                        if (result.data[0]!=null)
                                            $scope.listProductoEventoAtributo = result.data;

                                        });
                            });

                       });


                  
                });

    	       });

 

    $scope.onClicEliminar  = function(item,object)
    {
        var datosItem = item;
        if (item.PEA_CONS==-1)
        {
            $scope.listProductoEventoAtributo.splice(object.$index,1);
            return;
        }
        else
        {
            $('#index').text(object.$index);
            $('#nombre').text(item.PRE_NOMB);
            $('#myModal').data('id', item.PEA_CONS).modal('show');                                                  
        }
        
    }        

    $scope.onClicAgregar = function(selProductoEvento,selAtributo,selEscalaEvaluacion,selJuez)    
    {        

         if (selProductoEvento==undefined || selProductoEvento=="")
        {
            $window.alert("Seleccione un Producto Evento");
            return;
        }

        if (selAtributo==undefined || selAtributo=="")
        {
            $window.alert("Seleccione un Atributo");
            return;
        }

         if (selEscalaEvaluacion==undefined || selEscalaEvaluacion=="")
        {
            $window.alert("Seleccione una Escala Evaluación");
            return;
        }

         if (selJuez==undefined || selJuez=="")
        {
            $window.alert("Seleccione Juez");
            return;
        }



        if ($scope.listProductoEventoAtributo==undefined)
        	$scope.listProductoEventoAtributo=[];

        var ingresar ={
                PEA_CONS:-1,
                PRE_CONS:selProductoEvento.PRE_CONS,
                PRE_NOMB : selProductoEvento.PRE_NOMB,
        		ATR_CODI:selAtributo.ATR_CODI,
                ATR_NOMB:selAtributo.ATR_NOMB,
                EEV_CONS:selEscalaEvaluacion.EEV_CONS,
                EEV_CALI:selEscalaEvaluacion.EEV_CALI,
        		JUEZ_CODI:selJuez.PER_CODI,
                JUEZ_NOMB:selJuez.PER_NOMB            
        }
        var existe =false;
         angular.forEach($scope.listJuezEvento, function(value, key){

   		   if (value.PRE_CONS==ingresar.PRE_CONS && value.ATR_CODI==ingresar.ATR_CODI && 
                value.EEV_CONS==ingresar.EEV_CONS && value.PEA_JUEZ_CODI==ingresar.PEA_JUEZ_CODI )
   		   {
   		   		existe=true;
   		   }
   		});

        if (!existe) 
			$scope.listProductoEventoAtributo.splice(0,0,ingresar);
        else
            $window.alert("Ya existe la combinación");
       
    }

    $scope.onClicGuardar = function()
    {    	

    	
         var insertSQL =[]
        angular.forEach($scope.listProductoEventoAtributo, function(value, key){

            if (value.PEA_CONS==-1)
            {
               
               var datos ={
                    Accion :"I",
                    SQL:"INSERT INTO ESC_PROD_EVEN_ATRIB (PEA_PREV_CONS,PEA_ATRI_CODI,PEA_ESEV_CONS,PEA_JUEZ_CODI) " +
                      " VALUES (" + value.PRE_CONS + "," + value.ATR_CODI + "," +  value.EEV_CONS + "," + value.JUEZ_CODI + ")"
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
                        {
                         $window.alert("Actualizado");   
                         $window.location.href="#/menu";
                          $window.location.href="#/productoEventoAtributo";
                        }

                    });  		
    }
}])