'use strict';
 angular.module('myApp')
.directive('myModalcaracterizacion', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http','Execute', function($scope,$window,$http,Execute) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString(); 

                      var eliminar =
                      {
                        Accion:"S",
                        SQL:"SELECT ATR_CARA_CODI FROM ESC_ATRIB WHERE ATR_CARA_CODI=" + Codigo
                      }

                        Execute.SQL(eliminar).then(function(result) { 
                            if (result.data[0]!=null)
                            {
                                $window.alert("La actual Caracterización está relacionada con Atributos, no se puede eliminar");
                                   $('#myModal').modal('hide');
                            }
                            else
                            {                                
                                 eliminar =
                                    {
                                        Accion:"S",
                                        SQL:"SELECT CPR_CARA_CODI FROM ESC_CARA_PROD WHERE CPR_CARA_CODI=" + Codigo
                                    }

                                    Execute.SQL(eliminar).then(function(result) { 
                                    if (result.data[0]!=null)
                                        {
                                            $window.alert("La actual Caracterización está relacionada con Caracterización Productos, no se puede eliminar");
                                            $('#myModal').modal('hide');
                                        }
                                        else
                                        {
                                               var datos ={
                                                Accion:'D',
                                                SQL:'DELETE FROM ESC_CARA' +
                                                " WHERE CAR_CODI = " + Codigo
                                                } 
                                                $http.post("services/executesql.php",datos)
                                                .success(function(data) {  

                                                $('#tablecaracterizacion').bootstrapTable('remove', {
                                                    field: 'CAR_CODI',
                                                    values: [Codigo]
                                                });            
                                                $('#myModal').modal('hide');                                 
                                   
                                                })
                                        }
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
                 '<h4> Desea Borrar la caracterización? </h4> ' +
                  '<div><label id="nombreCaracterizacion"></label>' +
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




.directive('initTablacaracterizacion', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablacaracterizacion);   
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




 .controller('CaracterizacionCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {
            
       var datos ={
            Accion:"S",
           SQL:"SELECT CAR_CODI,CAR_NOMB FROM ESC_CARA "
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
                minimumCountColumns: 2,
                clickToSelect: true,
                idField:'CAR_CODI',                
                toolbar: '#custom-toolbarcaracterizacion',
            columns: [{
                field: 'CAR_CODI',
                title: 'Código',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'CAR_NOMB',
                title: 'NOMBRE',
                align: 'left',
                valign: 'middle',
                width: 2000,
                sortable: true
            }, {
                title: '',
                width: 200,
                switchable:false,
                formatter: function(value, row, index) {

                       return '<a class="edit ml10 btn btn-default btn-xs" title="Editar"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp; ' +
                    '<a class="remove ml10 btn btn-default btn-xs" title="Eliminar" ><span class="glyphicon glyphicon-trash"></span></a>';

                },
                events:  window.operateEvents = {
                        'click .remove': function (e, value, row, index) {
                                $('#nombreCaracterizacion').text(row.CAR_NOMB);
                                  $('#myModal').data('id', row.CAR_CODI).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-caracterizacion/" + row.CAR_CODI + "";                           
                        }

                }



            }]
        };   

         Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tablecaracterizacion').bootstrapTable('load',result.data);
            else
                $('#tablecaracterizacion').bootstrapTable('load',[]);
        

});
        //  $('#tablecaracterizacion').bootstrapTable('removeAll');
        //         $('#tablecaracterizacion').bootstrapTable('append',result.data);        

        // });


        
        // //     var json =[{'CAR_CODI':1,'CAR_NOMB':'Nombre1'}];
        //   var datos ={
        //    Accion:"S",
        //    SQL:"SELECT CAR_CODI,CAR_NOMB FROM CACAO.ESC_CARA "
        //     }
        // Execute.SQL(datos).then(function(result) {                         
 
        //  $('#tablecaracterizacion').bootstrapTable('removeAll');
        //         $('#tablecaracterizacion').bootstrapTable('append',result.data);

        //   var datos = $scope.options;      

        // });




         

    }])

	.controller('ListControllerCaracterizacion', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-caracterizacion/0";
        };            
    }]);

