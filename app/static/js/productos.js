document.addEventListener("DOMContentLoaded", () => {
    const nombreCategoria = document.getElementById("nombre_categoria");
    const selectFiltrarProductos = document.getElementById("slt-filtrar-categoria");

    if (selectFiltrarProductos) {
        selectFiltrarProductos.addEventListener("change", async (e) => {

            try {
                const categoria = e.currentTarget.value;
                const url = e.currentTarget.dataset.url;
                let productos = {};

                if (categoria !== "") {
                    const response = await fetch(`${url}?categoria=${categoria}`);
                    if (!response.ok) {
                        console.log(response.statusText);
                        return;
                    }
                    productos = await response.json();
                } else {
                    const response = await fetch(url);
                    if (!response.ok) {
                        console.log(response.statusText);
                        return;
                    }
                    productos = await response.json();
                }
                renderizarTablaProductos(productos);
            } catch (e) {
                console.log("Error al realizar la petición al cliente de friltrado", e);
            }
        });
    }

    if (nombreCategoria) {
        nombreCategoria.addEventListener("input", (e) => {
            const btnGuardarCategoria = document.getElementById("btn-guardar-categoria");
            console.log(e.currentTarget.value);
            btnGuardarCategoria.disabled = e.currentTarget.value === "" && /^[\p{L}\s'-]+$/u.test(e.currentTarget.value);
        });
    }

    validarCamposProducto();
});

function renderizarTablaProductos(productos) {
    const tbProductos = document.getElementById("tb-productos");
    tbProductos.innerHTML = "";
    productos.forEach(producto => {
        const fila = document.createElement("tr");
        const {id_producto, nombre, categoria, precio, inventariable, cantidad} = producto
        fila.innerHTML = `
            <td>${id_producto}</td>
            <td>${nombre}</td>
            <td>${categoria}</td>
            <td>$${parseFloat(precio).toPrecision(2)}</td>
            <td>${mostrarExistencia(inventariable, cantidad)}<td>
           <td>
                <a href="/productos/editar_producto/${id_producto}" methods="GET">Editar</a>
                <a href="/productos/eliminar_producto/${id_producto}" methods="GET">Eliminar</a>
            </td>
        `;
        tbProductos.appendChild(fila);
    })
}

function mostrarExistencia(inventariable, cantidad) {
    if (inventariable) {
        return cantidad;
    } else if (cantidad === 1) {
        return "Disponible";
    } else {
        return "No Disponible";
    }
}

function validarCamposProducto() {
    const btnGuardar = document.getElementById("btn-guardar-producto");
    if (btnGuardar) {
        const nombreInput = document.querySelector('input[name="nombre_producto"]');
        const categoriaSelect = document.getElementById("tipo-categoria");
        const precioInput = document.querySelector('input[name="precio"]');

        const inventariableChk = document.getElementById("inventariableChk");
        const existenciaFld = document.getElementById("existenciaFld");

        const disponibleFld = document.getElementById("disponibleFld");

        verificarOpcionExistencia(inventariableChk, existenciaFld, disponibleFld);

        inventariableChk.addEventListener("change", () => {
            verificarOpcionExistencia(inventariableChk, disponibleFld, existenciaFld);
        });

        habilitarBotonRegistrarProducto(nombreInput, categoriaSelect, precioInput, inventariableChk, existenciaFld, btnGuardar);

        [nombreInput, categoriaSelect, precioInput, existenciaFld, disponibleFld].forEach(el => {
            el.addEventListener("input", () => {
                habilitarBotonRegistrarProducto(nombreInput, categoriaSelect, precioInput, inventariableChk, existenciaFld, btnGuardar);
            });
        });
    }
}

function habilitarBotonRegistrarProducto(nombreInput, categoriaSelect, precioInput, inventariableChk, existenciaFld, btnGuardar) {
    const nombreValido = /^[\p{L}\s'-]+$/u.test(nombreInput.value);
    const categoriaValida = categoriaSelect.value !== "";
    const precioValido = !isNaN(precioInput.value) && Number(precioInput.value) > 0;
    let existencia = !isNaN(existenciaFld.value) && Number(existenciaFld.value) >= 0;

    if (!inventariableChk) {
        existencia = true;
    }

    btnGuardar.disabled = !(nombreValido && categoriaValida && precioValido && existencia);
}

function verificarOpcionExistencia(inventariableChk, disponibleFld, existenciaFld) {
    const existenciaLabel = document.getElementById("existenciaLabel");
    const disponibleLabel = document.getElementById("disponibleLabel");
    if (inventariableChk.checked) {
        existenciaLabel.style.display = "block";
        disponibleLabel.style.display = "none";
    } else {
        existenciaLabel.style.display = "none";
        disponibleLabel.style.display = "block";
    }
}