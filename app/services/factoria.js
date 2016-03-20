'use strict';
angular.module('myApp')
 .factory('Execute', function($resource,$http) {

	  var servicio = {

	  	SQL : function(datos) {

	  		  return $http.post('services/executesql.php', datos);  

	  	},

	  	SQLMulti : function(datos) {

	  		  return $http.post('services/executesqlmulti.php', datos);  

	  	},


	  	execute: $resource('services/api.php?url=execute', {},{										
		query: {method: 'POST',params:{Accion: '@Accion',SQL: '@SQL'},isArray:true}
			}),


	  };

 return servicio;

});
