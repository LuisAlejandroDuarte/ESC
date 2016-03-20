'use strict';

angular.module('myApp')

.controller('MenuCtrl', function($scope,$q,Execute,$window,$location,$cookieStore) {
	
 	 var usr = $cookieStore.get('myUser');

    if (usr != null) {     
      $scope.usrConectado.estaConectado = true;
    }
    else
    	  $scope.usrConectado.estaConectado = false;

});