<?php

	 require_once("config.php");  
	  $d= json_decode(file_get_contents("php://input"),TRUE); 
     
       $Accion = $d['Accion'];
       $SQL = $d['SQL'];

	   $conexion= mysqli_connect(DB_SERVER,DB_USER, DB_PASS,DB_NAME)
       or die("Lo sentimos pero no se pudo conectar a nuestra db");

      

      if ($Accion=="S")
      {
            $resultArray = array(); 
      	$resultado = mysqli_query($conexion,$SQL);
            if (mysqli_num_rows($resultado)==0 )               
                 $resultArray[] = null;
           else
              while ($tuple= mysqli_fetch_assoc($resultado)) {                        
                        $resultArray[] = $tuple;         
                     }  

             echo json_encode($resultArray);                                
                          
       }

       if ($Accion=="I")
       {
       	  $result = mysqli_query($conexion,$SQL);  
       	   if ($result)      
              $message[0] = array('estado'=>'ok','msg' =>'Insertado','valor'=>$result);
          else
              $message[0] = array('estado'=>'fallo','msg' => mysqli_error($conexion),'sql'=>$SQL);

       	   echo json_encode($message);   
       }
   		
   	  if ($Accion=="U")
       {
       	  $result = mysqli_query($conexion,$SQL);  
       	   if ($result)      
              $message[0] = array('estado'=>'ok','msg' =>'Actualizado','valor'=>$result);
          else
              $message[0] = array('estado'=>'fallo','msg' => mysqli_error($conexion),'sql'=>$SQL);

       	   echo json_encode($message);   
       } 	

        if ($Accion=="D")
       {
          $result = mysqli_query($conexion,$SQL);  
           if ($result)      
              $message[0] = array('estado'=>'ok','msg' =>'Eliminado','valor'=>$result);
          else
              $message[0] = array('estado'=>'fallo','msg' => mysqli_error($conexion),'sql'=>$SQL);

           echo json_encode($message);   
       }

// Get the current response code and set a new one

?>        