'use strict';
 angular.module('myApp')
.directive('myModalproducto', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http','Execute', function($scope,$window,$http,Execute) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString(); 

                      var eliminar =
                          {
                            Accion:"S",
                            SQL:"SELECT CPR_PROD_CODI FROM ESC_CARA_PROD WHERE CPR_PROD_CODI=" + Codigo
                          }

                          Execute.SQL(eliminar).then(function(result) { 
                          if (result.data[0]!=null)
                             {
                                  $window.alert("El Producto está relacionada con Caracterización Productos, no se puede eliminar");
                                  $('#myModal').modal('hide');
                             }
                             else
                             {
                                 var datos ={
                                      Accion:'D',
                                      SQL:'DELETE FROM ESC_PROD' +
                                      " WHERE PRO_CODI = " + Codigo
                                    } 
                                $http.post("services/executesql.php",datos)
                                .success(function(data) {  

                                $('#tableproducto').bootstrapTable('remove', {
                                    field: 'PRO_CODI',
                                    values: [Codigo]
                                     });            
                                        $('#myModal').modal('hide');                       
                                })
                                .error(function(data) {
                                    $('#myModal').modal('hide');
                                    alert(data['msg']);                        
                                });  
                             }
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
                 '<h4> Desea Borrar el producto? </h4> ' +
                  '<div><label id="nombreproducto"></label>' +
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




.directive('initTablaproducto', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablaproducto);   
            		opts.onLoadSuccess = function() {
                		$compile(el.contents())(scope); 
            };
             el.bootstrapTable(opts);
              scope.$watch(el, function (bstable) {
                    $compile(el.contents())(scope);
                });    
                el.bind('body-changed.bs.table', function () {
                    var body = el.find('tbody')[0];
                    console.log('get here one more time');
                    $compile(body)(scope);
                });
            }
        }
    }])




 .controller('productoCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {
            
       var datos ={
            Accion:"S",
           SQL:"SELECT PRO_CODI,PRO_NOMB,PRO_CODI_MUES FROM ESC_PROD "
        }

        $scope.options = {                                    
                cache: false,   
                data:[{}],               
                height: 500,
                striped: true,
                pagination: true,                
                pageList: [10, 25, 50, 100, 200],
                search: true,
                showColumns: true,
                showRefresh: true,
                minimumCountColumns: 1,
                clickToSelect: true,
                idField:'CAR_CODI',                
                toolbar: '#custom-toolbarproducto',
            columns: [{
                field: 'PRO_CODI',
                title: 'Código',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'PRO_NOMB',
                title: 'NOMBRE',
                align: 'left',
                valign: 'middle',
                width: 800,
                sortable: true
            }, {
                field: 'PRO_CODI_MUES',
                title: 'Código',
                align: 'left',
                valign: 'middle',
                width: 200,
                sortable: true
            }, {
                title: '',
                width: 100,
                switchable:false,
                formatter: function(value, row, index) {

                       return '<a class="edit ml10 btn btn-default btn-xs" title="Editar"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp; ' +
                    '<a class="remove ml10 btn btn-default btn-xs" title="Eliminar" ><span class="glyphicon glyphicon-trash"></span></a>';

                },
                events:  window.operateEvents = {
                        'click .remove': function (e, value, row, index) {
                                $('#nombreproducto').text(row.PRO_NOMB);
                                  $('#myModal').data('id', row.PRO_CODI).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-producto/" + row.PRO_CODI + "";                           
                        }

                }



            }]
        };   

         Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tableproducto').bootstrapTable('load',result.data);
            else
                $('#tableproducto').bootstrapTable('load',[]);      

});
        //  $('#tableproducto').bootstrapTable('removeAll');
        //         $('#tableproducto').bootstrapTable('append',result.data);        

        // });


        
        // //     var json =[{'CAR_CODI':1,'CAR_NOMB':'Nombre1'}];
        //   var datos ={
        //    Accion:"S",
        //    SQL:"SELECT CAR_CODI,CAR_NOMB FROM CACAO.ESC_CARA "
        //     }
        // Execute.SQL(datos).then(function(result) {                         
 
        //  $('#tableproducto').bootstrapTable('removeAll');
        //         $('#tableproducto').bootstrapTable('append',result.data);

        //   var datos = $scope.options;      

        // });




         

    }])

	.controller('ListControllerproducto', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-producto/0";
        };            
    }]);

