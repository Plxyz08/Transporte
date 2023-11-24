<template>
    <div class="q-gutter-md">
        <div class="bus-layout">
            <div class="asientos" v-if="mostrarContenido">
                <h4>Seleccione la silla</h4>
                <div class="fila" v-for="(fila, filaIndex) in filas" :key="filaIndex">
                    <div class="asiento" v-for="(asiento, asientoIndex) in fila" :key="asiento.numero">
                        <button @click="seleccionarAsiento(asiento)" :class="{
                            'asiento-button': true,
                            selected: asientoSeleccionado === asiento,
                            reserved: asiento.reservado,
                        }">
                            <q-icon :name="asiento.reservado ? 'check' : 'event_seat'" class="asiento-icon"></q-icon>
                            {{ asiento.numero }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-else>
                <q-btn @click="mostrarModalVenta" icon="add" color="primary">Agregar venta</q-btn>
            </div>
            <div v-if="asientoSeleccionado" class="formulario">
                <h4>Asiento #{{ asientoSeleccionado.numero }}</h4>
                <q-btn type="submit" color="primary" label="Buscar cliente" @click="filtrarclientes"
                    class="q-ma-md"></q-btn>
                <q-btn type="submit" color="primary" label="Agregar cliente" @click="mostrarDialogoAgregarEditarCliente"
                    class="q-ma-md"></q-btn>
                <form @submit.prevent="comprarBoleto">
                    <label for="cedula">Cédula:</label>
                    <q-input type="text" id="cedula" v-model="buscarCedula" outlined label="Cédula" required></q-input>
                    <label for="telefono">Teléfono:</label>
                    <q-input type="tel" id="telefono" v-model="telefono" outlined label="Teléfono" required></q-input>
                    <label for="nombre">Nombre:</label>
                    <q-input type="text" id="nombre" v-model="nombre" outlined label="Nombre" required></q-input>

                    <q-banner v-if="clienteEncontrado" color="positive" icon="check" dense>
                        Cliente encontrado
                    </q-banner>
                    <q-banner v-if="clienteNoEncontrado" color="negative" icon="warning" dense>
                        Cliente no encontrado
                    </q-banner>


                    <q-btn type="submit" color="primary" label="Confirmar compra" class="q-ma-md"></q-btn>
                </form>
            </div>
            <q-dialog v-model="mostrarModal" class="venta-dialog">
                <q-card class="modal-content">
                    <q-card-section class="q-pa-md">
                        <h4>Registrar Venta</h4>
                        <q-select v-model="ruta" :options="rutas" label="Rutas" />
                        <q-select v-model="busSeleccionado" label="Bus" :options="buses"></q-select>
                        <q-input v-model="fechaSalida" filled type="date" hint="Fecha de Salida" style="width: 300px" />
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" color="negative" v-close-popup></q-btn>
                        <q-btn flat label="Guardar" color="primary" @click="guardarVenta" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <q-dialog v-model="fixed">
                <q-card class="modal-content">
                    <q-card-section class="row items-center q-pb-none" style="color: black">
                        <div class="text-h6">{{ text }}</div>
                        <q-space />
                        <q-btn icon="close" flat round dense @click="cerrarDialogo" />
                    </q-card-section>
                    <q-separator />

                    <q-card-section style="max-height: 50vh" class="scroll">
                        <q-input v-model="nuevaCedula" label="Cédula" style="width: 300px" />
                        <q-input v-model="nuevoNombre" label="Nombre" style="width: 300px" />
                        <q-input v-model="nuevoTelefono" label="Teléfono" style="width: 300px" />
                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right">
                        <q-btn flat label="Cerrar" color="primary" @click="cerrarDialogo" />
                        <q-btn flat label="Guardar" color="primary" @click="agregarCliente" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>
  
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useClienteStore } from "../stores/clientes.js";
import { useBusStore } from "../stores/buses";
import { useRutasStore } from "../stores/rutas";

const clienteStore = useClienteStore();
const busStore = useBusStore();
const rutasStore = useRutasStore();

const fixed = ref(false);
const text = ref("Agregar Cliente");

const rows = ref([]);

const filas = generateBusLayout(4, 10);
const mostrarContenido = ref(false);
const asientoSeleccionado = ref(null);
const cedula = ref('');
const telefono = ref('');
const nombre = ref('');
const mostrarModal = ref(false);
const busSeleccionado = ref(null);
const rutas = ref([]);
const ruta = ref(null);
const buses = ref([]);
const fechaSalida = ref(null);
const clienteEncontrado = ref(false);
const clienteNoEncontrado = ref(false);
const nuevaCedula = ref('');
const nuevoNombre = ref('');
const nuevoTelefono = ref('');
const buscarCedula = ref('');

onMounted(async () => {
    await clienteStore.getCliente();
    try {
        await busStore.getBuses();
        buses.value = busStore.buses.map((bus) => bus.placa);
    } catch (error) {
        console.error("Error al cargar la lista de placas de los buses:", error);
    }

    try {
        await rutasStore.getRuta();
        rutas.value = rutasStore.rutas.map((ruta) => ({
            value: ruta.id,
            label: `${ruta.origen} - ${ruta.destino}`,
            origenDestino: `${ruta.origen} - ${ruta.destino}`
        }));
    } catch (error) {
        console.error("Error al cargar la lista de rutas o buses:", error);
    }
});

const seleccionarAsiento = (asiento) => {
    if (!asiento.reservado) {
        if (asientoSeleccionado.value === asiento) {
            asientoSeleccionado.value = null;
        } else {
            asientoSeleccionado.value = asiento;
        }
    }
};

const comprarBoleto = () => {
    if (asientoSeleccionado.value) {
        // Tu lógica para confirmar la compra del boleto y guardar los detalles de la venta
        const venta = {
            numeroTicket: generateTicketNumber(),
            nombreVendedor: "Nombre del Vendedor",
            fechaVenta: new Date(),
            fechaSalida: fechaSalida.value,
            horaSalida: "Hora de Salida",
            ccPasajero: cedula.value,
            nombrePasajero: nombre.value,
            vehiculo: busSeleccionado.value,
            origen: "Origen",
            destino: "Destino",
            silla: asientoSeleccionado.value.numero,
            valor: "Valor",
        };

        // Agregar la venta a la tabla de tickets usando el clienteStore
        clienteStore.agregarTicket(venta);

        // Restablecer valores
        asientoSeleccionado.value.classList.remove("selected-green");
        asientoSeleccionado.value.classList.add("confirmed");
        asientoSeleccionado.value = null;
    }
};


// Función para generar un número de ticket único (solo como ejemplo, implementa la tuya)
const generateTicketNumber = () => {
    return Math.floor(Math.random() * 1000000) + 1;
};

const mostrarModalVenta = () => {
    mostrarModal.value = true;
};

const guardarVenta = () => {
    if (!ruta.value) {
        showErrorMessage('Debes seleccionar una ruta.');
        return;
    }

    if (!busSeleccionado.value) {
        showErrorMessage('Debes seleccionar un bus.');
        return;
    }

    if (!fechaSalida.value) {
        showErrorMessage('Debes seleccionar una fecha de salida.');
        return;
    }

    const fechaActual = new Date();
    const fechaSeleccionada = new Date(fechaSalida.value);

    if (fechaSeleccionada <= fechaActual) {
        showErrorMessage('La fecha de salida debe ser a partir del día siguiente al actual.');
        return;
    }

    mostrarModal.value = false;
    mostrarContenido.value = true;
};

const mostrarDialogoAgregarEditarCliente = () => {
    fixed.value = true;
    text.value = "Agregar Cliente";
};

const cerrarDialogo = () => {
    fixed.value = false;
    cedula.value = '';
    nombre.value = '';
    telefono.value = '';
};

const filtrarclientes = async () => {
    clienteEncontrado.value = false; // Reiniciar la bandera
    clienteNoEncontrado.value = false; // Reiniciar la bandera

    if (buscarCedula.value.trim() === "") {
        // Si no hay cédula especificada, muestra todos los clientes
        clienteStore.clientes = clienteStore.clientes;
    } else {
        // Filtra los clientes por cédula
        try {
            const clienteEncontrado = await clienteStore.getClienteByCedula(buscarCedula.value.trim());
            console.log("Resultado de la búsqueda:", clienteEncontrado);
            if (clienteEncontrado) {
                console.log("Cliente encontrado");
                // Actualizar el formulario con la información del cliente encontrado
                cedula.value = clienteEncontrado.cedula;
                nombre.value = clienteEncontrado.nombre;
                telefono.value = clienteEncontrado.telefono;
                clienteEncontrado.value = true; // Actualizar la bandera
            } else {
                console.log("Cliente no encontrado");
                clienteNoEncontrado.value = true; // Actualizar la bandera
                // Puedes mostrar un mensaje al usuario indicando que el cliente no fue encontrado
            }
        } catch (error) {
            console.error("Error al buscar cliente por cédula:", error);
            // Manejar el error según tus necesidades
        }
    }
};

const agregarCliente = async () => {
    try {
        // Verificar que los campos no estén vacíos
        if (!nuevaCedula.value || !nuevoNombre.value || !nuevoTelefono.value) {
            showErrorMessage('Todos los campos son obligatorios');
            return;
        }

        // Enviar la solicitud para agregar el nuevo cliente
        const nuevoCliente = {
            cedula: nuevaCedula.value,
            nombre: nuevoNombre.value,
            telefono: nuevoTelefono.value,
        };

        await clienteStore.postCliente(nuevoCliente);

        // Actualizar la lista de clientes después de agregar uno nuevo
        await clienteStore.getCliente();

        // Limpiar los campos del nuevo cliente
        nuevaCedula.value = '';
        nuevoNombre.value = '';
        nuevoTelefono.value = '';

        showErrorMessage('Cliente agregado con éxito');
    } catch (error) {


    }
};


function generateBusLayout(filas, asientosPorFila) {
    const layout = [];
    let numeroSilla = 1;
    for (let fila = 1; fila <= filas; fila++) {
        const filaAsientos = [];
        for (let asiento = 1; asiento <= asientosPorFila; asiento++) {
            filaAsientos.push({ numero: numeroSilla, reservado: false });
            numeroSilla++;
        }
        layout.push(filaAsientos);
    }
    return layout;
}

const showErrorMessage = (message) => {
    alert(message);
};
</script>

<style scoped>
* {
    color: black;
}

.bus-layout {
    display: flex;
    flex-direction: row;
}

.asientos {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    margin: 2rem 6rem 1rem 1rem;
}

.fila {
    display: flex;
    margin: 5px;
}

.asiento {
    margin: 5px;
}

.fila {
    justify-content: center;
    align-items: center;
}

.asiento-button {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 10%;
    font-weight: bold;
    font-size: 14px;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}

.asiento-button.selected {
    background-color: green;
    color: white;
}

.asiento-button.reserved {
    background-color: #ff0000;
}

.asiento-button.confirmed {
    background-color: blue;
    color: white;
}

.asiento-icon {
    font-size: 20px;
}

.venta-dialog {
    max-width: 400px;
}

.q-select__label {
    color: black;
}
.q-item__label {
    color: black;
}

.q-theme-dark {
    color: black;
}
</style>
