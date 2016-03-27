'use strict';

angular.module('myApp', ['ngRoute','ngCookies','ngResource','jqwidgets'])

.run(function($rootScope, $location, $cookieStore) {
   $rootScope.$on('$routeChangeStart', function(event, next, current) {

      if ($cookieStore.get('conectado')==false || $cookieStore.get('conectado') == null) 
      {
          $location.path('/inicio');
      }
      else 
      {
        if(next.templateUrl == 'views/inicio.html'  ) {
           $location.path('/menu'); 
         }
      }

   })
})

.config(['$routeProvider',function ($routeProvider){
    $routeProvider.when('/inicio', {
        templateUrl: 'views/inicio.html',
        controller: 'InicioCtrl'
    });     

  $routeProvider.when('/caracterizacion', {
        templateUrl: 'views/caracterizacion.html',
        controller: 'CaracterizacionCtrl'
    });  

    $routeProvider.when('/edit-caracterizacion/:idCaracterizacion', {
        templateUrl: 'views/edit-caracterizacion.html',
        controller: 'edit-CaracterizacionCtrl',
         resolve: {
          datosCaracterizacion: function($route,Execute){
            var caracterizacionID = parseInt($route.current.params.idCaracterizacion);           

               return    Execute.execute.query({Accion: 'S',
                         SQL: "SELECT CAR_CODI,CAR_NOMB FROM ESC_CARA " + 
                         " WHERE CAR_CODI =" + caracterizacionID });

          }
        }
    });  



 $routeProvider.when('/atributo', {
        templateUrl: 'views/atributo.html',
        controller: 'atributoCtrl'
    });  

  $routeProvider.when('/edit-atributo/:idAtributo', {
        templateUrl: 'views/edit-atributo.html',
        controller: 'edit-AtributoCtrl',
         resolve: {
          datosAtributo: function($route,Execute){
            var atributoID = parseInt($route.current.params.idAtributo);           

               return    Execute.execute.query({Accion: 'S',
                         SQL: "SELECT ATR_CARA_CODI, ATR_CODI,ATR_NOMB ,C.CAR_NOMB As Caracterizacion FROM ESC_ATRIB AS A INNER  JOIN ESC_CARA AS C " +
                        " ON C.CAR_CODI =A.ATR_CARA_CODI WHERE ATR_CODI=" + atributoID });

          }
        }
    });  

   $routeProvider.when('/entidad', {
        templateUrl: 'views/entidad.html',
        controller: 'entidadCtrl'
    });  
 
   $routeProvider.when('/edit-entidad/:idEntidad', {
        templateUrl: 'views/edit-entidad.html',
        controller: 'edit-EntidadCtrl',
         resolve: {
          datosEntidad: function($route,Execute){
            var entidadID = parseInt($route.current.params.idEntidad);           

               return    Execute.execute.query({Accion: 'S',
                         SQL: "SELECT ENT_CODI, ENT_NOMB  FROM ESC_ENTI WHERE ENT_CODI=" + entidadID });

          }
        }
    });  

   $routeProvider.when('/producto', {
        templateUrl: 'views/producto.html',
        controller: 'productoCtrl'
    });  


    $routeProvider.when('/edit-producto/:idProducto', {
        templateUrl: 'views/edit-producto.html',
        controller: 'edit-ProductoCtrl',
         resolve: {
          datosProducto: function($route,Execute){
            var productoID = parseInt($route.current.params.idProducto);           

               return    Execute.execute.query({Accion: 'S',
                         SQL: "SELECT PRO_CODI, PRO_NOMB,PRO_CODI_MUES  FROM ESC_PROD WHERE PRO_CODI=" + productoID });

          }
        }
    });  

    $routeProvider.when('/producto-caracteristica', {
        templateUrl: 'views/producto-caracteristica.html',
        controller: 'productoCaracteristicaCtrl'
    });  

  $routeProvider.when('/evento', {
        templateUrl: 'views/evento.html',
        controller: 'eventoCtrl'
    });      

  $routeProvider.when('/edit-evento/:idEvento', {
        templateUrl: 'views/edit-evento.html',
        controller: 'edit-EventoCtrl',
         resolve: {
          datosEvento: function($route,Execute){
            var eventoID = parseInt($route.current.params.idEvento);           

               return    Execute.execute.query({Accion: 'S',
                         SQL: "SELECT EVE_CODI,EVE_DOCU, EVE_NOMB,EVE_DIRE,EVE_FECH_INIC,EVE_FECH_FINA  FROM ESC_EVEN WHERE EVE_CODI=" + eventoID });

          }
        }
    });
$routeProvider.when('/usuario', {
        templateUrl: 'views/usuario.html',
        controller: 'usuarioCtrl'
    });      

$routeProvider.when('/edit-usuario/:idUsuario', {
        templateUrl: 'views/edit-usuario.html',
        controller: 'edit-UsuarioCtrl',
         resolve: {
          datosUsuario: function($route,Execute){
            var usuarioID = parseInt($route.current.params.idUsuario);           

               return    Execute.execute.query({Accion: 'S',
                         SQL: "SELECT PER_CODI,PER_NOMB ,PER_APEL,PER_DIRE,PER_USER,PER_TELE, " +
                        " PER_TIPO,PER_TIPO_JUEZ  " +
                        " FROM ESC_PERS WHERE PER_CODI=" + usuarioID });

          }
        }
    });
  
$routeProvider.when('/producto-evento', {
        templateUrl: 'views/producto-evento.html',
        controller: 'productoEventoCtrl'
    }); 

$routeProvider.when('/juez-producto-evento', {
        templateUrl: 'views/juez-producto-evento.html',
        controller: 'juezProductoEventoCtrl'
    }); 


   $routeProvider.when('/menu', {
        templateUrl: 'views/menu.html',
        controller: 'MenuCtrl'
    });  
   





}])


