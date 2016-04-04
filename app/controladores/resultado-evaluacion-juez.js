'use strict';
 angular.module('myApp')

 .controller('resultadoEvaluacionJuezCtrl', ['$scope','$window','Execute', function($scope,$window,Execute){

    		$scope.dataTableEvento1 =
            {
                width: 300,   
                height:200,           
                source: new $.jqx.dataAdapter({
                    localData: [{}],
                    dataType: "json",
                    dataFields:
                    [
                        { name: 'ATR_NOMB', type: 'string' },
                        { name: 'EEV_CALI', type: 'string' }
                        
                    ]
                }),
                columnsResize: true,
                columns: [
                  { text: 'Atributo', dataField: 'ATR_NOMB', width: 200 },
                  { text: 'Calificación', dataField: 'EEV_CALI', width: 100 }
                  
                ]
            };
            $scope.dataTableEvento2 =
            {
                width: 300,   
                height:200,           
                source: new $.jqx.dataAdapter({
                    localData: [{}],
                    dataType: "json",
                    dataFields:
                    [
                        { name: 'ATR_NOMB', type: 'string' },
                        { name: 'EEV_CALI', type: 'string' }
                        
                    ]
                }),
                columnsResize: true,
                columns: [
                  { text: 'Atributo', dataField: 'ATR_NOMB', width: 200 },
                  { text: 'Calificación', dataField: 'EEV_CALI', width: 100 }
                  
                ]
            };

            $scope.dataTableResultado =
            {
                width: 400,   
                height:200,           
                source: new $.jqx.dataAdapter({
                    localData: [{}],
                    dataType: "json",
                    dataFields:
                    [
                        { name: 'ATR_NOMB', type: 'string' },
                        { name: 'Dife', type: 'string' },
                        { name: 'Prod', type: 'string' }
                        
                    ]
                }),
                columnsResize: true,
                columns: [
                  { text: 'Atributo', dataField: 'ATR_NOMB', width: 200 },                  
                  { text: 'Dife', dataField: 'Dife', width: 100 },
                  { text: 'Prod', dataField: 'Prod', width: 100 }
                ]
            };

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

		var evento1 ={
			Accion:"S",
			SQL:"SELECT A.ATR_NOMB,EE.EEV_CALI FROM ESC_PROD_EVEN_ATRIB AS PEA " +
 				" INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
  				" INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
  				" INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
  				" INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
  				" WHERE PEA.PEA_JUEZ_CODI=" + $scope.selJuez.PER_CODI + " AND  E.EVE_CODI=" + $scope.selEvento.EVE_CODI
		}

		Execute.SQL(evento1).then(function(result) { 
			$scope.listEvento1=[];
			if (result.data[0]!=null)				
				$scope.dataTableEvento1.source = new $.jqx.dataAdapter({
                    localData: result.data});

			
		}); 			 		
 	}

 	$scope.onChangeEvento2 = function()
 	{
 	 	var evento2 ={
			Accion:"S",
			SQL:"SELECT A.ATR_NOMB,EE.EEV_CALI FROM ESC_PROD_EVEN_ATRIB AS PEA " +
 				" INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
  				" INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
  				" INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
  				" INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
  				" WHERE PEA.PEA_JUEZ_CODI=" + $scope.selJuez.PER_CODI + " AND  E.EVE_CODI=" + $scope.selEvento2.EVE_CODI
				}
			Execute.SQL(evento2).then(function(result) { 				
				if (result.data[0]!=null)				
				$scope.dataTableEvento2.source = new $.jqx.dataAdapter({
                    localData: result.data});

				var resultado ={
					Accion:"S",
					SQL:" SELECT T.ATR_NOMB ,sum(T.Suma) As Dife,sum(T.Suma)* sum(T.Suma) As Prod " +
					" FROM (SELECT A.ATR_NOMB,-sum(EE.EEV_CALI) As Suma FROM ESC_PROD_EVEN_ATRIB AS PEA " +
 					" INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
  					" INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
  					" INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
  					" INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
  					" WHERE PEA.PEA_JUEZ_CODI=" + $scope.selJuez.PER_CODI + " AND E.EVE_CODI=" + $scope.selEvento.EVE_CODI + " group by A.ATR_NOMB " +
					" UNION ALL " +
  					" SELECT A.ATR_NOMB,sum(EE.EEV_CALI) As Suma FROM ESC_PROD_EVEN_ATRIB AS PEA " +
 					" INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
  					" INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
  					" INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
  					" INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
  					" WHERE PEA.PEA_JUEZ_CODI=" + $scope.selJuez.PER_CODI + " AND E.EVE_CODI="+ $scope.selEvento2.EVE_CODI + " group by A.ATR_NOMB ) AS T " +
					" group  by T.ATR_NOMB"
				}
					Execute.SQL(resultado).then(function(result) { 				
					if (result.data[0]!=null)				
						$scope.dataTableResultado.source = new $.jqx.dataAdapter({
                    	localData: result.data});
				});


			});	 		
 	}


 // SELECT T.ATR_NOMB As Atributo,sum(T.Suma) As Diferencia,sum(T.Suma)* sum(T.Suma) As Producto  FROM (
 // SELECT A.ATR_NOMB,-sum(EE.EEV_CALI) As Suma FROM ESC_PROD_EVEN_ATRIB AS PEA 
 // INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS
 //  INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI
 //  INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI
 //  INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS
 //  WHERE PEA.PEA_JUEZ_CODI=6 AND E.EVE_CODI=6 group by A.ATR_NOMB
 //  UNION ALL
 //  SELECT A.ATR_NOMB,sum(EE.EEV_CALI) As Suma FROM ESC_PROD_EVEN_ATRIB AS PEA 
 // INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS
 //  INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI
 //  INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI
 //  INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS
 //  WHERE PEA.PEA_JUEZ_CODI=6 AND E.EVE_CODI=8 group by A.ATR_NOMB ) AS T
 //  group  by T.ATR_NOMB

 }]);