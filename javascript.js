
function show_loading() {
    $('#loadingIcon').css('display', 'flex');
    $('#loadingIcon').show();
}
function hide_loading() {
    $('#loadingIcon').css('display', 'none');
    $('#loadingIcon').hide();
}



$(document).ready(function(){

    show_loading();
    list_videos();
    calcularAltura();
    hide_loading();

    $('#uploadBtn').on('click', function() {
        $('#videoInput').click(); // Abre el selector de archivos
    });

    $('#videoInput').on('change', function() {
        var file = this.files[0];
        if (file) {
            var formData = new FormData();
            formData.append('videoFile', file);

            // Muestra el icono de carga
            show_loading();

            // Realiza la subida del archivo usando AJAX
            $.ajax({
                url: 'upload_video.php', // Ruta a tu script PHP de carga
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    // Oculta el icono de carga
                    list_videos();
                    hide_loading();
                    showMessage(response, 'success');
                },
                error: function() {
                    // Oculta el icono de carga
                    hide_loading();
                    showMessage('Hubo un error al subir el archivo.', 'error');
                }
            });
        }
    });

    $('#playlistIcon').click(function() {
        list_playlist();
        $('#playlistContainer').toggle(); // Muestra u oculta el contenedor de la playlist
    });

});

function calcularAltura() {
    var alturaTotal = window.innerHeight; // Altura total de la ventana

    var alturaHeader = document.getElementById('reproductor').offsetHeight; // Altura del header
    var alturaFooter = document.getElementById('botones').offsetHeight; // Altura del footer

    var alturaRestante = alturaTotal - (alturaHeader + alturaFooter + 20); // Altura restante

    document.getElementById('videoList').style.maxHeight = alturaRestante + 'px';
    document.getElementById('playlist').style.maxHeight = alturaRestante + 'px';
}

function list_videos()
{
    // Limpiar la lista de videos
    $('#videoList').html('');

    $.ajax({
        url: '/list_videos.php',
        type: 'GET',
        success: function(videos) {
            videos = JSON.parse(videos);
            for(var i in videos) {
                var videoItem = '' +
                '<li class="list-group-item d-flex justify-content-between align-items-center">' +
                '<label class="truncate-text">' + videos[i] + '</label>' +
                    '<div class="btn-group" role="group" aria-label="Basic example">'
                        + '<button type="button" class="btn btn-outline-danger" onclick="delete_video(\'' + videos[i] + '\')"><i class="fas fa-trash"></i></button>'
                        + '<button type="button" class="btn btn-outline-primary" onclick="add_playlist(\'' + videos[i] + '\')"><i class="fas fa-plus"></i></button>'
                        + '<button type="button" class="btn btn-outline-success" onclick="play_video(\'' + videos[i] + '\')"><i class="fas fa-play"></i></button>'
                    '</div>' +
                '</li>';

                $('#videoList').append(videoItem);
            }
        },
        error: function() {
            alert('No se pudo obtener la lista de videos');
        }
    });
}

function list_playlist()
{
    // Delete .list-group-item in playlist
    $('#playlist').find('.list-group-item').remove();

    $.ajax({
        url: 'playlist_actions/get_playlists.php',
        type: 'GET',
        dataType: 'json',
        success: function(playlists) {
            if (Array.isArray(playlists)) {
                playlists.forEach(function(video) {
                    // Crear y añadir la lista de reproducción al contenedor
                    var html = '<li class="list-group-item  d-flex justify-content-between align-items-center" draggable="true" ondragstart="dragStart(event)" ondragover="dragOver(event)" ondrop="drop(event)">' +
                                    '<label class="truncate-text mr-auto">' + video + '</label>' +
                                    '<button type="button" class="btn btn-outline-danger mr-2"  data-video="' + video + '" onclick="delete_video_playlist(this)"><i class="fas fa-trash"></i></button>' +
                                '</li>';
                    $('#playlist').append(html);
                });
            }else{
                alert('No se pudo obtener la lista de reproducción');
                console.log(playlists);
            }
        },
        error: function() {
            alert('No se pudo obtener la lista de videos');
        }
    });

}

function showMessage(message, type) {
    var messageBanner = $('#messageBanner');
    messageBanner.text(message);

    if (type === "success") {
        messageBanner.css("background-color", "#4CAF50"); // Verde para éxito
    } else {
        messageBanner.css("background-color", "#f44336"); // Rojo para error
    }

    messageBanner.slideDown();

    // Ocultar el mensaje después de 3 segundos
    setTimeout(function() {
        messageBanner.slideUp();
    }, 3000);
}

function delete_video_playlist(video) {  

    // Show all data
    console.log($(video).data('video'));

    $.ajax({
        url: 'playlist_actions/del_to_playlist.php',
        type: 'POST',
        data: {
            videoName: $(video).data('video')
        },
        success: function(response) {
            // Delete parent element
            $(video).parent().remove();
            showMessage(response, 'success');
            list_videos();
        },
        error: function(response) {
            showMessage(response, 'error');
        }
    });
}

function add_playlist(videoName) {
    $.ajax({
        url: 'playlist_actions/add_to_playlist.php',
        type: 'POST',
        data: {
            videoName: videoName
        },
        success: function(response) {
            showMessage(response, 'success');
            list_playlist();
        },
        error: function(response) {
            showMessage(response, 'error');
            list_playlist();
        }
    });
}


