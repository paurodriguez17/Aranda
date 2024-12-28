document.getElementById('formMensual').addEventListener('submit', function (event) {
    event.preventDefault();
    const empleado = {
        tipo: 'Mensual',
        nombre: document.getElementById('nombreMensual').value,
        dni: document.getElementById('dniMensual').value,
        legajo: document.getElementById('legajoMensual').value,
        telefono: document.getElementById('telefonoMensual').value,
        sueldo: document.getElementById('sueldoMensual').value,
    };
    registrarEmpleado(empleado);
    event.target.reset();
});
document.getElementById('formPorHora').addEventListener('submit', function (event) {
    event.preventDefault();
    const empleado = {
        tipo: 'PorHora',
        nombre: document.getElementById('nombreHora').value,
        dni: document.getElementById('dniHora').value,
        legajo: document.getElementById('legajoHora').value,
        telefono: document.getElementById('telefonoHora').value,
        pagoHora: document.getElementById('pagoHora').value,
    };
    registrarEmpleado(empleado);
    event.target.reset();
});
function registrarEmpleado(empleado) {
    fetch('http://localhost:3000/registrar-empleado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleado),
    })
        .then((response) => response.json())
        .then(() => {
            mostrarEmpleados();
        })
        .catch((error) => console.error('Error:', error));
}
function mostrarEmpleados() {
    // Realiza una solicitud al servidor para obtener todos los empleados
    fetch('http://localhost:3000/obtener-empleados')
        .then(response => response.json())
        .then(empleados => {
            // Obtén las tablas correspondientes al tipo de empleado
            const tablaMensuales = document.getElementById('empleadosMensuales').querySelector('tbody');
            const tablaPorHora = document.getElementById('empleadosPorHora').querySelector('tbody');

            // Limpia el contenido de las tablas antes de agregar nuevos datos
            tablaMensuales.innerHTML = '';
            tablaPorHora.innerHTML = '';
            empleados.forEach((empleado) => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', empleado.id); // Asocia la fila al ID del empleado
                if (empleado.tipo_pago === 'Mensual') {
                    row.innerHTML = `
                    <td>${empleado.tipo_pago}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.dni}</td>
                    <td>${empleado.legajo}</td>
                    <td>${empleado.telefono}</td>
                    <td class="salario_base">${empleado.salario_base}</td>
                    <td>${empleado.horas_trabajadas || 0}</td>
                    <td>${empleado.total_pago || 0}</td>
                    <td>${empleado.descuento || 0}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="registrarAsistencia(${empleado.id}, '${empleado.tipo_pago}')">Registrar Asistencia</button>
                        <button class="btn btn-warning btn-sm" onclick="aplicarDescuento(${empleado.id})">Aplicar Descuento</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(${empleado.id})">Eliminar</button>
                        <button class="btn btn-primary btn-sm" onclick="mostrarActualizarSueldo(${empleado.id}, '${empleado.tipo_pago}', ${empleado.salario_base})">Actualizar Sueldo</button>
                    </td>                
                    `;
                    tablaMensuales.appendChild(row);
                } else if (empleado.tipo_pago === 'PorHora') {
                    row.innerHTML = `
                    <td>${empleado.tipo_pago}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.dni}</td>
                    <td>${empleado.legajo}</td>
                    <td>${empleado.telefono}</td>
                    <td class="salario_base">${empleado.salario_base}</td>
                    <td>${empleado.horas_trabajadas || 0}</td>
                    <td>${empleado.total_pago || 0}</td>
                    <td>${empleado.descuento || 0}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="registrarAsistencia(${empleado.id}, '${empleado.tipo_pago}')">Registrar Asistencia</button>
                        <button class="btn btn-warning btn-sm" onclick="aplicarDescuento(${empleado.id})">Aplicar Descuento</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(${empleado.id})">Eliminar</button>
                        <button class="btn btn-primary btn-sm" onclick="mostrarActualizarSueldo(${empleado.id}, '${empleado.tipo_pago}', ${empleado.salario_base})">Actualizar Sueldo</button>
                    </td>                
                    `;
                    tablaPorHora.appendChild(row);
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener los empleados:', error);
            alert('Hubo un problema al cargar los empleados. Por favor, intenta nuevamente.');
        });
}
function mostrarActualizarSueldo(id, tipoPago, salarioActual) {
    document.getElementById('actualizarEmpleadoId').value = id;
    document.getElementById('actualizarTipoPago').value = tipoPago;
    document.getElementById('nuevoSueldo').value = salarioActual;
    $('#actualizarModal').modal('show');
}
document.getElementById('formActualizar').addEventListener('submit', function (event) {
    event.preventDefault();
    const empleadoId = document.getElementById('actualizarEmpleadoId').value;
    const tipoPago = document.getElementById('actualizarTipoPago').value;
    const nuevoSueldo = parseFloat(document.getElementById('nuevoSueldo').value);

    fetch('http://localhost:3000/actualizar-sueldo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: empleadoId, tipoPago, nuevoSueldo }),
    })
        .then(response => response.json())
        .then(() => {
            $('#actualizarModal').modal('hide');
            mostrarEmpleados(); // Refresca la tabla
        })
        .catch(error => {
            console.error('Error al actualizar el sueldo:', error);
            alert('Hubo un problema al actualizar el sueldo.');
        });
});
function aplicarDescuento(empleadoId) {
    document.getElementById('empleadoDescuentoId').value = empleadoId;
    $('#descuentoModal').modal('show');
}
document.getElementById('formDescuento').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("Formulario de descuento enviado"); // Verificar si el evento se dispara
    const empleadoId = document.getElementById('empleadoDescuentoId').value;
    const descuento = parseFloat(document.getElementById('montoDescuento').value);
    console.log("ID del empleado:", empleadoId); // Verificar que el ID del empleado es correcto
    console.log("Monto del descuento:", descuento); // Verificar que el monto de descuento es correcto
    if (isNaN(descuento) || descuento <= 0) {
        alert('Por favor, ingresa un monto de descuento válido.');
        return;
    }
    fetch(`http://localhost:3000/aplicar-descuento/${empleadoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descuento: descuento })
    })
        .then(response => {
            console.log("Respuesta del servidor recibida"); // Confirmar que la respuesta llega
            return response.json();
        })
        .then(data => {
            console.log("Datos de respuesta:", data); // Verificar el contenido de la respuesta
            if (data.success) { // Verificar que el backend responde con un mensaje de éxito
                alert(data.message || 'Descuento aplicado correctamente.');
                $('#descuentoModal').modal('hide');
                mostrarEmpleados(); // Refresca la tabla de empleados
            } else {
                alert(data.message || 'No se pudo aplicar el descuento.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Ocurrió un error en la solicitud. Verifica la consola para más detalles.');
        });
});
function registrarAsistencia(empleadoId, tipoPago) {
    document.getElementById('empleadoId').value = empleadoId;
    document.getElementById('tipoPago').value = tipoPago;
    $('#asistenciaModal').modal('show');
}
function calcularHoras(horaIngreso, horaEgreso) {
    const [ingresoHora, ingresoMinuto] = horaIngreso.split(':').map(Number);
    const [egresoHora, egresoMinuto] = horaEgreso.split(':').map(Number);

    const ingreso = new Date();
    ingreso.setHours(ingresoHora, ingresoMinuto);

    const egreso = new Date();
    egreso.setHours(egresoHora, egresoMinuto);

    const diferenciaMs = egreso - ingreso;
    const horasTrabajadas = diferenciaMs / (1000 * 60 * 60); // Convertir ms a horas

    return horasTrabajadas;
}
document.getElementById('formAsistencia').addEventListener('submit', function (event) {
    event.preventDefault();
    const empleadoId = document.getElementById('empleadoId').value;
    const tipoPago = document.getElementById('tipoPago').value;
    const horaIngreso = document.getElementById('horaIngreso').value;
    const horaEgreso = document.getElementById('horaEgreso').value;

    const horasTrabajadas = calcularHoras(horaIngreso, horaEgreso);

    fetch(`http://localhost:3000/registrar-asistencia/${empleadoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horasTrabajadas, tipoPago })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            $('#asistenciaModal').modal('hide');
            mostrarEmpleados();
        })
        .catch(error => console.error('Error:', error));
});
document.getElementById('cerrarSemana').addEventListener('click', function () {
    if (confirm("¿Estás seguro de que quieres cerrar la semana? Esto reiniciará las horas trabajadas, descuentos y el total a pagar para los empleados por hora.")) {
        reiniciarDatosBackend('PorHora');
    }
});
document.getElementById('cerrarMes').addEventListener('click', function () {
    if (confirm("¿Estás seguro de que quieres cerrar el mes? Esto reiniciará las horas trabajadas, descuentos y el total a pagar para los empleados mensuales.")) {
        reiniciarDatosBackend('Mensual');
    }
});
function reiniciarDatosBackend(tipoPago) {
    fetch(`http://localhost:3000/reiniciar-datos/${tipoPago}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message || `Datos reiniciados para los empleados ${tipoPago === 'PorHora' ? 'por hora (semana)' : 'mensuales (mes)'}.`);
                mostrarEmpleados(); // Refresca la tabla para sincronizar la interfaz
            } else {
                alert(data.message || 'No se pudo reiniciar los datos.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Ocurrió un error al reiniciar los datos. Verifica la consola para más detalles.');
        });
}
function reiniciarDatosEmpleados(tablaId) {
    const filasEmpleados = document.querySelectorAll(`#${tablaId} tbody tr`);
    filasEmpleados.forEach(fila => {
        const horasTrabajadasCell = fila.querySelector('td:nth-child(7)');
        const descuentoCell = fila.querySelector('td:nth-child(9)');
        const totalPagoCell = fila.querySelector('td:nth-child(8)');
        if (horasTrabajadasCell) horasTrabajadasCell.textContent = '0'; // Reinicia horas trabajadas
        if (descuentoCell) descuentoCell.textContent = '0'; // Reinicia descuento
        if (totalPagoCell) totalPagoCell.textContent = '0'; // Reinicia total pago
    });
    alert(`Datos reiniciados para los empleados en ${tablaId === 'empleadosPorHora' ? 'la semana (por hora)' : 'el mes (mensuales)'}.`);
}
mostrarEmpleados();
function eliminarEmpleado(empleadoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
        fetch(`http://localhost:3000/eliminar-empleado/${empleadoId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Empleado eliminado correctamente.');
                mostrarEmpleados(); // Refrescar la tabla
            })
            .catch(error => console.error('Error al eliminar el empleado:', error));
    }
}