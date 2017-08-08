'use strict';
 angular.module('myApp')
.directive('myModalparametroevaluacion', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString(); 
                      var datos ={
                           Accion:'D',
                           SQL:'DELETE FROM ESC_PARA_EVAL' +
                                " WHERE PEV_CONS = " + Codigo
                      } 
                    $http.post("services/executesql.php",datos)
                        .success(function(data) {  

                        $('#tableparametroevaluacion').bootstrapTable('remove', {
                                field: 'PEV_CONS',
                                values: Codigo
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
                 '<h4> Desea Borrar el Parámetro Evaluación? </h4> ' +
                  '<div><label id="nombreparametroevaluacion"></label>' +
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




.directive('initTablaparametroevaluacion', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablaparametroevaluacion);   
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




 .controller('parametroEvaluacionCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {
            
       var datos ={
            Accion:"S",
           SQL:"SELECT PEV_CONS,PEV_DESC FROM esc_para_eval"
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
                idField:'PEV_CONS',                
                toolbar: '#custom-toolbarparametroevaluacion',
            columns: [{
                field: 'PEV_CONS',
                title: 'Código',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'PEV_DESC',
                title: 'DESCRIPCIÓN',
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
                                $('#nombreparametroevaluacion').text(row.PEV_DESC);
                                  $('#myModal').data('id', row.PEV_CONS).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-parametroEvaluacion/" + row.PEV_CONS + "";                           
                        }

                }



            }]
        };   

        Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tableparametroevaluacion').bootstrapTable('load',result.data);
            else
                $('#tableparametroevaluacion').bootstrapTable('load',[]);          

    });         

}])

	.controller('ListControllerParametroEvaluacion', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-parametroEvaluacion/0";
        };            
    }])

