'use strict';
 angular.module('myApp')

 .controller('resultadoEvaluacionJuezCtrl', ['$scope','$window','Execute', function($scope,$window,Execute){

 	var juez ={
 		Accion:"S",
 		SQL:"SELECT * FROM ESC_PERS WHERE PER_TIPO=1"
 	}


	$scope.listJuez = [];
 	Execute.SQL(juez).then(function(result) { 
 		if (result.data[0]!=null)
			$scope.listJuez = result.data;
 	});


 	$scope.onChangeJuez = function()
 	{
 		var evento ={
 			Accion:"S",
 			SQL:"SELECT distinct E.EVE_CODI,E.EVE_NOMB FROM ESC_PROD_EVEN_ATRIB AS PEA " +
				" INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
				" INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
				" WHERE PEA.PEA_JUEZ_CODI=" + $scope.selJuez.PER_CODI 
 		}

 		$scope.listEvento = [];
		Execute.SQL(evento).then(function(result) { 
 		if (result.data[0]!=null)
			$scope.listEvento = result.data;
 		}); 		
 	}


 	$scope.onChangeEvento = function()
 	{ 		 		
 		
 			$scope.listEvento2=[];
		angular.forEach($scope.listEvento, function(value, key) {

 				if (value.EVE_CODI!=$scope.selEvento.EVE_CODI)
 				{
 					var evento2 ={
 						EVE_CODI:value.EVE_CODI,
 						EVE_NOMB:value.EVE_NOMB	
 					}	 

 					$scope.listEvento2.splice(0,0,evento2);
 				}
 			});
 			 		
 	}

//  	SELECT A.ATR_NOMB,EE.EEV_CALI FROM ESC_PROD_EVEN_ATRIB AS PEA 
// INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS
// INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI
// INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI
// INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS
// WHERE PEA.PEA_JUEZ_CODI=13 AND E.EVE_CODI=30;

 }]);