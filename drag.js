let draggedItem = null;
let placeholder = null;
let startY, startTop;

function dragStart(e) {
    console.log('dragStart');
    document.querySelectorAll('#playlist .list-group-item').forEach(item => {
        item.addEventListener('mousedown', dragStart);
        item.addEventListener('touchstart', dragStart);
    });

    e.preventDefault();
    draggedItem = this;

    const rect = draggedItem.getBoundingClientRect();
    startY = e.pageY || e.touches[0].pageY;
    startTop = rect.top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    // Crear y añadir un placeholder
    placeholder = draggedItem.cloneNode(true);
    placeholder.className = 'placeholder';
    draggedItem.parentNode.insertBefore(placeholder, draggedItem);
    draggedItem.classList.add('dragging');
}

function dragMove(e) {
    e.preventDefault();
    if (!draggedItem) return;

    const y = e.pageY || e.touches[0].pageY;
    const listItems = Array.from(document.querySelectorAll('#playlist .list-group-item:not(.dragging)'));
    let closest = null;
    let closestDistance = Number.MAX_VALUE;

    // Encuentra el elemento más cercano y su distancia
    listItems.forEach(item => {
        const box = item.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (Math.abs(offset) < closestDistance) {
            closest = item;
            closestDistance = Math.abs(offset);
        }
    });

    // Mover el placeholder
    if (closest) {
        if (y > window.scrollY + closest.getBoundingClientRect().top) {
            closest.after(placeholder);
        } else {
            closest.before(placeholder);
        }
    }
}


function dragEnd() {
    if (!draggedItem) return;

    // Eliminar estilos aplicados durante el arrastre
    draggedItem.style.position = '';
    draggedItem.style.top = '';

    // Mover el elemento arrastrado a la nueva posición y eliminar el placeholder
    placeholder.replaceWith(draggedItem);
    draggedItem.classList.remove('dragging');
    draggedItem = null; // Limpiar la referencia

    // Recoger la lista de reproducción
    let playlist = [];
    $('#playlist .list-group-item').each(function() {
        if ($(this).find('label').text() != null){
            playlist.push($(this).find('label').text());
        }
    });

    // Guardar la lista de reproducción
    $.ajax({
        url: 'playlist_actions/save_playlist.php',
        type: 'POST',
        data: { playlist: playlist },
        error: function() {
            showMessage('No se pudo guardar la lista de reproducción', 'danger');
        }
    });
}

