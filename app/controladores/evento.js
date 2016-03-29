'use strict';
 angular.module('myApp')
.directive('myModalevento', function() {
       return {
        restrict : 'AE',    
        controller: [ "$scope","$window",'$http', function($scope,$window,$http) {
            $scope.afirmaEliminar = function() {
                      var Codigo = $('#myModal').data('id').toString();                       
                      var datos ={
                           Accion:'D',
                           SQL:'DELETE FROM ESC_EVEN' +
                                " WHERE EVE_CODI = " + Codigo
                      } 
                    $http.post("services/executesql.php",datos)
                        .success(function(data) {  

                        $('#tableevento').bootstrapTable('remove', {
                                field: 'EVE_CODI',
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
                 '<h4> Desea Borrar el evento? </h4> ' +
                  '<div><label id="nombreevento"></label>' +
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




.directive('initTablaevento', ['$compile', function($compile) {
        return {
            restrict: 'A',

 			link: function(scope, el, attrs) {
            		var opts = scope.$eval(attrs.initTablaevento);   
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




 .controller('eventoCtrl', ['$scope','$window','Execute', function($scope,$window,Execute) {
            
     

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
                idField:'EVE_CODI',                
                toolbar: '#custom-toolbarevento',
            columns: [{
                field: 'EVE_CODI',
                title: 'Código',
                align: 'left',
                valign: 'middle',               
                sortable: true,
                visible:false,
                switchable:false
            }, {
                field: 'EVE_NOMB',
                title: 'Nombre',
                align: 'left',
                valign: 'middle',
                width: 200,
                sortable: true
            },{
                field: 'EVE_DIRE',
                title: 'Dirección',
                align: 'left',
                valign: 'middle',
                width: 200,
                sortable: true
            },{
                field: 'EVE_FECH_INIC',
                title: 'Fecha Inicio',
                align: 'left',
                valign: 'middle',
                width: 200,
                sortable: true,
                 formatter: function(value, row, index) {
                    
                       var Meses =["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
                       var fechaInicio =new Date(value);
                       var anno = fechaInicio.getFullYear();
                       var mes =  Meses[fechaInicio.getMonth()];
                       var dia =  fechaInicio.getDate()+1; 
                       return '<label name="elementname" style="font-weight:100">'+ dia + '-' + mes + '-' + anno +'</label>';

                 }
            },{
                field: 'EVE_FECH_FINA',
                title: 'Fecha Finaliza',
                align: 'left',
                valign: 'middle',
                width: 200,
                sortable: true,
                  formatter: function(value, row, index) {
                    if (value!="")
                    {
                       var Meses =["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
                       var fechaInicio =new Date(value);
                       var anno = fechaInicio.getFullYear();
                       var mes =  Meses[fechaInicio.getMonth()];
                       var dia =  fechaInicio.getDate()+1; 
                       return '<label name="elementname" style="font-weight:100">'+ dia + '-' + mes + '-' + anno +'</label>';
                    }
                 }
            },{
                field: 'EVE_DOCU',
                title: '',
                align: 'left',
                valign: 'middle',
                width: 40,                
                 formatter: function(value, row, index) {
                    if (value!="undefined")
                    {
                        return '<a class="ver ml10 btn btn-default btn-xs" title="Ver Documento"><span class="glyphicon glyphicon-eye-open"></span></a>';
                    }
                   
                 },
                 events:  window.operateEvents = {
                    'click  .ver':function (e, value, row, index) {
                                 $window.open(row.EVE_DOCU);  
                             }
                         }
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
                                $('#nombreevento').text(row.EVE_NOMB);
                                  $('#myModal').data('id', row.EVE_CODI).modal('show');                                
                        },

                        'click .edit': function (e, value, row, index) {
                                 $window.location.href ="#/edit-evento/" + row.EVE_CODI + "";                           
                        }

                }



            }]
        };   
          var datos ={
            Accion:"S",
           SQL:"SELECT EVE_CODI,EVE_DOCU,EVE_NOMB ,EVE_DIRE,EVE_FECH_INIC,case EVE_FECH_FINA when '0000-00-00' then '' else EVE_FECH_FINA end AS EVE_FECH_FINA  FROM ESC_EVEN "
            }

        Execute.SQL(datos).then(function(result) {             
            if (result.data[0]!=null)
                $('#tableevento').bootstrapTable('load',result.data);
            else
                $('#tableevento').bootstrapTable('load',[]);

});
        //  $('#tableatributo').bootstrapTable('removeAll');
        //         $('#tableatributo').bootstrapTable('append',result.data);        

        // });


        
        // //     var json =[{'CAR_CODI':1,'CAR_NOMB':'Nombre1'}];
        //   var datos ={
        //    Accion:"S",
        //    SQL:"SELECT CAR_CODI,CAR_NOMB FROM CACAO.ESC_CARA "
        //     }
        // Execute.SQL(datos).then(function(result) {                         
 
        //  $('#tableatributo').bootstrapTable('removeAll');
        //         $('#tableatributo').bootstrapTable('append',result.data);

        //   var datos = $scope.options;      

        // });




         

    }])

	.controller('ListControllerevento', ['$window','$scope', function($window,$scope) {
  
        this.btnNovoClick = function() {
            $window.location.href = "#/edit-evento/0";
        };            
    }]);

