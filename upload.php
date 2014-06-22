<?php
$file_name='';
foreach ($_FILES['files']['name'] as $f => $name) {
 $allowedExts = array("gif", "jpeg", "jpg", "png");
    $temp = explode(".", $name);
    $extension = end($temp);

if ((($_FILES["files"]["type"][$f] == "image/gif")
|| ($_FILES["files"]["type"][$f] == "image/jpeg")
|| ($_FILES["files"]["type"][$f] == "image/jpg")
|| ($_FILES["files"]["type"][$f] == "image/png"))
&& ($_FILES["files"]["size"][$f] < 2000000)
&& in_array($extension, $allowedExts))
{
  if ($_FILES["files"]["error"][$f] > 0)
  {
    echo "Return Code: " . $_FILES["files"]["error"][$f] . "<br>";
  }
  else
  {

    if (file_exists("upload/" . $name))
    {
        echo $_FILES["files"]["tmp_name"][$f] . " already exists. ";
    }
    else
    {
        $file_name = uniqid() . "_" . $name;
        move_uploaded_file($_FILES["files"]["tmp_name"][$f], "../upload/" . $file_name);
        
    }
  }
}
else
{
    $error =  "Invalid files";
}
   
}
echo json_encode( $file_name);

?>