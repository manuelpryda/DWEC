const form = document.getElementById("citaForm");
        const tablaCitas = document.getElementById("tablaCitas").getElementsByTagName("tbody")[0];
        let citas = JSON.parse(localStorage.getItem("citas")) || []; // Cargar citas desde localStorage

        // Renderizar citas iniciales
        renderCitas();

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            // Validar formulario usando los atributos de validación HTML5
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Validar que la fecha sea futura
            const fechaInput = document.getElementById("fecha");
            const fecha = fechaInput.value;
            const fechaActual = new Date().toISOString().split("T")[0];

            if (fecha <= fechaActual) {
                alert("La fecha debe ser posterior a la actual.");
                return;
            }

            const dni = document.getElementById("dni").value;
            const primerApellido = document.getElementById("primerApellido").value;
            const segundoApellido = document.getElementById("segundoApellido").value;
            const nombre = document.getElementById("nombre").value;
            const telefono = document.getElementById("telefono").value;
            const hora = document.getElementById("hora").value;
            const editIndex = document.getElementById("editIndex").value;

            // Validar si el DNI o la combinación de fecha y hora ya existen
            const existeCita = citas.some((cita, index) => {
            const esMismaCita = index === parseInt(editIndex, 10); // Ignorar la cita que se está editando
            return (!esMismaCita && (cita.dni === dni || (cita.fecha === fecha && cita.hora === hora)));
            });

            if (existeCita) {
            alert("No puede haber dos citas con el mismo DNI o la misma fecha y hora.");
             return;
            }

            if (editIndex === "-1") {
                // Añadir nueva cita
                citas.push({ dni, primerApellido, segundoApellido, nombre, telefono, fecha, hora });
            } else {
                // Modificar cita existente
                citas[editIndex] = { dni, primerApellido, segundoApellido, nombre, telefono, fecha, hora };
                document.getElementById("editIndex").value = "-1";
            }

            // Guardar citas en localStorage
            localStorage.setItem("citas", JSON.stringify(citas));

            form.reset();
            renderCitas();
        });

        function renderCitas() {
            console.log("Citas guardadas:", citas); // Registro del array citas
            tablaCitas.innerHTML = "";
            citas.forEach((cita, index) => {
                const row = tablaCitas.insertRow();
                row.insertCell(0).textContent = cita.dni;
                row.insertCell(1).textContent = cita.primerApellido;
                row.insertCell(2).textContent = cita.segundoApellido;
                row.insertCell(3).textContent = cita.nombre;
                row.insertCell(4).textContent = cita.telefono;
                row.insertCell(5).textContent = cita.fecha;
                row.insertCell(6).textContent = cita.hora;

                const acciones = row.insertCell(7);
                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.onclick = () => editarCita(index);
                const btnEliminar = document.createElement("button");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.onclick = () => eliminarCita(index);

                acciones.appendChild(btnEditar);
                acciones.appendChild(btnEliminar);
            });
        }

        function editarCita(index) {
            const cita = citas[index];
            document.getElementById("dni").value = cita.dni;
            document.getElementById("primerApellido").value = cita.primerApellido;
            document.getElementById("segundoApellido").value = cita.segundoApellido;
            document.getElementById("nombre").value = cita.nombre;
            document.getElementById("telefono").value = cita.telefono;
            document.getElementById("fecha").value = cita.fecha;
            document.getElementById("hora").value = cita.hora;
            document.getElementById("editIndex").value = index;
        }

        function eliminarCita(index) {
            citas.splice(index, 1);

            // Actualizar localStorage
            localStorage.setItem("citas", JSON.stringify(citas));

            renderCitas();
        }