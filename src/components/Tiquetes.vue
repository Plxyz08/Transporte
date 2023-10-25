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
                <q-btn @click="mostrarModalVenta" icon="add" color="primary"> Agregar venta </q-btn>
            </div>
            <div v-if="asientoSeleccionado" class="formulario">
                <h4>Asiento #{{ asientoSeleccionado.numero }}</h4>
                <q-btn type="submit" color="primary" label="Buscar cliente" @click="buscarCliente" class="q-ma-md"></q-btn>
                <q-btn type="submit" color="primary" label="Agregar cliente" class="q-ma-md"></q-btn>
                <form @submit.prevent="comprarBoleto">
                    <label for="cedula">Cédula:</label>
                    <q-input type="text" id="cedula" v-model="cedula" outlined label="Cédula" required></q-input>
                    <label for="telefono">Teléfono:</label>
                    <q-input type="tel" id="telefono" v-model="telefono" outlined label="Teléfono" required></q-input>
                    <label for="nombre">Nombre:</label>
                    <q-input type="text" id="nombre" v-model="nombre" outlined label="Nombre" required></q-input>
                    <q-btn type="submit" color="primary" label="Confirmar compra" class="q-ma-md"></q-btn>
                </form>
            </div>
            <q-dialog v-model="mostrarModal" class="venta-dialog">
                <q-card class="modal-content">
                    <q-card-section class="q-pa-md">
                        <h4>Registrar Venta</h4>
                        <q-select v-model="busSeleccionado" label="Bus" :options="buses"></q-select>
                        <q-date class="q-ma-md" v-model="fechaSalida" label="Fecha de Salida" />
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" color="negative" v-close-popup></q-btn>
                        <q-btn flat label="Guardar" color="primary" @click="guardarVenta" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useClienteStore } from '../stores/clientes';

// Datos
const filas = generateBusLayout(4, 10);
const mostrarContenido = ref(false);
const asientoSeleccionado = ref(null);
const cedula = ref("");
const telefono = ref("");
const nombre = ref("");
const mostrarModal = ref(false);
const busSeleccionado = ref(null);
const buses = ref([]);
const fechaSalida = ref(null);


const clienteStore = useClienteStore();

// Método para buscar cliente
const buscarCliente = async () => {
  try {
    await clienteStore.getCliente(); // Invoca la función getCliente del store
  } catch (error) {
    console.error('Error al buscar cliente:', error);
  }
};
// Métodos
const reservarAsiento = (asiento) => {
    if (!asiento.reservado) {
        asiento.reservado = true;
    }
};

const seleccionarAsiento = (asiento) => {
    if (!asiento.reservado) {
        asientoSeleccionado.value = asiento;
    }
};

const comprarBoleto = () => {
    asientoSeleccionado.value = null;
};

const iniciarVenta = () => {
    mostrarContenido.value = true;
};

const mostrarModalVenta = () => {
    mostrarModal.value = true;
};

const guardarVenta = () => {
    // Aquí puedes manejar la lógica para guardar la venta, la ruta, el vehículo y la fecha seleccionados.
    mostrarModal.value = false;
    mostrarContenido.value = true;
};

// Generador de diseño de autobús
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
</script>
  
<style scoped>
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

/* Personaliza el estilo de las filas y asientos para darle forma de bus */
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
    background-color: #f0f0f0;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 10%;
    font-weight: bold;
    font-size: 14px;
    color: #333;
}

.selected {
    background-color: #00b0ff;
}

.reserved {
    background-color: #ff0000;
}

.asiento-icon {
    font-size: 20px;
}

/* Estilo para el diálogo de venta */
.venta-dialog {
    max-width: 400px;
}
</style>
  