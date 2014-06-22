$(function () {
    'use strict';

    $("input:checkbox").uniform();

    // Initialize the jQuery File Upload widget:
    var $fileupload = $('#fileupload');
    $fileupload.fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'upload.php',
        imageMaxWidth: 620,
    imageMaxHeight: 413,
    imageCrop: true, // Force cropped images
        dropZone: $('#dropzone')
    }).bind('fileuploadfail', function (e, data) {console.log(data)})
    .bind('fileuploaddone', function (e, data) {console.log(data.result)});

    // Enable iframe cross-domain access via redirect option:
    $fileupload.fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );
    
    // Load existing files:
    $.ajax({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: $fileupload.fileupload('option', 'url'),
        dataType: 'json',
        context: $fileupload[0]
    }).done(function (result) {
             console.log(result);
            $(this).fileupload('option', 'done')
                .call(this, null, {result: result});
       
    
        });

});