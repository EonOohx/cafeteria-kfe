document.addEventListener("DOMContentLoaded", () => {
    const url = document.getElementById("btn-productos-fechas").dataset.url;

    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const fecha_inicio = document.querySelector("input[name='fecha_inicio']").value;
        const fecha_final = document.querySelector("input[name='fecha_final']").value;
        const uri = `${url}?inicio=${fecha_inicio}&final=${fecha_final}`
        consultarProductosFechas(uri).catch();
    });

    document.querySelector("input[name='fecha_inicio']").value = fechaActual();
    document.querySelector("input[name='fecha_final']").value = fechaActual();
    consultarProductosFechas(url).catch();
    renderizarProductosVendidos().catch();
    renderizarProductosPopulares().catch();
});


function fechaActual() {
    const date = new Date()
    const anio = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

async function consultarProductosFechas(uri) {
    try {
        const response = await fetch(`${uri}`);
        if (!response.ok) {
            console.log(response.statusText);
            return;
        }
        const registros = await response.json();
        renderizarProductosRangoFecha(registros);
    } catch (error) {
        console.log("No se pudo realizar la consulta de registros entre fechas", error);
    }
}


function renderizarProductosRangoFecha(registros) {
    const tbody = document.getElementById("tb-productos-fecha");
    tbody.innerHTML = "";
    registros.forEach(registro => {
        const {id, nombre, cantidad} = registro;
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${cantidad}</td>
        `;
        tbody.appendChild(fila);
    });
}

async function renderizarProductosVendidos() {
    try {
        const url = document.getElementById("div-productos-venta").dataset.url;
        const response = await fetch(`${url}`);
        if (!response.ok) {
            console.log(response.statusText);
            return;
        }

        const registros = await response.json();
        const etiquetas = registros.map(item => item.producto);
        const valores = registros.map(item => item.ventas);

        const ctx = document.getElementById("canva-productos-venta").getContext("2d");

        // El objeto Chart funciona al cargarse el DOM.
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Ventas por producto',
                    data: valores,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.log("No se pudo realizar la consulta de las ventas por productos ", error);
    }
}

async function renderizarProductosPopulares() {
    try {
        const tbody = document.getElementById("tb-productos-populares");
        const response = await fetch(`${tbody.dataset.url}`);
        if (!response.ok) {
            console.log(response.error);
            return;
        }
        const registros = await response.json();
        registros.forEach(registro => {
            const {id, nombre, cantidad} = registro
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${id}</td>
                <td>${nombre}</td>
                <td>${cantidad}</td>
            `;
            tbody.appendChild(fila);
        })
    } catch (error) {
        console.log("No se pudo realizar la consulta de los productos populares", error);
    }
}
