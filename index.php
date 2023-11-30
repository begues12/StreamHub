<?php
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});

use Pages\index;

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Video Playlist and Upload</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="api/jquery-3.5.1.min.js"></script>
    <script src="api/bootstrap.min.js"></script>
    <link rel="stylesheet" href="api/jquery-ui.css">
    <link rel="stylesheet" href="api/fontawesome/css/all.css">
    <link rel="stylesheet" href="api/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <div id="loadingIcon" class="justify-content-center align-items-center text-white" style="height: 100vh; background-color: rgba(0, 0, 0, 0.7); position: fixed; top: 0; left: 0; width: 100vw; z-index: 9999; display: none;">
            <i class="fas fa-spinner fa-spin fa-3x"></i>
        </div>
        <div class="mb-3">
            <div class="row justify-content-between" id="botones">
                <div class="col d-flex  mb-3 mt-3">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginModal" onclick="list_videos()" id="uploadBtn">
                        <i class="fas fa-upload"></i>
                    </button>
                    <input type="file" id="videoInput" accept="video/*" style="display: none;">

                </div>
                <div class="col d-flex flex-row-reverse mb-3 mt-3">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginModal" onclick="list_videos()">
                        <i class="fas fa-redo-alt"></i>
                    </button>
                </div>
            </div>
            <ul class="list-group" id="videoList" style="max-height: 500px; overflow-y: auto;">
            </ul>
        </div>
        <nav class="navbar fixed-bottom navbar-light" id="reproductor">
            <div class="container-fluid justify-content-center">
                <button class="btn btn-outline-danger mx-1" onclick="previousTrack()"><i class="fas fa-font fa-1x"></i></button>
                <button class="btn btn-outline-primary mx-1" onclick="previousTrack()"><i class="fas fa-backward fa-1x"></i></button>
                <button class="btn btn-outline-success mx-1" onclick="playPause()"><i class="fas fa-play fa-2x"></i></button>
                <button class="btn btn-outline-primary mx-1" onclick="nextTrack()"><i class="fas fa-forward fa-1x"></i></button>
                <button class="btn btn-outline-danger mx-1" id="playlistIcon"><i class="fas fa-list fa-1x"></i></button>
            </div>
        </nav>
        <div id="messageBanner"></div>
    

        <div id="playlistContainer">
            <!-- Close button -->
            <ul class="list-group pr-4" id="playlist">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-outline-transparent" onclick="$('#playlistContainer').hide();"><i class="fas fa-times"></i></button>
                </div>
                
            </ul>
            
        </div>
    </div>


    <link rel="stylesheet" href="css.css">
    <script src="javascript.js"></script>
    <script src="drag.js"></script>
</body>
</html>
