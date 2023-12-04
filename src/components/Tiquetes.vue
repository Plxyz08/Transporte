<template>
    <div>
        <!-- Contenedor de asientos -->
        <div v-if="mostrarAsientos" class="asientos-container">
            <h4>Seleccione asientos</h4>
            <div class="asientos-inner-container">
                <q-btn v-for="asiento in asientos" :key="asiento" class="asiento-btn" :label="asiento"
                    @click="seleccionarAsiento(asiento)"
                    :class="{ 'asiento-seleccionado': asientosSeleccionados.includes(asiento) }"
                    :color="asientosSeleccionados.includes(asiento) ? 'primary' : 'white'"
                    :disable="asientosSeleccionados.includes(asiento)" text-color="black">
                    <q-icon v-if="asiento.reservado" :name="'check'" class="asiento-icon"
                        style="color: green; margin-left: 4px;" />
                    <q-icon v-else :name="'event_seat'" class="asiento-icon" style="margin-left: 4px;" />
                </q-btn>
            </div>
        </div>

        <div v-else>
            <q-btn @click="abrirModal" icon="add" color="primary">
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
        <div v-if="asientoSeleccionado" class="formulario">
            <h4>Asiento #{{ asientoSeleccionado.numero }}</h4>
            <q-btn v-if="asientoSeleccionado" type="submit" color="primary" label="Buscar cliente" @click="filtrarclientes"
                class="q-ma-md"></q-btn>
            <q-btn v-if="asientoSeleccionado" type="submit" color="primary" label="Agregar cliente"
                @click="mostrarDialogoAgregarEditarCliente" class="q-ma-md"></q-btn>
            <form v-if="asientoSeleccionado" @submit.prevent="comprarBoleto">
                <q-input type="text" id="cedula" v-model="buscarCedula" outlined label="Cédula" required></q-input>
                <q-input type="tel" id="telefono" v-model="telefono" outlined label="Teléfono" required></q-input>
                <q-input type="text" id="nombre" v-model="nombre" outlined label="Nombre" required></q-input>
                <q-btn type="submit" color="primary" label="Confirmar compra" class="q-ma-md"></q-btn>
            </form>
        </div>
    </div>
</template>
  
<script setup>
import axios from 'axios';
import { watch } from 'vue';
import { ref, onMounted } from 'vue';
import { useBusStore } from '../stores/buses';
import { useRutasStore } from '../stores/rutas';

const busStore = useBusStore();
const rutasStore = useRutasStore();
const mostrarModal = ref(false);
let buses = ref([]);
let rutas = ref([]);
let ruta = ref('');
let busSeleccionado = ref('');
let fechaSalida = ref('');
const mostrarAsientos = ref(false);
let asientos = ref([]);
let asientosSeleccionados = ref([]);

const cargarDatos = async () => {
    try {
        await busStore.getBuses();
        buses.value = busStore.buses.map((bus) => ({
            value: bus.placa,
            label: `${bus.placa} - ${bus.empresa_asignada} - (${bus.cantidad_asientos} asientos)`,
            cantidad_asientos: bus.cantidad_asientos,
        }));
    } catch (error) {
        console.error('Error al cargar la lista de placas de los buses:', error);
    }

    try {
        await rutasStore.getRuta();
        rutas.value = rutasStore.rutas.map((ruta) => ({
            value: ruta.id,
            label: `${ruta.origen} - ${ruta.destino} - (${ruta.horario_id.hora_partida} - ${ruta.horario_id.hora_llegada})`,
            origenDestino: `${ruta.origen} - ${ruta.destino}`,
            horaPartida: ruta.horario_id.hora_partida,
            horaLlegada: ruta.horario_id.hora_llegada,
        }));
    } catch (error) {
        console.error('Error al cargar la lista de rutas o buses:', error);
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

const guardarVentaYMostrarAsientos = () => {
    cargarAsientos(busSeleccionado.value.cantidad_asientos);
    console.log('Cantidad de asientos del bus seleccionado:', busSeleccionado.value.cantidad_asientos);

    mostrarAsientos.value = true;
    mostrarModal.value = false;
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
    mostrarAsientos.value = false;
};

const formularioValido = ref(false);

watch([ruta, busSeleccionado, fechaSalida], () => {
    formularioValido.value = validarFecha(fechaSalida.value) &&
        ruta !== '' &&
        busSeleccionado !== '';
});
</script>
  
<style scoped>
.asientos-container {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
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
}
</style>
  