'use strict';
 angular.module('myApp')

 .directive('myModaleliminarproductoevento', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString(); 
                     var eliminar ={
                        Accion:"D",
                        SQL:"DELETE FROM ESC_PROD_EVEN WHERE PRE_CONS="+ Codigo
                        }
            
                    $http.post("services/executesql.php",eliminar)
                        .success(function(data) {   
                         $scope.listProductoEvento.splice($('#index')[0].innerText,1);    
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

.controller('productoEventoCtrl', ['$scope','$window','Execute', function($scope,$window,Execute){
	   
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

		var datos ={
    		Accion:"S",
    		SQL:"SELECT PRO_CODI,PRO_NOMB FROM ESC_PROD"
    	}
		
		$scope.listProducto =[];   
    	 Execute.SQL(datos).then(function(result) { 
           if (result.data[0]!=null)           		
    	 	   $scope.listProducto = result.data;    	 	     	    	
    	    var evento ={
    		Accion:"S",
    		SQL:"SELECT EVE_CODI,EVE_NOMB FROM ESC_EVEN"
    	  }
         $scope.listEvento =[];
    	 Execute.SQL(evento).then(function(result) {             

    	 	if (result.data[0]!=null)           		
         		$scope.listEvento = result.data;
                    var lider ={
                        Accion:"S",
                        SQL:"SELECT PER_CODI,concat(PER_NOMB,' ',PER_APEL) AS PER_NOMB FROM ESC_PERS WHERE PER_TIPO=2"
                        }
                    $scope.listLider =[];
                    Execute.SQL(lider).then(function(result) { 
                        if (result.data[0]!=null)
                            $scope.listLider =result.data;    
                    var detalle = {
                        Accion:"S",
                        SQL :"SELECT P.PRO_NOMB,P.PRO_CODI,concat(PER.PER_NOMB, ' ',PER.PER_APEL) AS PER_NOMB," +
                        " PER.PER_CODI,E.EVE_CODI,E.EVE_NOMB,PE.PRE_FECH,PE.PRE_CONS    FROM ESC_PROD_EVEN As PE INNER JOIN  ESC_PROD AS P " +
                        " ON  P.PRO_CODI = PE.PRE_PROD_CODI INNER JOIN ESC_EVEN AS E ON PE.PRE_EVEN_CODI = E.EVE_CODI " +
                        " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI=PE.PRE_LIDE_CODI WHERE PER.PER_TIPO=2"
                    }

                Execute.SQL(detalle).then(function(result) { 
                	if (result.data[0]!=null)
                    	$scope.listProductoEvento = result.data;

                });
                });

    	       });

    	 });

    $scope.onClicEliminar  = function(item,object)
    {
        var datosItem = item;
        if (item.PRE_CONS==-1)
        {
            $scope.listProductoEvento.splice(object.$index,1);
            return;
        }

        var eliminar ={
            Accion:"S",
            SQL:"SELECT JPE_PREV_CONS FROM ESC_JUEZ_PROD_EVEN WHERE JPE_PREV_CONS=" + item.PRE_CONS
        }

         Execute.SQL(eliminar).then(function(result) { 

            if (result.data[0]!=null)
            {
                $window.alert('Exist el registro en la tabla Juez Producto Evento');
            }
            else
            {
                 $('#index').text(object.$index);
                 $('#nombre').text(item.PRO_NOMB + ' ' + item.EVE_NOMB + ' ' + item.PER_NOMB);
                 $('#myModal').data('id', item.PRE_CONS).modal('show');       
                 //$scope.listProductoEvento.splice(object.$index,1);
            }


         });

        
    }        

    $scope.onClicAgregar = function(selProducto,selEvento,selLider,selFecha)    
    {
        if (selProducto==undefined || selProducto=="")
        {
            $window.alert("Seleccione un producto");
            return;
        }

        if (selEvento==undefined || selEvento=="")
        {
            $window.alert("Seleccione un evento");
            return;
        }

        if (selLider==undefined || selLider=="")
        {
            $window.alert("Seleccione un Lider");
            return;
        }

         if (selFecha==undefined || selFecha=="" || selFecha == null )
        {
            $window.alert("Seleccione una Fecha");
            return;
        }

        if ($scope.listProductoEvento==undefined)
        	$scope.listProductoEvento=[];

        var ingresar ={
                PRE_CONS:-1,
        		PRO_CODI:selProducto.PRO_CODI,
        		PRO_NOMB:selProducto.PRO_NOMB,
        		PER_CODI:selLider.PER_CODI,
        		PER_NOMB:selLider.PER_NOMB,
                EVE_CODI:selEvento.EVE_CODI,
                EVE_NOMB:selEvento.EVE_NOMB,
                PRE_FECH:selFecha
        }
        var existe =false;
         angular.forEach($scope.listProductoEvento, function(value, key){

   		   if (value.PRO_CODI==ingresar.PRO_CODI && value.PER_CODI==ingresar.PER_CODI && value.EVE_CODI == ingresar.EVE_CODI)
   		   {
   		   		existe=true;
   		   }
   		});

        if (!existe) 
			$scope.listProductoEvento.splice(0,0,ingresar);
        else
            $window.alert("Ya existe la combinación");
       
    }

    $scope.onClicGuardar = function()
    {    	

    	
         var insertSQL =[]
        angular.forEach($scope.listProductoEvento, function(value, key){

            if (value.PRE_CONS==-1)
            {
                var fechaInicio = new Date(value.PRE_FECH);
                var anno =  fechaInicio.getFullYear();
                var mes =  fechaInicio.getMonth()+1;
                var dia =  fechaInicio.getDate();
                fechaInicio = anno + "-" + mes + "-" + dia; 
                datos ={
                    Accion :"I",
                    SQL:"INSERT INTO ESC_PROD_EVEN (PRE_PROD_CODI,PRE_EVEN_CODI,PRE_LIDE_CODI,PRE_FECH) " +
                      " VALUES (" + value.PRO_CODI + "," + value.EVE_CODI + "," + value.PER_CODI + ",'" + fechaInicio + "')"
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
                          $window.location.href="#/producto-evento";

                        }


                    });  		
    }
}])