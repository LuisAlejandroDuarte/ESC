<?php  
 require_once("Rest.php");
 require_once("config.php");  
 class Api extends Rest {  
   private $conexion;  
   private $_metodo;  
   private $_argumentos; 
   private $consulta; 
   private $query;
   public function __construct() {  
     parent::__construct();  
    // $this->conectarDB();  
   }    

   private function devolverError($id) {  
     $errores = array(  
       array('estado' => "error", "msg" => "petición no encontrada"),  //0
       array('estado' => "error", "msg" => "petición no aceptada"),   //1
       array('estado' => "error", "msg" => "petición sin contenido"),  //2
       array('estado' => "error", "msg" => "Usuario o clave incorrectas"), //3
       array('estado' => "error", "msg" => "error borrando usuario"),  //4
       array('estado' => "error", "msg" => "error actualizando nombre de usuario"),//5
       array('estado' => "error", "msg" => "error buscando usuario por email"),  //6
       array('estado' => "error", "msg" => "error creando usuario"),  //7
       array('estado' => "error", "msg" => "usuario ya existe"),  //8
       array('Usuario' => "null")  //9
     );  
     return $errores[$id];  
   }  
   public function procesarLLamada() {  
     if (isset($_REQUEST['url'])) {  
       //si por ejemplo pasamos explode('/','////controller///method////args///') el resultado es un array con elem vacios;
       //Array ( [0] => [1] => [2] => [3] => [4] => controller [5] => [6] => [7] => method [8] => [9] => [10] => [11] => args [12] => [13] => [14] => )
       $url = explode('/', trim($_REQUEST['url']));  
       //con array_filter() filtramos elementos de un array pasando función callback, que es opcional.
       //si no le pasamos función callback, los elementos false o vacios del array serán borrados 
       //por lo tanto la entre la anterior función (explode) y esta eliminamos los '/' sobrantes de la URL
       $url = array_filter($url);  
       $this->_metodo = strtolower(array_shift($url));  
       $this->_argumentos = $url;  
       $func = $this->_metodo;  
       if ((int) method_exists($this, $func) > 0) {  
         if (count($this->_argumentos) > 0) {  
           call_user_func_array(array($this, $this->_metodo), $this->_argumentos);  
         } else {//si no lo llamamos sin argumentos, al metodo del controlador  
           call_user_func(array($this, $this->_metodo));  
         }  
       }         
       else  
         $this->mostrarRespuesta($this->convertirJson($this->devolverError(7)), 404);  
     }  
    // $this->mostrarRespuesta($this->convertirJson($this->devolverError(0)), 404);  
   }  
   private function convertirJson($data) {  
     return json_encode($data);  
   }  
   
   
   private function validaExisteRegistro($Tabla,$Campo,$Valor)
   {
           $conexion= mysqli_connect(DB_SERVER,DB_USER, DB_PASS,DB_NAME)
      or die("Lo sentimos pero no se pudo conectar a nuestra db");

     $query = "Select * from " . $Tabla . " where " . $Campo . "='" . $Valor . "'";

     $result = mysqli_query($conexion,$query); 
      
    if (mysqli_num_rows($result)>0 )
    {
      $datos = array(); 
     $datos[]=  mysqli_fetch_assoc($result);
     $message[0] = array('estado'=>'err','msg' =>'Ya existe el registro','existe'=>'true','valor'=>$datos);

     $this->mostrarRespuesta($this->convertirJson($message), 200);  
    } 
    else
    {
      $message[0] = array('estado'=>'err','msg' =>'No existe el registro','existe'=>'false','valor'=>$result);

      $this->mostrarRespuesta($this->convertirJson($message), 200);  
    }
    
    // $message[0] = array('estado'=>'err','msg' =>$query);

    //   $this->mostrarRespuesta($this->convertirJson($message), 200);  

   }

private function execute()
   {
     //  if ($_SERVER['REQUEST_METHOD'] != "GET") {  
     //   $this->mostrarRespuesta($this->convertirJson($this->devolverError(1)), 405);  
     // }  

     if ($_SERVER['REQUEST_METHOD'] != "POST") {  
       $this->mostrarRespuesta($this->convertirJson($this->devolverError(1)), 405);  
     }  


      $datos= json_decode(file_get_contents("php://input"),true); 
     
      $Accion = $datos['Accion'];
      $SQL = $datos['SQL'];

      

     $query = $SQL;
     
      $conexion= mysqli_connect(DB_SERVER,DB_USER, DB_PASS,DB_NAME)
      or die("Lo sentimos pero no se pudo conectar a nuestra db");
    


       switch ($Accion) {
        case 'S':


         // $arrayName = array(array("SQL"=> $conexion));
         //    $this->mostrarRespuesta($this->convertirJson($arrayName), 200);  
            
        //      $resultArray = array();                 
        // while ($tuple= pg_fetch_assoc($result)) {
        //     $resultArray[] = $tuple;        
        // }          
        // $this->mostrarRespuesta($this->convertirJson($resultArray), 200);  
           
 // $resultArray['GAR_NOMB'] = $SQL;
 // $this->mostrarRespuesta($this->convertirJson($resultArray), 200); 
        
$resultArray = array(); 
//$row = array();
     $result = mysqli_query($conexion,$query); 
      
    if (mysqli_num_rows($result)==0 )
    {
            $resultArray[]= mysqli_fetch_assoc($result);
         // $resultArray = array(array('INV_IDEN' => null, "INV_NOMB" => null,"INV_APEL"=>null));
          
 
           $this->mostrarRespuesta($this->convertirJson($resultArray), 200);  
            
    }
    else
    {
       while ($tuple= mysqli_fetch_assoc($result)) {
          $resultArray[] = $tuple;         
        }   
      $this->mostrarRespuesta($this->convertirJson($resultArray), 200);  

       
          

     }
       
          break;
        case 'M':
             
           $query =str_replace("|", "/", $query); 
           $query =str_replace("*", "+", $query); 
           $result = mysqli_query($conexion,$query);           
          if ($result)      
          {
              $message[0] = array('estado'=>'ok','msg' =>'Actualizado','sql'=>$query);
              $this->mostrarRespuesta($this->convertirJson($message), 200);  
          }
          else
          {
              $message[0] = array('estado'=>'error','msg' => mysqli_error($conexion),'sql'=>$query);
              $this->mostrarRespuesta($this->convertirJson($message), 405);  
          }

          
          break;
        case 'D':
                 
           $result = mysqli_query($conexion,$query); 
          if ($result)      
          {
              $message[0] = array('estado'=>'ok','msg' =>'Eliminado');
               $this->mostrarRespuesta($this->convertirJson($message), 200);  
          }
          else
          {
             $message = array('estado'=>'errores','msg' => mysqli_error($conexion));
               $this->mostrarRespuesta($this->convertirJson($message), 404);
                
          }
          

         
          break; 
        case 'I':
            
        // $message[0] = array('estado'=>'fallo','msg' => $query,'valor'=>1);
  

          //  $div_query= explode(";",$query);
          
           
          // if ($div_query[0]==0)
          // {
          //      $queryMax ="SELECT MAX(" . $div_query[2] . ") as m FROM  " . $div_query[1] ;
              

          //       $result = mysqli_query($conexion,$queryMax);                
             
          //       if (mysqli_num_rows($result)>0)
          //          {
                   
          //              $maximo= mysqli_fetch_array($result);

          //              $valorMaximo = $maximo[0] + 1; 

                    
          //          }
          //       $queryInsert =str_replace("@@", $valorMaximo, $div_query[3]); 

          // }
          // else
          // {
          //   $queryInsert=$div_query[1];
          //   $valorMaximo = $div_query[0];
          // }

                     
          $result = mysqli_query($conexion,$SQL);   
          
        
          if ($result)      
              $message[0] = array('estado'=>'ok','msg' =>'Insertado','valor'=>$valorMaximo);
          else
              $message[0] = array('estado'=>'fallo','msg' => mysqli_error($conexion),'sql'=>$queryInsert);

           $this->mostrarRespuesta($this->convertirJson($message), 200);  
          break;         
        default:
          # code...
          break;
      }

   }

   private function executeSQL($Accion,$SQL)
   {
     //  if ($_SERVER['REQUEST_METHOD'] != "GET") {  
     //   $this->mostrarRespuesta($this->convertirJson($this->devolverError(1)), 405);  
     // }  

    

      

     $query = $SQL;
     
      $conexion= mysqli_connect(DB_SERVER,DB_USER, DB_PASS,DB_NAME)
      or die("Lo sentimos pero no se pudo conectar a nuestra db");
    


       switch ($Accion) {
        case 'S':


         // $arrayName = array(array("SQL"=> $conexion));
         //    $this->mostrarRespuesta($this->convertirJson($arrayName), 200);  
            
        //      $resultArray = array();                 
        // while ($tuple= pg_fetch_assoc($result)) {
        //     $resultArray[] = $tuple;        
        // }          
        // $this->mostrarRespuesta($this->convertirJson($resultArray), 200);  
           
 // $resultArray['GAR_NOMB'] = $SQL;
 // $this->mostrarRespuesta($this->convertirJson($resultArray), 200); 
        
$resultArray = array(); 
//$row = array();
     $result = mysqli_query($conexion,$query); 
      
    if (mysqli_num_fields($result)==0 )
    {
            $resultArray[]= mysqli_fetch_assoc($result);
         // $resultArray = array(array('INV_IDEN' => null, "INV_NOMB" => null,"INV_APEL"=>null));
        //  printf(mysqli_num_rows($result));
          $message[0] = array('count'=>'0');  
           $this->mostrarRespuesta($this->convertirJson($message), 200);  
            
    }
    else
    {
      //printf('mysqli_num_rows($result)');
       while ($tuple= mysqli_fetch_assoc($result)) {
          $resultArray[] = $tuple;         
        } 
         $message[0] = array('estado'=>mysqli_num_rows($result),'msg' =>'Actualizado','sql'=>$query);  
      $this->mostrarRespuesta($this->convertirJson($resultArray), 200);  
 
       
          

     }
       
          break;
        case 'M':
             
           $query =str_replace("|", "/", $query); 
           $query =str_replace("*", "+", $query); 
           $result = mysqli_query($conexion,$query);           
          if ($result)      
          {
              $message[0] = array('estado'=>'ok','msg' =>'Actualizado','sql'=>$query);
              $this->mostrarRespuesta($this->convertirJson($message), 200);  
          }
          else
          {
              $message[0] = array('estado'=>'error','msg' => mysqli_error($conexion),'sql'=>$query);
              $this->mostrarRespuesta($this->convertirJson($message), 405);  
          }

          
          break;
        case 'D':
                 
           $result = mysqli_query($conexion,$query); 
          if ($result)      
          {
              $message[0] = array('estado'=>'ok','msg' =>'Eliminado');
               $this->mostrarRespuesta($this->convertirJson($message), 200);  
          }
          else
          {
             $message = array('estado'=>'errores','msg' => mysqli_error($conexion));
               $this->mostrarRespuesta($this->convertirJson($message), 404);
                
          }
          

         
          break; 
        case 'I':
            
        // $message[0] = array('estado'=>'fallo','msg' => $query,'valor'=>1);
  

           $div_query= explode(";",$query);
          
           
          if ($div_query[0]==0)
          {
               $queryMax ="SELECT MAX(" . $div_query[2] . ") as m FROM  " . $div_query[1] ;
              

                $result = mysqli_query($conexion,$queryMax);                
             
                if (mysqli_num_rows($result)>0)
                   {
                   
                       $maximo= mysqli_fetch_array($result);

                       $valorMaximo = $maximo[0] + 1; 

                    
                   }
                $queryInsert =str_replace("@@", $valorMaximo, $div_query[3]); 

          }
          else
          { 
            $queryInsert=$div_query[1];
            $valorMaximo = $div_query[0];
          }

                     
          $result = mysqli_query($conexion,$queryInsert);   
          
        
          if ($result)      
              $message[0] = array('estado'=>'ok','msg' =>'Insertado','valor'=>$valorMaximo);
          else
              $message[0] = array('estado'=>'fallo','msg' => mysqli_error($conexion),'sql'=>$queryInsert);

           $this->mostrarRespuesta($this->convertirJson($message), 200);  
          break;         
        default:
          # code...
          break;
      }

   }

}
 $api = new Api();  
 $api->procesarLLamada();