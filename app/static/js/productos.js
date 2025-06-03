document.addEventListener("DOMContentLoaded", () => {

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


    validarCamposProducto();
    validarCamposCategoria();
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
                <a class="btn btn-primary" href="/productos/editar_producto/${id_producto}" methods="GET">Editar</a>
                <a class="btn btn-danger" href="/productos/eliminar_producto/${id_producto}" methods="GET">Eliminar</a>
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

        verificarOpcionExistencia(inventariableChk);

        inventariableChk.addEventListener("change", () => {
            verificarOpcionExistencia(inventariableChk);
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
    const nombreValido = /^[\p{L}\s'-]+$/u.test(nombreInput.value.trim());
    const categoriaValida = categoriaSelect.value !== "";
    const precioValido = !isNaN(precioInput.value) && Number(precioInput.value) > 0;
    let existencia = !isNaN(existenciaFld.value) && Number(existenciaFld.value) >= 0;

    if (!inventariableChk) {
        existencia = true;
    }

    btnGuardar.disabled = !(nombreValido && categoriaValida && precioValido && existencia);
}

function validarCamposCategoria() {
    const btnGuardar = document.getElementById("btn-guardar-categoria");
    if (btnGuardar) {
        const nombreInput = document.querySelector('input[name="nombre_categoria"]')
        habilitarRegistrarCategoria(btnGuardar, nombreInput);

        nombreInput.addEventListener("input", (e) => {
            habilitarRegistrarCategoria(btnGuardar, e.currentTarget);
        });
    }
}

function habilitarRegistrarCategoria(btnGuardar, inputCategoria) {
    btnGuardar.disabled = !/^[\p{L}\s'-]+$/u.test(inputCategoria.value.trim());
}

function verificarOpcionExistencia(inventariableChk) {
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