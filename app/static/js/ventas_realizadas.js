document.addEventListener("DOMContentLoaded", () => {
    const btnRealizarVenta = document.getElementById("backbtn-realizar-venta");
    btnRealizarVenta.addEventListener("click", () => {
        window.location.href = btnRealizarVenta.dataset.url;
    });

    const btnObtenerVentas = document.getElementById("btn-obtener-ventas");
    btnObtenerVentas.addEventListener("click", () => {
        obtenerVentasPorFecha(btnObtenerVentas.dataset.url).catch();
    });

    // Establecer fecha actual en el campo.
    document.getElementById("inp-fecha-ventas").value = obtenerFechaHoy();
});

window.addEventListener("DOMContentLoaded", () => {
    const url = document.getElementById("btn-obtener-ventas").value;
    obtenerVentasPorFecha(url).catch();
})

async function obtenerVentasPorFecha(url) {
    try {
        const inpFechaVentas = document.getElementById("inp-fecha-ventas");
        if (!inpFechaVentas.value) {
            alert("Seleccione una fecha válida");
            return;
        }
        const response = await fetch(`${url}?fecha=${inpFechaVentas.value}`);
        if (!response.ok) {
            console.log(response.statusText);
            return;
        }
        const ventas = await response.json();
        rendenrizarVentas(ventas);
        obtenerDetallesVenta();
    } catch (error) {
        console.error("Error al obtener ventas", error);
    }
}

function rendenrizarVentas(ventas) {
    const tabla = document.getElementById("tb-registros-venta");
    tabla.innerHTML = "";
    ventas.forEach(venta => {
        const {id_venta, cliente, empleado, monto_total} = venta;
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", id_venta);
        fila.innerHTML = `
            <td>${id_venta}</td>
            <td>${cliente}</td>
            <td>${empleado}</td>
            <td>$${parseFloat(monto_total).toFixed(2)}</td>
        `;
        tabla.appendChild(fila);
    });
}

function obtenerDetallesVenta() {
    const tabla = document.getElementById("tb-registros-venta");
    const filas = tabla.querySelectorAll("tr[data-id]")

    filas.forEach(fila => {
        fila.addEventListener("click", async () => {

            const tabla_detalles = document.getElementById("tb-detalles-ventas");
            tabla_detalles.innerHTML = "";

            const response = await fetch(`${tabla_detalles.dataset.url}?id=${fila.dataset.id}`);
            const detalles = await response.json()

            detalles.forEach(detalle => {
                const fila_detalle = document.createElement("tr");
                const {id_producto, nombre, cantidad, precio_unitario} = detalle
                fila_detalle.innerHTML = `
                    <td>${id_producto}</td>
                    <td>${nombre}</td>
                    <td>${cantidad}</td>
                    <td>$${parseFloat(precio_unitario).toFixed(2)}</td>
                `;
                tabla_detalles.appendChild(fila_detalle);
            })
        });
    });
}

function obtenerFechaHoy() {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
}
