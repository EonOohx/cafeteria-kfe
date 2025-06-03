document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("categoria-select").addEventListener("change", (event) => {
        const categoriaId = event.target.value;
        if (categoriaId) cargarProductos(categoriaId).catch();
    });

    document.getElementById("btn-finalizar-venta").addEventListener("click", guardarVenta);

    const btnVerVentas = document.getElementById("btn-ver-ventas");
    btnVerVentas.addEventListener("click", () => {
        window.location.href = btnVerVentas.dataset.url;
    })

    const inpEmpleado = document.getElementById("inp-empleado");
    inpEmpleado.addEventListener("input", () => {
        localStorage.setItem("empleado", inpEmpleado.value);
    })
});

// Actualizar el valor de Total
document.addEventListener("input", (e) => {
    if (e.target.matches("#venta-carrito input[type='number']")) {
        const thTotal = document.getElementById("total-venta");
        thTotal.setAttribute("data-total", "0.00");
        obtenerTotal();
    }
});

//Window representa la interface la ventana en el DOM - Caputar eventos
window.addEventListener('DOMContentLoaded', () => {
    // Si recarga el boton se deshabilita
    document.getElementById("btn-finalizar-venta").disabled = true;
    document.getElementById("categoria-select").value = "";

    const inpEmpleado = document.getElementById("inp-empleado");
    if (localStorage.getItem("empleado")) {
        inpEmpleado.value = localStorage.getItem("empleado");
    }

})

async function cargarProductos(categoriaId) {
    try {
        const response = await fetch(`/productos_categoria/${categoriaId}`);
        if (!response.ok) {
            console.log(response.statusText);
            return;
        }
        const productos = await response.json();
        renderizarProductos(productos);
        activarBotonesAgregar();
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

function renderizarProductos(productos) {
    const tabla = document.querySelector("#productos-lista");
    tabla.innerHTML = "";

    productos.forEach(producto => {
        const {id_producto, nombre, cantidad, precio, inventariable} = producto;
        const stock = determinarEstadoStock(cantidad, inventariable);

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td >${id_producto}</td>
            <td>${nombre}</td>
            <td>${stock}</td>
            <td style="width: 100px">$${parseFloat(precio).toFixed(2)}</td>
            ${(cantidad > 0 || !inventariable) ? botonAgregarHTML(producto) : ""}
        `;
        tabla.appendChild(fila);
    });
}

function determinarEstadoStock(cantidad, inventariable) {
    if (!inventariable) return "Disponible";
    if (cantidad === null || cantidad < 0) return "Agotado";
    return cantidad;
}

function botonAgregarHTML({id_producto, nombre, cantidad, precio, inventariable}) {
    return `
        <td>
            <button
                class="btn-agregar btn btn-primary"
                data-id="${id_producto}"
                data-nombre="${nombre}"
                data-cantidad="${cantidad}"
                data-precio="${precio}"
                data-inventariable="${inventariable}"
            >
                Agregar
            </button>
        </td>`;
}

function activarBotonesAgregar() {
    document.querySelectorAll(".btn-agregar").forEach(boton => {
        boton.addEventListener("click", () => {
            const {id, nombre, cantidad, precio, inventariable} = boton.dataset;
            const producto = {
                id,
                nombre,
                cantidad,
                precio,
                inventariable: inventariable === "true"
            };
            agregarAlCarrito(producto);
        });
    });
}

function agregarAlCarrito(producto) {
    const {id, nombre, cantidad, precio, inventariable} = producto;
    const carrito = document.querySelector("#venta-carrito");

    if (carrito.querySelector(`tr[data-id='${id}']`)) {
        mostrarAlerta("Este producto ya fue agregado", "warning");
        return;
    }

    const fila = document.createElement("tr");
    // Agregando attribute data para ID
    fila.setAttribute("data-id", id);
    fila.innerHTML = `
        <td>${id}</td>
        <td data-nombre="${nombre}">${nombre}</td>
        <td>
            <input class="form-control" style="width: 100px" data-cantidad="${cantidad}" type="number" min="1" value="1" ${inventariable ? `max="${cantidad}"` : ""}>
        </td>
        <td data-precio="${precio}" style="width: 100px">$${parseFloat(precio).toFixed(2)} </td>
    `;

    botonEliminarHTML(fila);
    carrito.appendChild(fila);
    obtenerTotal();
    document.getElementById("btn-finalizar-venta").disabled = false;
}

function botonEliminarHTML(fila) {
    const celdaAccion = document.createElement('td');
    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add('eliminar');
    botonEliminar.className = 'btn btn-danger';
    botonEliminar.addEventListener('click', () => {
        fila.remove();
        obtenerTotal();
    });
    celdaAccion.appendChild(botonEliminar);
    fila.appendChild(celdaAccion);
}

function obtenerTotal() {
    let total = 0;
    const filas = document.querySelectorAll("#venta-carrito > tr");
    const thTotal = document.getElementById("total-venta");

    filas.forEach(fila => {
        const inputCantidad = fila.querySelector("input[type='number']");
        inputCantidad.dataset.cantidad = inputCantidad.value
        const cantidad = inputCantidad ? parseInt(inputCantidad.value) : 1;
        const precio = parseFloat(fila.querySelector("td[data-precio]").dataset.precio);

        total += cantidad * precio;
    });

    thTotal.textContent = `Total: $${total.toFixed(2)}`;
    thTotal.dataset.value = total.toFixed(2);
    document.getElementById("btn-finalizar-venta").disabled = total === 0;
}

async function guardarVenta() {
    const total_venta = document.getElementById("total-venta").dataset.value;
    const nombreCliente = document.getElementById("inp-cliente").value;
    const nombreEmpleado = document.getElementById("inp-empleado").value;

    const nombreEmpleadoValido = /^[\p{L}\s'-]+$/u.test(nombreEmpleado);
    const nombreClienteValido = /^[\p{L}\s'-]+$/u.test(nombreCliente);

    if (nombreEmpleadoValido && nombreClienteValido) {
        const venta = {
            monto_total: total_venta,
            fecha: new Date().toISOString(),
            cliente: nombreCliente,
            empleado: nombreEmpleado
        }

        await fetch("/ventas", {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(venta)
        }).then(response => {
            if (!response.ok) {
                mostrarAlerta("Error al guardar la venta", "danger");
                throw new Error("Error en la solicitud - Registro de Venta");
            }
            return response.json();
        }).then(data => {
                mostrarAlerta("Venta registrada con éxito", "success");
                guardarDetallesVenta(data.id_venta)
            }
        ).catch(error => {
            console.error("Error", error)
        });
    } else {
        mostrarAlerta("Verifique el nombre del cliente", "warning");
    }
}

async function guardarDetallesVenta(id_venta) {
    const filas = document.querySelectorAll("#venta-carrito > tr");
    for (const fila of filas) {

        const informacion_venta = {
            id_venta: id_venta,
            id_producto: fila.dataset.id,
            cantidad: fila.querySelector("input[data-cantidad]").dataset.cantidad,
            precio_unitario: fila.querySelector("td[data-precio]").dataset.precio,
        }

        await fetch('/ventas/detalles', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(informacion_venta)
        }).then(response => {
            if (!response.ok) {
                mostrarAlerta("Error al guardar los detalles de la venta", "danger");
                throw new Error("Error en la solicitud - Detalles de venta");
            }
            return response.json();
        }).then(_ => {
            console.log("Detalles de venta guardado correctamente");
            const categoriaId = document.getElementById("categoria-select").value;
            if (categoriaId) cargarProductos(categoriaId).catch();
        }).catch(error => {
            console.error("Error", error);
        });
    }

    filas.forEach(fila => {
        fila.remove();
        obtenerTotal();
    })
}

function mostrarAlerta(mensaje, tipo = 'success') {
    const contenedor = document.getElementById("contenedor-alertas"); // un div vacío en tu HTML
    contenedor.innerHTML = `
        <div class="alert alert-${tipo}" role="alert">
            ${mensaje}
        </div>
    `;

    // Auto eliminar luego de 3 segundos
    setTimeout(() => {
        contenedor.innerHTML = '';
    }, 3000);
}