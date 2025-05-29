function cargarProductos() {
    const categoriaId = document.querySelector("#categoria-select").value;

    fetch(`/productos_categoria/${categoriaId}`)
        .then(response => response.json())
        .then(data => {
            const lista = document.querySelector("#productos-lista");
            lista.innerHTML = "";

            data.forEach(producto => {

                    let cantidad = producto.cantidad
                    if (producto.cantidad < 0 || producto.cantidad === null) {
                        cantidad = "Agotado"
                    }
                    if (!producto.inventariable) {
                        cantidad = "Disponible"
                    }
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre}</td>
                    <td>${cantidad}</td>
                    <td>${producto.precio}</td>

                `;
                    if (producto.cantidad > 0) {
                        fila.innerHTML += `<td>
                                <button
                                    class="btn-agregar"
                                    data-id="${producto.id_producto}"
                                    data-nombre="${producto.nombre}"
                                    data-cantidad="${producto.cantidad}"
                                    data-precio="${producto.precio}">
                                    Agregar
                                </button>
                        </td>`;
                    }
                    lista.appendChild(fila);
                }
            )
            ;
            activarBotonesAgregar();
        })
        .catch(error => console.error("Error al obtener productos:", error));
}


function activarBotonesAgregar() {
    const botones = document.querySelectorAll(".btn-agregar");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const producto = {
                id: boton.dataset.id,
                nombre: boton.dataset.nombre,
                cantidad: boton.dataset.cantidad,
                precio: boton.dataset.precio
            };
            agregarAlCarrito(producto);
        });
    });
}

function agregarAlCarrito(producto) {
    const carrito = document.querySelector("#venta-carrito");

    if (carrito.querySelector(`tr[data-id='${producto.id}']`)) {
        alert("Este producto ya fue agregado.");
        return;
    }

    const fila = document.createElement("tr");
    fila.setAttribute("data-id", producto.id);

    fila.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td><input type="number" min="1" value="1"></td>
        <td>${producto.precio}</td>
    `;

    carrito.appendChild(fila);
}

document.addEventListener("DOMContentLoaded", () => {
    const selectCargar = document.getElementById("categoria-select")
    const btnFinalizar = document.getElementById("btn-finalizar-venta")

    selectCargar.addEventListener("change", function () {
        const categoriaId = selectCargar.value;
        if (!categoriaId) return;
        cargarProductos(categoriaId);
    })
    // btnFinalizar.addEventListener("click", guardarVenta)
})



