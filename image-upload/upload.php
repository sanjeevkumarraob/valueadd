<?php

if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . '../../upload' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];

    move_uploaded_file( $tempPath, $uploadPath );

    $answer = array( 'answer' => '../upload/' . $_FILES[ 'file' ][ 'name' ] );/* the path to be read by the User app */
    $json = json_encode( $answer );

    echo $json;

} else {

    echo 'No files';

}

?>