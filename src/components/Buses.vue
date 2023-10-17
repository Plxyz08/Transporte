<template>
    <div>
        <q-btn color="primary" @click="abrirModalAgregar">Agregar</q-btn>
        <div class="q-pa-md">
            <q-table title="Buses" :rows="rows" :columns="columns" row-key="numero_bus">
                <template v-slot:body-cell-opciones="props">
                    <div class="q-td opciones">
                        <q-btn color="primary" class="opcion-btn" @click="abrirModalEditar(props.row)">
                            🖋️
                        </q-btn>

                        <q-btn color="secondary" class="opcion-btn" @click="inactivarBus(props.row)">
                            ❌
                        </q-btn>
                    </div>
                </template>
            </q-table>
        </div>
        <button><router-link to="/">Volver</router-link></button>
        <router-view></router-view>

        <q-dialog v-model="mostrarModalEditar">
            <q-card>
                <q-card-section>
                    <q-input v-model="busEditado.cantidad_asientos" label="Cantidad de asientos"></q-input>
                    <q-input v-model="busEditado.empresa_asignada" label="Empresa asignada"></q-input>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Guardar Cambios" color="primary" @click="editarFila"></q-btn>
                    <q-btn label="Cerrar" color="secondary" @click="cerrarModalEditar"></q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { format } from 'date-fns';

const rows = ref([]);
const nuevoBus = ref({
    placa: '',
    numero_bus: '',
    cantidad_asientos: '',
    empresa_asignada: '',
});
const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);
const busEditado = ref({});

const API_URL = 'https://transporte-czaa.onrender.com/api/bus';

async function obtenerinfo() {
    try {
        const apiUrl = `${API_URL}/buses`;
        let response = await axios.get(apiUrl);
        rows.value = response.data.buses;
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    obtenerinfo();
});

const columns = [
    {
        name: 'placa',
        required: true,
        label: 'Placa',
        align: 'left',
        field: 'placa',
        sortable: true,
    },
    {
        name: 'numero_bus',
        required: true,
        label: 'Numero de bus',
        align: 'left',
        field: 'numero_bus',
        sortable: true,
    },
    {
        name: 'cantidad_asientos',
        required: true,
        label: 'Cantidad de asientos',
        align: 'left',
        field: 'cantidad_asientos',
        sortable: true,
    },
    {
        name: 'empresa_asignada',
        required: true,
        label: 'Empresa asignada',
        align: 'left',
        field: 'empresa_asignada',
        sortable: true,
    },
    {
        name: 'estado',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'estado',
        sortable: true,
        format: (val) => (val ? 'Activo' : 'Inactivo'),
    },
    {
        name: 'fecha_creacion',
        required: true,
        label: 'Fecha de creación',
        align: 'left',
        field: 'createAT',
        sortable: true,
        format: (val) => format(new Date(val), 'yyyy-MM-dd'),
    },
    {
        name: 'opciones',
        label: 'Opciones',
        align: 'center',
    },
];


function abrirModalAgregar() {
    mostrarModalAgregar.value = true;
}

function cerrarModalAgregar() {
    mostrarModalAgregar.value = false;
}

function abrirModalEditar(bus) {
    console.log('Abriendo modal de edición', bus);
    busEditado.value = { ...bus };
    mostrarModalEditar.value = true;
}

function cerrarModalEditar() {
    mostrarModalEditar.value = false;
}

function editarFila() {
    const { cantidad_asientos, empresa_asignada } = busEditado.value;

    const cambios = {
        cantidad_asientos,
        empresa_asignada
    };

    axios.put(`${API_URL}/bus/${id}`, cambios)
        .then(() => {
            const filaEditada = buses.value.find((bus) => bus.id === id);
            if (filaEditada) {
                Object.assign(filaEditada, cambios);
            }
            cerrarModalEditar();
        })
        .catch((error) => {
            console.error('Error al editar la fila:', error);
        });
}



function inactivarBus(bus) {
    axios.put(`${API_URL}/bus/${bus.numero_bus}`, { estado: false })
        .then(() => {
            bus.estado = false;
        })
        .catch((error) => {
            console.error('Error al inactivar el bus:', error);
        });
}
</script>

<style scoped>
.q-table-container .q-td.opciones {
    text-align: center;
}

.q-btn.opcion-btn {
    margin-right: 5px;
}
</style>