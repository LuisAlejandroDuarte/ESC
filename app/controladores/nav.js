angular.module('myApp')

.controller('navCtrl', function($scope,$cookieStore,$location){
	
 $scope.usrConectado = {nombre: "", puesto: '', estaConectado: false};		 

  var usr = $cookieStore.get('myUser');

    if (usr != null) {     
      $scope.usrConectado.estaConectado = true;   
    }
    else
    {
    	  $scope.usrConectado.estaConectado = false;
          $cookieStore.put('conectado', false);
    	  
    }


	$scope.onClicSalir = function()
	{
  		  $cookieStore.remove('myUser');
		  $scope.usrConectado.estaConectado = false;
	      $cookieStore.remove('conectado');
		  $location.path("/inicio");

	}    	

});