<?php
if (isset($_FILES['videoFile'])) {
    $videoFile = $_FILES['videoFile'];

    // Validaciones
    $uploadDir = 'videos/'; // Asegúrate de que este directorio existe y tiene permisos de escritura
    if (is_dir($uploadDir)) {

        if (!is_writable($uploadDir)) {
            echo 'El directorio de carga no tiene permisos de escritura.';
            http_response_code(500);
            exit;
        }

        // Si existe el archivo, renombrarlo
        if (file_exists($uploadDir . $videoFile['name'])) {
            echo 'El archivo ya existe';
            http_response_code(500);
            exit;
        }

        $uploadPath = $uploadDir . basename($videoFile['name']);
        $fileType = strtolower(pathinfo($uploadPath, PATHINFO_EXTENSION));
    }else{
        echo 'El directorio de carga no existe.';
        http_response_code(500);
        exit;
    }

    // Verificar si el archivo es realmente un video
    // Puedes ampliar esta lista con otros formatos de video
    $allowedTypes = ['mp4', 'avi', 'mov', 'mpeg', 'wmv'];
    if (!in_array($fileType, $allowedTypes)) {
        echo 'Archivo no permitido. Los formatos válidos son: MP4, AVI, MOV, MPEG, WMV.';
        http_response_code(500);
        exit;
    }

    // Verificar el tamaño del archivo (por ejemplo, máx. 50MB)
    $maxSize = 50 * 1024 * 1024; // 50 MB en bytes
    if ($videoFile['size'] > $maxSize) {
        echo 'El archivo es demasiado grande. Tamaño máximo permitido: 50 MB.';
        http_response_code(500);
        exit;
    }

    // Intentar guardar el archivo
    if (move_uploaded_file($videoFile['tmp_name'], $uploadPath)) {
        echo 'Archivo guardado con éxito.';
    } else {
        echo 'Hubo un error al subir el archivo.';
        http_response_code(500);
        exit;
    }
} else {
    echo 'No se recibió ningún archivo.';
    http_response_code(500);
    exit;
}

?>
