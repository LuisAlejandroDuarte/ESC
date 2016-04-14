'use strict';
 angular.module('myApp')

 .controller('resultadoGrupoCtrl', ['$scope','$window','Execute', function($scope,$window,Execute){


 	  $scope.dataTableEvento1 =
            {
                width: 370,   
                height:100,           
                source: new $.jqx.dataAdapter({
                    localData: [{}],
                    dataType: "json",
                    dataFields:
                    [
                        { name: 'ATR_NOMB', type: 'string' },
                        { name: 'EEV_CALI', type: 'string' },
                        { name: 'PER_NOMB', type: 'string' }
                        
                    ]
                }),
                columnsResize: true,
                columns: [
                  { text: 'Juez', dataField: 'PER_NOMB', width: 100 },	
                  { text: 'Atributo', dataField: 'ATR_NOMB', width: 150 },
                  { text: 'Calificación', dataField: 'EEV_CALI', width: 100 }

                  
                ]
            };

       $scope.dataTableEvento2 =
            {
                width: 370,   
                height:100,           
                source: new $.jqx.dataAdapter({
                    localData: [{}],
                    dataType: "json",
                    dataFields:
                    [
                        { name: 'ATR_NOMB', type: 'string' },
                        { name: 'EEV_CALI', type: 'string' },
                        { name: 'PER_NOMB', type: 'string' }
                        
                    ]
                }),
                columnsResize: true,
                columns: [
                  { text: 'Juez', dataField: 'PER_NOMB', width: 100 },	
                  { text: 'Atributo', dataField: 'ATR_NOMB', width: 150 },
                  { text: 'Calificación', dataField: 'EEV_CALI', width: 100 }

                  
                ]
            };

         $scope.dataTableResultEvento1 =
            {
                width: 380,   
                height:100,           
                source: new $.jqx.dataAdapter({
                    localData: [{}],
                    dataType: "json",
                    dataFields:
                    [                       
                        { name: 'EEV_CALI', type: 'string' },
                        { name: 'PER_NOMB', type: 'string' },
                        { name: 'PROD', type: 'string' }
                        
                    ]
                }),
                columnsResize: true,
                columns: [                 
                  { text: 'Atributo', dataField: 'ATR_NOMB', width: 150 },
                  { text: 'Calificación', dataField: 'EEV_CALI', width: 100 },
                  { text: 'Prod', dataField: 'PROD', width: 100 }

                  
                ]
            };
            $scope.dataTableResultEvento2 =
            {
                width: 380,   
                height:100,           
                source: new $.jqx.dataAdapter({
                    localData: [{}],
                    dataType: "json",
                    dataFields:
                    [                       
                        { name: 'EEV_CALI', type: 'string' },
                        { name: 'PER_NOMB', type: 'string' },
                        { name: 'PROD', type: 'string' }
                        
                    ]
                }),
                columnsResize: true,
                columns: [                 
                  { text: 'Atributo', dataField: 'ATR_NOMB', width: 150 },
                  { text: 'Calificación', dataField: 'EEV_CALI', width: 100 },
                  { text: 'Prod', dataField: 'PROD', width: 100 }

                  
                ]
            };

             $scope.settingsPanel ={
               width: 600,
               height: 300,
               autoUpdate:true
            }

 	 var producto ={
                        Accion:"S",
                        SQL:"SELECT * from ESC_PROD"
                    }

         $scope.listProducto=[];
         Execute.SQL(producto).then(function(result) { 

         	$scope.listProducto = result.data;

         });


	$scope.onChangeProducto = function()
	{
    limpiar();
		var evento ={
            Accion:"S",
            SQL:"SELECT distinct  concat(E.EVE_NOMB, ' ',PER.PER_NOMB, ' ',PER.PER_APEL) AS EVE_NOMB, E.EVE_CODI from ESC_PROD AS P " +
            " INNER JOIN ESC_PROD_EVEN AS PE ON PE.PRE_PROD_CODI = P.PRO_CODI " +
            " INNER JOIN ESC_EVEN AS E ON E.EVE_CODI=PE.PRE_EVEN_CODI " + 
            " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI = PE.PRE_LIDE_CODI " +
            " WHERE P.PRO_CODI=" + $scope.selProducto.PRO_CODI
        }

        $scope.listEvento = [];

        Execute.SQL(evento).then(function(result) { 
            if (result.data[0]!=null)
            {
                $scope.listEvento = result.data;                               
            }
        });
	}   

	$scope.onChangeEvento = function()
	{
    limpiar();
		$scope.listEvento2 =[];

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

	var evento ={
			Accion:"S",
			SQL:"SELECT A.ATR_NOMB,EE.EEV_CALI,concat(PER.PER_NOMB, ' ',PER.PER_APEL) AS PER_NOMB FROM ESC_PROD_EVEN_ATRIB AS PEA " +
 				" INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
  				" INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
  				" INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
  				" INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
  				" INNER JOIN ESC_PERS AS PER ON PER.PER_CODI = PEA.PEA_JUEZ_CODI " +
  				" WHERE  E.EVE_CODI=" + $scope.selEvento.EVE_CODI + ""
		}

		Execute.SQL(evento).then(function(result) { 
			$scope.dataTableEvento1.source = new $.jqx.dataAdapter({
                    localData: null});	
			if (result.data[0]!=null)				
				$scope.dataTableEvento1.source = new $.jqx.dataAdapter({
                    localData: result.data});			
		});

	}   


	$scope.onChangeEvento2 = function()
	{
  
			var evento ={
			Accion:"S",
			SQL:"SELECT A.ATR_NOMB,EE.EEV_CALI,concat(PER.PER_NOMB, ' ',PER.PER_APEL) AS PER_NOMB FROM ESC_PROD_EVEN_ATRIB AS PEA " +
 				" INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
  				" INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
  				" INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
  				" INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
  				" INNER JOIN ESC_PERS AS PER ON PER.PER_CODI = PEA.PEA_JUEZ_CODI " +
  				" WHERE  E.EVE_CODI=" + $scope.selEvento2.EVE_CODI + " "
		}

		Execute.SQL(evento).then(function(result) { 
			$scope.dataTableEvento2.source = new $.jqx.dataAdapter({
                    localData: null});	
			if (result.data[0]!=null)				
				$scope.dataTableEvento2.source = new $.jqx.dataAdapter({
                    localData: result.data});			
		});
	}


  $scope.onClicCalcular = function()
  {
      var evento ={
      Accion:"S",
      SQL:"SELECT A.ATR_NOMB,sum(EE.EEV_CALI) AS EEV_CALI,(sum(EE.EEV_CALI)*sum(EE.EEV_CALI)) AS PROD FROM ESC_PROD_EVEN_ATRIB AS PEA " +
        " INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
          " INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
          " INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
          " INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
          " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI = PEA.PEA_JUEZ_CODI " +
          " WHERE  E.EVE_CODI=" + $scope.selEvento.EVE_CODI + " group by A.ATR_NOMB "           

       }

       Execute.SQL(evento).then(function(result) { 

            $scope.dataTableResultEvento1.source = new $.jqx.dataAdapter({
                    localData: result.data});  
            
                    evento ={
                    Accion:"S",
                    SQL:"SELECt Count(T.total) AS total,sum(T.EEV_CALI) AS EEV_CALI,sum(T.PROD) AS PROD " +
                        " FROM (SELECT sum(EE.EEV_CALI) AS EEV_CALI,(sum(EE.EEV_CALI)*sum(EE.EEV_CALI)) AS PROD,Count(EE.EEV_CALI) AS total " +
                        " FROM ESC_PROD_EVEN_ATRIB AS PEA " +
                        " INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
                        " INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
                        " INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
                        " INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
                        " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI = PEA.PEA_JUEZ_CODI " +
                        " WHERE  E.EVE_CODI=" + $scope.selEvento.EVE_CODI + " group by A.ATR_NOMB ) AS T"           

                     }

                     Execute.SQL(evento).then(function(result) { 
                        $scope.nEvento1 = result.data[0].total;
                        $scope.sumTotalEvento1 = result.data[0].EEV_CALI;
                        $scope.promedioEvento1 = result.data[0].EEV_CALI/result.data[0].total;
                        $scope.sumTotalCuadradoEvento1 = result.data[0].PROD;
                        $scope.sumPromedioCuadradoEvento1 =result.data[0].PROD / result.data[0].total;
                        var ss1 = $scope.sumTotalCuadradoEvento1 -(( $scope.sumTotalEvento1* $scope.sumTotalEvento1)/$scope.nEvento1);

                             evento ={
                              Accion:"S",
                              SQL:"SELECT A.ATR_NOMB,sum(EE.EEV_CALI) AS EEV_CALI,(sum(EE.EEV_CALI)*sum(EE.EEV_CALI)) AS PROD FROM ESC_PROD_EVEN_ATRIB AS PEA " +
                                " INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
                                  " INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
                                  " INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
                                  " INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
                                  " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI = PEA.PEA_JUEZ_CODI " +
                                  " WHERE  E.EVE_CODI=" + $scope.selEvento2.EVE_CODI + " group by A.ATR_NOMB "           

                               }

                               Execute.SQL(evento).then(function(result) { 

                                    $scope.dataTableResultEvento2.source = new $.jqx.dataAdapter({
                                            localData: result.data});   

                                      evento ={
                                      Accion:"S",
                                      SQL:"SELECT Count(T.total) AS total,sum(T.EEV_CALI) AS EEV_CALI,sum(T.PROD) AS PROD " +
                                          " FROM (SELECT sum(EE.EEV_CALI) AS EEV_CALI,(sum(EE.EEV_CALI)*sum(EE.EEV_CALI)) AS PROD,Count(EE.EEV_CALI) AS total " +
                                          " FROM ESC_PROD_EVEN_ATRIB AS PEA " +
                                          " INNER JOIN ESC_PROD_EVEN AS PE  ON PE.PRE_CONS = PEA.PEA_PREV_CONS " +
                                          " INNER JOIN ESC_EVEN AS E ON E.EVE_CODI = PE.PRE_EVEN_CODI " +
                                          " INNER JOIN ESC_ATRIB AS A ON A.ATR_CODI = PEA.PEA_ATRI_CODI " +
                                          " INNER JOIN ESC_ESCA_EVAL AS EE ON EE.EEV_CONS = PEA.PEA_ESEV_CONS " +
                                          " INNER JOIN ESC_PERS AS PER ON PER.PER_CODI = PEA.PEA_JUEZ_CODI " +
                                          " WHERE  E.EVE_CODI=" + $scope.selEvento2.EVE_CODI + " group by A.ATR_NOMB ) AS T"           

                                       }

                                       Execute.SQL(evento).then(function(result) { 
                                          $scope.nEvento2 = result.data[0].total;
                                          $scope.sumTotalEvento2 = result.data[0].EEV_CALI;
                                          $scope.promedioEvento2 = result.data[0].EEV_CALI/result.data[0].total;
                                          $scope.sumTotalCuadradoEvento2 = result.data[0].PROD;
                                          $scope.sumPromedioCuadradoEvento2 =result.data[0].PROD/result.data[0].total;
                                          var ss2 = $scope.sumTotalCuadradoEvento2 -(( $scope.sumTotalEvento2* $scope.sumTotalEvento2)/$scope.nEvento2);
                                          var numerador = ($scope.promedioEvento1-$scope.promedioEvento2);
                                          var denominador = Math.sqrt(((ss1+ss2)/ (($scope.nEvento1-1)+($scope.nEvento2-1)))*((1/$scope.nEvento1)+(1/$scope.nEvento2)));
                                          $scope.tStudent = numerador / denominador;



                                       });

                               });
                     });
       });

  }

$scope.onChangeValue = function()
  {
    if ($scope.value=="")  {$scope.txtResultado="";return;}
    if ($scope.tStudent!="" && $scope.tStudent!=undefined)
    {
      if ($scope.value<$scope.tStudent)      
        $scope.txtResultado ="Se rechaza la Hipótesis";
      else
        $scope.txtResultado ="Se Acepta la Hipótesis";
    }
  }

  function limpiar()
  {
      $scope.dataTableEvento1.source = new $.jqx.dataAdapter({
                    localData: null});      
      $scope.dataTableEvento1.source = new $.jqx.dataAdapter({
                    localData:null});  
      $scope.dataTableResultEvento2.source = new $.jqx.dataAdapter({
                    localData: null});   
      $scope.dataTableResultEvento1.source = new $.jqx.dataAdapter({
                    localData: null});   

      $scope.nEvento1 = "";
      $scope.sumTotalEvento1 = "";
      $scope.promedioEvento1 = "";
      $scope.sumTotalCuadradoEvento1 = "";
      $scope.sumPromedioCuadradoEvento1 ="";

      $scope.nEvento2 = "";
      $scope.sumTotalEvento2 = "";
      $scope.promedioEvento2 = "";
      $scope.sumTotalCuadradoEvento2 = "";
      $scope.sumPromedioCuadradoEvento2 ="";

  }

 }]);