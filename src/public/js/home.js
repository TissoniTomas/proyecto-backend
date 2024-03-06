alert("FUNCIONANDO")

// Conexión al servidor de Socket.IO
const socket = io();

// Escuchar el evento 'productosActualizados' para actualizar la lista de productos
socket.on('productosActualizados', () => {
    actualizarListaProductos();
});

// Función para actualizar la lista de productos
function actualizarListaProductos() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            const listaProductos = document.getElementById('productos');
            listaProductos.innerHTML = '';

            data.forEach(producto => {
                const li = document.createElement('li');
                li.textContent = producto.title;
                listaProductos.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener productos:', error);
        });
}

// Llamar a la función para actualizar la lista de productos al cargar la página
actualizarListaProductos();