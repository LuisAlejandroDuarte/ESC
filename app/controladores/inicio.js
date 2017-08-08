'use strict';

angular.module('myApp')

.controller('InicioCtrl', function($scope,$q,Execute,$location,$cookieStore,$window) {
    
      var inicioSesion = $q.defer();
    var usr = $cookieStore.get('myUser');

    if (usr != null) {     
      $scope.usrConectado.estaConectado = true;
    }
    else
          $scope.usrConectado.estaConectado = false;

    $scope.onClicIniciar = function()
    {
    	var user;

    	var datos ={
    		Accion:"S",
    		SQL:"SELECT * FROM esc_pers WHERE  PER_USER='" + $scope.user + "' AND PER_PASS='" + $scope.pass + "'"
    	}
   
    	 Execute.SQL(datos).then(function(result) { 
 
            
        	if (result.data[0]==null)
            {
                 $cookieStore.put('conectado', false);
                $window.alert('Usuario o Clave no coinciden');
            }
            else
            {
                $scope.usrConectado.estaConectado = true;
                $cookieStore.put('conectado', true);
                $cookieStore.put('myUser', result.data);   
                $location.path("/menu");             
            }

        });

    	
    }


    
});