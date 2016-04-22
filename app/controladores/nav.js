angular.module('myApp')

.controller('navCtrl', function($scope,$cookieStore,$location){
	
 $scope.usrConectado = {nombre: "", puesto: '', estaConectado: false};		 

  var usr = $cookieStore.get('myUser');

    if (usr != null) {     
      $scope.usrConectado.estaConectado = true;                   
      $scope.tipoUSER =usr[0].PER_TIPO;
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
        $scope.nameConectado="";
		  $location.path("/inicio");

	}    

  $scope.nav=function()
  {
     var usr = $cookieStore.get('myUser');
      if (usr != null) { 
        $scope.nameConectado = usr[0].PER_NOMB + ' ' + usr[0].PER_APEL;
        $scope.tipoUSER =usr[0].PER_TIPO;
     }
  }	

});