'use strict';
 angular.module('myApp')
.directive('myModaltipojuez', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString();                       
                      var datos ={
                           Accion:'D',
                           SQL:'DELETE FROM ESC_JUEZ_TJUD' +
                                " WHERE JTJ_CONS = " + Codigo
                      } 
                    $http.post("services/executesql.php",datos)
                        .success(function(data) {  

                        $('#tabletipojuez').bootstrapTable('remove', {
                                field: 'JTJ_CONS',
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
                 '<h4> Desea Borrar el tipojuez? </h4> ' +
                  '<div><label id="nombretipojuez"></label>' +
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




.directive('initTablatipojuez', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablatipojuez);   
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




 .controller('tipojuezCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {
            
     

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
                idField:'JTJ_CONS',                
                toolbar: '#custom-toolbartipojuez',
            columns: [{
                field: 'ATR_CODI',
                title: 'Código',
                align: 'left',
                valign: 'middle',               
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'tipojuez',
                title: 'tipojuez',
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
                                $('#nombretipojuez').text(row.tipojuez);
                                  $('#myModal').data('id', row.ATR_CODI).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-tipojuez/" + row.ATR_CODI + "";                           
                        }

                }



            }]
        };   
          var datos ={
            Accion:"S",
           SQL:"SELECT ATR_CODI,ATR_NOMB As tipojuez,C.CAR_NOMB As Caracterizacion FROM ESC_ATRIB AS A INNER  JOIN ESC_CARA AS C " +
               " ON C.CAR_CODI =A.ATR_CARA_CODI"
        }

        Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tabletipojuez').bootstrapTable('load',result.data);
            else
                $('#tabletipojuez').bootstrapTable('load',[]);

});
        //  $('#tabletipojuez').bootstrapTable('removeAll');
        //         $('#tabletipojuez').bootstrapTable('append',result.data);        

        // });


        
        // //     var json =[{'CAR_CODI':1,'CAR_NOMB':'Nombre1'}];
        //   var datos ={
        //    Accion:"S",
        //    SQL:"SELECT CAR_CODI,CAR_NOMB FROM CACAO.ESC_CARA "
        //     }
        // Execute.SQL(datos).then(function(result) {                         
 
        //  $('#tabletipojuez').bootstrapTable('removeAll');
        //         $('#tabletipojuez').bootstrapTable('append',result.data);

        //   var datos = $scope.options;      

        // });




         

    }])

	.controller('ListControllertipojuez', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-tipojuez/0";
        };            
    }]);

