<template>
    <div class="contenedor-principal">

        <!-- Contenedor de asientos -->
        <div v-if="mostrarAsientos" class="asientos-container">
            <h4>Seleccione asientos</h4>
            <div class="asientos-inner-container">
                <q-btn v-for="asiento in asientos" :key="asiento" class="asiento-btn" :label="asiento"
                    @click="seleccionarAsiento(asiento)" :class="{
                        'asiento-seleccionado': asientosSeleccionados.includes(asiento),
                        'asiento-reservado': asiento.reservado,
                    }" :color="asientosSeleccionados.includes(asiento) ? 'primary' : 'white'"
                    :disable="asientosSeleccionados.includes(asiento)" text-color="black"
                    style="width: 50px; height: 60px;">
                    <q-icon v-if="asiento.reservado" :name="'check'" class="asiento-icon"
                        style="color: green; margin-left: 4px;" />
                    <q-icon v-else :name="'event_seat'" class="asiento-icon" style="margin-left: 4px;" />
                </q-btn>
            </div>
        </div>


        <div v-else>
            <q-btn @click="abrirModal" icon="add" color="primary" v-if="asientoSeleccionado === null">
                Agregar venta
            </q-btn>
        </div>

        <!-- Modal para registrar venta -->
        <q-dialog v-model="mostrarModal" class="venta-dialog">
            <q-card class="modal-content">
                <q-card-section class="q-pa-md">
                    <h4>Registrar Venta</h4>
                    <q-select v-model="ruta" :options="rutas" label="Rutas"
                        :rules="[val => val !== undefined && val !== '', 'Seleccione una ruta']" />
                    <q-select v-model="busSeleccionado" :options="buses" label="Bus"
                        :rules="[val => val !== undefined && val !== '', 'Seleccione un bus']" />
                    <q-input v-model="fechaSalida" filled type="date" hint="Fecha de Salida" style="width: 300px"
                        :rules="[val => validarFecha(val), 'La fecha debe ser válida y mayor o igual a hoy']" />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="negative" v-close-popup></q-btn>
                    <q-btn flat label="Guardar" color="primary" @click="guardarVentaYMostrarAsientos"
                        :disable="!formularioValido" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Formulario para el asiento seleccionado -->
        <div v-if="asientoSeleccionado || mostrarModal" class="formulario">
            <h4 v-if="asientoSeleccionado">Asiento #{{ asientoSeleccionado.numero }}</h4>
            <q-icon v-if="clienteEncontrado === true" name="check" color="green" size="24px" />
            <q-icon v-else-if="clienteEncontrado === false" name="clear" color="red" size="24px" />
            <q-btn v-if="asientoSeleccionado" type="submit" color="primary" label="Buscar cliente" @click="filtrarclientes"
                class="q-ma-md"></q-btn>
            <q-btn v-if="asientoSeleccionado" type="submit" color="primary" label="Agregar cliente" @click="agregarCliente"
                class="q-ma-md"></q-btn>
            <form v-if="asientoSeleccionado" @submit.prevent="comprarBoleto">
                <q-input type="text" id="cedula" v-model="buscarCedula" outlined label="Cédula" required
                    class="ml"></q-input>
                <q-input type="number" id="telefono" v-model="telefono" outlined label="Teléfono" required
                    class="ml"></q-input>
                <q-input type="text" id="nombre" v-model="nombre" outlined label="Nombre" required class="ml"></q-input>
                <q-btn type="submit" color="primary" label="Confirmar compra" class="q-ma-md" @click="confirmarCompra"></q-btn>
            </form>
        </div>

        <!-- Modal para agregar cliente -->
        <q-dialog v-model="mostrarModalCliente" class="cliente-dialog">
            <q-card class="modal-content">
                <q-card-section class="q-pa-md">
                    <h4>Agregar Cliente</h4>
                    <q-input v-model="newCedula" label="Cédula" outlined :rules="cedulaRules" />
                    <q-input v-model="newNombre" label="Nombre" outlined :rules="nombreRules" />
                    <q-input v-model="newTelefono" label="Teléfono" outlined :rules="telefonoRules" />
                    <q-spinner v-if="loadingCliente" color="primary" size="40px" />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="negative" @click="cerrarModalCliente" />
                    <q-btn flat label="Guardar" color="primary" @click="guardarCliente"
                        :disable="!formularioClienteValido"/>
                </q-card-actions>

            </q-card>
        </q-dialog>

    </div>
</template>
  
<script setup>
import axios from 'axios';
import { watch } from 'vue';
import { ref, onMounted } from 'vue';
import { useBusStore } from '../stores/buses';
import { useRutasStore } from '../stores/rutas';
import { useClienteStore } from '../stores/clientes';
import { useVentasStore } from '../stores/ventas';
import { useAdminStore } from '../stores/login';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const mostrarModalCliente = ref(false);
const clienteStore = useClienteStore();
const busStore = useBusStore();
const ventasStore = useVentasStore();
const adminStore = useAdminStore();
const rutasStore = useRutasStore();
const mostrarModal = ref(false);
let buscarCedula = ref('');
let clienteEncontrado = ref(null);
let buses = ref([]);
let rutas = ref([]);
let ruta = ref('');
let newCedula = ref();
let newTelefono = ref();
let newNombre = ref("");
let telefono = ref();
let nombre = ref("");
let busSeleccionado = ref('');
let fechaSalida = ref('');
const mostrarAsientos = ref(false);
let asientos = ref([]);
let asientosSeleccionados = ref([]);

const cerrarModalCliente = () => {
    mostrarModalCliente.value = false;
};

const cargarDatos = async () => {
    try {
        await busStore.getBuses();
        buses.value = busStore.buses
            .filter((value) => value.estado)
            .map((bus) => {
                return {
                    value: bus.placa,
                    label: `${bus.placa} - ${bus.empresa_asignada} - (${bus.cantidad_asientos} asientos)`,
                    cantidad_asientos: bus.cantidad_asientos,
                    estado: bus.estado,
                };
            });
    } catch (error) {
        console.error('Error al cargar la lista de placas de los buses:', error);
    }

    try {
        await rutasStore.getRuta();

        rutas.value = rutasStore.rutas
            .filter((value) => value.estado)
            .map((ruta) => ({
                value: ruta.id,
                label: `${ruta.origen} - ${ruta.destino} - (${ruta.horario_id.hora_partida} - ${ruta.horario_id.hora_llegada})`,
                origenDestino: `${ruta.origen} - ${ruta.destino}`,
                horaPartida: ruta.horario_id.hora_partida,
                horaLlegada: ruta.horario_id.hora_llegada,
                estado: ruta.estado,
            }));
    } catch (error) {
        console.error('Error al cargar la lista de rutas o buses:', error);
    }

    try {
        await clienteStore.getCliente();
        /* console.log('Clientes:', clienteStore.clientes); */
    } catch (error) {

    }
};

const filtrarclientes = async () => {
    try {
        const cedulaBuscada = buscarCedula.value;
        console.log('Cedula buscada:', cedulaBuscada);

        console.log('Cedulas de clientes:', clienteStore.clientes.map(cliente => cliente.cedula));

        const clienteEncontrado = clienteStore.clientes.find(cliente => cliente.cedula === Number(cedulaBuscada));

        if (clienteEncontrado) {
            buscarCedula.value = clienteEncontrado.cedula;
            telefono.value = clienteEncontrado.telefono;
            nombre.value = clienteEncontrado.nombre;

            clienteEncontrado.value = true;
            greatMessage.value = "Cliente encontrado";
            showGreat();
            /* console.log('Cliente encontrado:', clienteEncontrado); */
        } else {
            clienteEncontrado.value = false;
            badMessage.value = "No existe registro";
            showBad();
            console.log('Cliente no encontrado');
        }

    } catch (error) {
        console.error('Error al buscar el cliente:', error);
    }
};

const agregarCliente = () => {
    mostrarModalCliente.value = true;
};

const guardarCliente = async () => {
    loadingCliente.value = true;

    try {
        await clienteStore.postCliente({
            cedula: newCedula.value,
            nombre: newNombre.value,
            telefono: newTelefono.value,
        });

    } catch (error) {
        console.error('Error saving client:', error);
    } finally {
        loadingCliente.value = false;
    }
};

const abrirModal = () => {
    mostrarModal.value = true;
    cargarDatos();
}

const hoy = new Date();

const validarFecha = (dateString) => {
    const selectedDate = new Date(dateString);
    return (
        !isNaN(selectedDate.getTime()) &&
        selectedDate.toISOString().split('T')[0] >= hoy.toISOString().split('T')[0]
    );
};

const guardarVentaYMostrarAsientos = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        cargarAsientos(busSeleccionado.value.cantidad_asientos);
        mostrarAsientos.value = true;
        mostrarModal.value = false;
    } catch (error) {
        console.error('Error:', error);
    }
};

const cargarAsientos = (cantidadAsientos) => {
    asientos.value = Array.from({ length: cantidadAsientos }, (_, index) => index + 1);
    asientosSeleccionados.value = [];
};

let asientoSeleccionado = ref(null);

const seleccionarAsiento = (asiento) => {
    asientoSeleccionado.value = {
        numero: asiento,
    };
    /* mostrarAsientos.value = false; */
};

const confirmarCompra = async () => {
    try {
        await ventasStore.postTicket({
            
        })
    } catch (error) {
        
    }
};

let greatMessage = ref("");
let badMessage = ref("");
let notification = ref(null);

const showGreat = () => {
    notification = $q.notify({
        spinner: false,
        message: greatMessage,
        timeout: 2000,
        type: "positive",
    });
};

const showBad = () => {
    notification = $q.notify({
        spinner: false,
        message: badMessage,
        timeout: 2000,
        type: "negative",
    });
};

const cancelShow = () => {
    if (notification) {
        notification();
    }
}

const formularioValido = ref(false);

watch([ruta, busSeleccionado, fechaSalida], () => {
    formularioValido.value = validarFecha(fechaSalida.value) &&
        ruta !== '' &&
        busSeleccionado !== '';
});
</script>
  
<style scoped>
.contenedor-principal {
    display: flex;
}

.asientos-container {
    flex: 1;
    margin-right: 20px;
}

.asientos-inner-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 500px;
}

.formulario {
    margin-left: 20px;
    max-width: 400px;
    align-self: flex-start;
}

.ml {
    margin-bottom: 8px;
}

q-btn {
    width: 20px;
}

h3 {
    margin: 10px;
}

.asiento-seleccionado {
    background-color: blue !important;
    /* Ajusta el color según tu preferencia */
}
</style>
  