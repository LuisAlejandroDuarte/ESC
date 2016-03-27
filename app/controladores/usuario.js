'use strict';
 angular.module('myApp')
.directive('myModalusuario', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString();   

                      var existe = {
                        Accion:'S',
                        SQL:"SELECT PER_TIPO FROM ESC_PERS " + 
                        " WHERE PER_CODI=" + Codigo
                      }
                      $http.post("services/executesql.php",existe)
                        .success(function(data) { 
                        if (data[0].PER_TIPO!=0)
                        {
                            var datos ={
                            Accion:'D',
                            SQL:'DELETE FROM ESC_PERS' +
                            " WHERE PER_CODI = " + Codigo 
                            } 
                            $http.post("services/executesql.php",datos)
                            .success(function(data) {  

                            $('#tableusuario').bootstrapTable('remove', {
                                    field: 'PER_CODI',
                                    values: [Codigo]
                            });                             
                            $('#myModal').modal('hide');
                       
                            })
                            .error(function(data) {
                                $('#myModal').modal('hide');
                                alert(data['msg']);                        
                            });    
                        }
                        else
                        {
                            $window.alert("No se puede eliminar Administrador");
                              $('#myModal').modal('hide');
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
                 '<h4> Desea Borrar el usuario? </h4> ' +
                  '<div><label id="nombreusuario"></label>' +
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




.directive('initTablausuario', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablausuario);   
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




 .controller('usuarioCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {


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
                idField:'PER_CODI',                
                toolbar: '#custom-toolbarusuario',
            columns: [{
                field: 'PER_CODI',
                title: 'Código',
                align: 'left',
                valign: 'middle',               
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'PER_NOMB',
                title: 'Nombre',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true
            },{
                field: 'PER_APEL',
                title: 'Apellido',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true
            },{
                field: 'PER_DIRE',
                title: 'Dirección',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true
            },{
                field: 'PER_TELE',
                title: 'Teléfono',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true
            },{
                field: 'PER_USER',
                title: 'Usuario',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true
            },{
                field: 'PER_TIPO',
                title: 'TIPO',
                align: 'left',
                valign: 'middle',
                width: 100,
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
                                $('#nombreusuario').text(row.PER_NOMB);
                                  $('#myModal').data('id', row.PER_CODI).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-usuario/" + row.PER_CODI + "";                           
                        }

                }



            }]
        };   
          var datos ={
            Accion:"S",
           SQL:"SELECT PER_CODI,PER_NOMB ,PER_APEL,PER_DIRE,PER_USER, PER_TELE," +
           " CASE PER_TIPO WHEN 0 THEN 'Administrador' " +
           " WHEN 1 THEN 'Juez' WHEN 2 THEN 'Lider' END AS PER_TIPO  FROM ESC_PERS"
        }

        Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tableusuario').bootstrapTable('load',result.data);
            else
                $('#tableusuario').bootstrapTable('load',[]);

});
      
         

    }])

	.controller('ListControllerusuario', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-usuario/0";
        };            
    }]);

