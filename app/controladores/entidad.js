'use strict';
 angular.module('myApp')
.directive('myModalentidad', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString(); 
                      var datos ={
                           Accion:'D',
                           SQL:'DELETE FROM ESC_ENTI' +
                                " WHERE ENT_CODI = " + Codigo
                      } 
                    $http.post("services/executesql.php",datos)
                        .success(function(data) {  

                        $('#tableentidad').bootstrapTable('remove', {
                                field: 'ENT_CODI',
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
                 '<h4> Desea Borrar la entidad? </h4> ' +
                  '<div><label id="nombreentidad"></label>' +
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




.directive('initTablaentidad', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablaentidad);   
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




 .controller('entidadCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {
            
       var datos ={
            Accion:"S",
           SQL:"SELECT ENT_CODI,ENT_NOMB FROM ESC_ENTI "
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
                toolbar: '#custom-toolbarentidad',
            columns: [{
                field: 'ENT_CODI',
                title: 'Código',
                align: 'left',
                valign: 'middle',
                width: 100,
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'ENT_NOMB',
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
                                $('#nombreentidad').text(row.ENT_NOMB);
                                  $('#myModal').data('id', row.ENT_CODI).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-entidad/" + row.ENT_CODI + "";                           
                        }

                }



            }]
        };   

        Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tableentidad').bootstrapTable('load',result.data);
            else
                $('#tableentidad').bootstrapTable('load',[]);          

});
        //  $('#tableentidad').bootstrapTable('removeAll');
        //         $('#tableentidad').bootstrapTable('append',result.data);        

        // });


        
        // //     var json =[{'CAR_CODI':1,'CAR_NOMB':'Nombre1'}];
        //   var datos ={
        //    Accion:"S",
        //    SQL:"SELECT CAR_CODI,CAR_NOMB FROM CACAO.ESC_CARA "
        //     }
        // Execute.SQL(datos).then(function(result) {                         
 
        //  $('#tableentidad').bootstrapTable('removeAll');
        //         $('#tableentidad').bootstrapTable('append',result.data);

        //   var datos = $scope.options;      

        // });




         

    }])

	.controller('ListControllerentidad', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-entidad/0";
        };            
    }]);

