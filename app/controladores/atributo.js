'use strict';
 angular.module('myApp')
.directive('myModalatributo', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString();                       
                      var datos ={
                           Accion:'D',
                           SQL:'DELETE FROM ESC_ATRIB' +
                                " WHERE ATR_CODI = " + Codigo
                      } 
                    $http.post("services/executesql.php",datos)
                        .success(function(data) {  

                        $('#tableatributo').bootstrapTable('remove', {
                                field: 'ATR_CODI',
                                values: [Codigo]
                        });                             
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
                 '<h4> Desea Borrar el atributo? </h4> ' +
                  '<div><label id="nombreatributo"></label>' +
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




.directive('initTablaatributo', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablaatributo);   
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




 .controller('atributoCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {
            
     

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
                toolbar: '#custom-toolbaratributo',
            columns: [{
                field: 'ATR_CODI',
                title: 'Código',
                align: 'left',
                valign: 'middle',               
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'Atributo',
                title: 'Atributo',
                align: 'left',
                valign: 'middle',
                width: 500,
                sortable: true
            },{
                field: 'Caracterizacion',
                title: 'Caracterización',
                align: 'left',
                valign: 'middle',
                width: 500,
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
                                $('#nombreatributo').text(row.Atributo);
                                  $('#myModal').data('id', row.ATR_CODI).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-atributo/" + row.ATR_CODI + "";                           
                        }

                }



            }]
        };   
          var datos ={
            Accion:"S",
           SQL:"SELECT ATR_CODI,ATR_NOMB As Atributo,C.CAR_NOMB As Caracterizacion FROM ESC_ATRIB AS A INNER  JOIN ESC_CARA AS C " +
               " ON C.CAR_CODI =A.ATR_CARA_CODI"
        }

        Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tableatributo').bootstrapTable('load',result.data);
            else
                $('#tableatributo').bootstrapTable('load',[]);

});       

 
         

    }])

	.controller('ListControlleratributo', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-atributo/0";
        };            
    }]);

