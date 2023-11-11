<template>
    <div class="q-gutter-md">
        <div class="bus-layout">
            <div class="asientos" v-if="mostrarContenido">
                <h4>Seleccione la silla</h4>
                <div class="fila" v-for="(fila, filaIndex) in filas" :key="filaIndex">
                    <div class="asiento" v-for="(asiento, asientoIndex) in fila" :key="asiento.numero">
                        <button @click="seleccionarAsiento(asiento)" :class="{
                            'asiento-button': true,
                            'selected': asientoSeleccionado === asiento,
                            'reserved': asiento.reservado,
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
                    <!-- Mostrar mensajes de cliente encontrado o no encontrado -->
                    <q-banner v-if="clienteEncontrado" color="positive" icon="check" dense>
                        Cliente encontrado
                    </q-banner>
                    <q-banner v-if="clienteNoEncontrado" color="negative" icon="warning" dense>
                        Cliente no encontrado
                    </q-banner>
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
import { useBusStore } from '../stores/buses';

const clienteStore = useClienteStore();
const busStore = useBusStore();

const filas = generateBusLayout(4, 10);
const mostrarContenido = ref(false);
const asientoSeleccionado = ref(null);
const cedula = ref('');
const telefono = ref('');
const nombre = ref('');
const mostrarModal = ref(false);
const busSeleccionado = ref(null);
const buses = ref([]);
const fechaSalida = ref(null);


onMounted(async () => {
    try {
        await busStore.getBuses();
        buses.value = busStore.buses.map((bus) => bus.placa);
    } catch (error) {
        console.error('Error al cargar la lista de placas de los buses:', error);
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
        asientoSeleccionado.value.classList.remove('selected-green');
        asientoSeleccionado.value.classList.add('confirmed');
        asientoSeleccionado.value = null;
    }
};

const mostrarModalVenta = () => {
    mostrarModal.value = true;
};

const guardarVenta = () => {
    // Validar que se haya seleccionado un bus
    if (!busSeleccionado.value) {
        showErrorMessage('Debes seleccionar un bus.');
        return;
    }

    // Validar que se haya seleccionado una fecha
    if (!fechaSalida.value) {
        showErrorMessage('Debes seleccionar una fecha de salida.');
        return;
    }

    // Validar que la fecha de salida sea a partir del día siguiente al actual
    const fechaActual = new Date();
    const fechaSeleccionada = new Date(fechaSalida.value);

    if (fechaSeleccionada <= fechaActual) {
        showErrorMessage('La fecha de salida debe ser a partir del día siguiente al actual.');
        return;
    }

    // Si se cumple ambas validaciones, puedes cerrar el modal
    mostrarModal.value = false;

    // Mostrar los asientos
    mostrarContenido.value = true;
};


const showErrorMessage = (message) => {
    // Aquí puedes personalizar la lógica para mostrar una notificación de error
    alert(message); // Ejemplo: muestra una alerta con el mensaje de error
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
    /* Fondo blanco */
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 10%;
    font-weight: bold;
    font-size: 14px;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* Sombra suave */
    transition: background-color 0.3s;
    /* Transición para el cambio de color de fondo */
}

.reserved {
    background-color: #ff0000;
}

.confirmed {
    background-color: blue;
    color: white;
}


.reserved {
    background-color: #ff0000;
}

.asiento-icon {
    font-size: 20px;
}

.venta-dialog {
    max-width: 400px;
}
</style>
  