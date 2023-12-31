<template>
    <div>
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <q-card-section class="row items-center q-pb-none" style="color: black;">
                    <div class="text-h6">{{ text }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <q-input v-model="placa" label="Placa" style="width: 300px;" />
                    <q-input v-model="numero_bus" label="Número de Bus" style="width: 300px;" />

                    <q-input v-model="cantidad_asientos" label="Cantidad de Asientos" style="width: 300px;" />
                    <q-input v-model="empresa_asignada" label="Empresa Asignada" style="width: 300px;" />
                    <q-select v-model="conductorSeleccionado" :options="conductores" label="Conductor" />

                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar" color="primary" @click="agregarEditarBus" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div>
            <h3>Buses</h3>
            <q-row>
                <!-- Single column for both "Agregar Bus" and "Buscar por Placa" -->
                <q-col class="col-container" :span="12">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <!-- "Agregar Bus" button -->
                        <div class="btn-agregar">
                            <q-btn color="primary" label="Agregar" @click="agregarBus()" />
                        </div>

                        <!-- "Buscar por Placa" input and "Buscar" button -->
                        <div style="display: flex; align-items: center;">
                            <q-input v-model="buscarplaca" label="Buscar por Placa"
                                style="width: 300px; border-radius: 10px; background-color: azure; margin-right: 10px;" />
                            <q-btn color="primary" label="Buscar" @click="filtrarbuses" class="btnbuscar" />
                        </div>
                    </div>
                </q-col>
            </q-row>

            <div class="q-pa-md">
                <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
                    <template v-slot:body-cell-estado="props">
                        <q-td :props="props">
                            <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
                            <label for="" v-else style="color: red;">Inactivo</label>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-opciones="props">
                        <q-td :props="props" class="botones">
                            <q-btn color="blue-4" style="margin-right: 5px;" text-color="black"
                                @click="EditarBus(props.row._id)"><q-icon name="edit" /></q-btn>
                            <q-btn color="green-4" glossy @click="InactivarBus(props.row._id)"
                                v-if="props.row.estado == 1"><q-icon name="toggle_on" /></q-btn>
                            <q-btn color="red-4" glossy @click="ActivarBus(props.row._id)" v-else><q-icon
                                    name="toggle_off" /></q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useBusStore } from '../stores/buses.js';
import { useConductorStore } from '../stores/conductores.js';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const busStore = useBusStore();
const conductorStore = useConductorStore();

let buses = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref('');
let placa = ref('');
let numero_bus = ref('');
let cantidad_asientos = ref('');
let empresa_asignada = ref('');
let cambio = ref(0);
let conductorSeleccionado = ref('');
let conductores = ref([]);
let buscarplaca = ref('');
let notificacion = ref(null);

async function obtenerInfo() {
    try {
        await busStore.getBuses();
        buses.value = busStore.buses;
        rows.value = busStore.buses.reverse();
    } catch (error) {
        console.error(error);
    }
}

async function obtenerConductores() {
    try {
        await conductorStore.getConductor();
        conductores.value = conductorStore.conductores.map((conductor) => ({
            label: `${conductor.nombre} - ${conductor.telefono}`,
            value: conductor._id,
        }));

    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    await obtenerInfo();
    await obtenerConductores();

});

const columns = [
    { name: 'placa', label: 'Placa', field: 'placa', sortable: true },
    { name: 'numero_bus', label: 'Número de Bus', field: 'numero_bus', sortable: true },
    { name: 'cantidad_asientos', label: 'Cantidad de Asientos', field: 'cantidad_asientos' },
    { name: 'empresa_asignada', label: 'Empresa Asignada', field: 'empresa_asignada' },
    { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
    {
        name: "nombre",
        label: "Nombre Conductor",
        field: (row) => row.conductor_id.nombre,
    },
    {
        name: "cedula",
        label: "Cedula Conductor",
        field: (row) => row.conductor_id.cedula,
    },
    {
        name: "telefono",
        label: "Telefono Conductor",
        field: (row) => row.conductor_id.telefono,
    },
    { name: "estado", label: "Estado", field: "estado", sortable: true },
    {
        name: "createAT",
        label: "Fecha de Creación",
        field: "createAT",
        sortable: true,
        format: (val) => format(new Date(val), "yyyy-MM-dd"),
    },
    {
        name: "opciones",
        label: "Opciones",
        field: (row) => null,
        sortable: false,
    },
];

function agregarBus() {
    fixed.value = true;
    text.value = 'Agregar Bus';
    cambio.value = 0;
    limpiar();
}

async function agregarEditarBus() {
    const validateInputs = () => {
        const showBad = (errorMessage) => {
            $q.notify({
                spinner: false,
                message: errorMessage,
                timeout: 2000,
                type: 'negative',
            });
        };

        if (!placa.value || typeof placa.value !== 'string' || !placa.value.trim()) {
            showBad('Ingrese la Placa');
            return false;
        } else if (!numero_bus.value || typeof numero_bus.value !== 'string' || !numero_bus.value.trim()) {
            showBad('Ingrese el número de bus');
            return false;
        } else if (!cantidad_asientos.value || typeof cantidad_asientos.value !== 'string' || !cantidad_asientos.value.trim()) {
            showBad('Ingrese la cantidad de asientos');
            return false;
        } else if (!empresa_asignada.value || typeof empresa_asignada.value !== 'string' || !empresa_asignada.value.trim()) {
            showBad('Ingrese la empresa asignada');
            return false;
        } else if (cambio.value === 1 && (!conductorSeleccionado.value || typeof conductorSeleccionado.value !== 'string')) {
            showBad('Seleccione un conductor al editar');
            return false;
        }


        return true;
    };

    const clearInputs = () => {
        placa.value = '';
        numero_bus.value = '';
        cantidad_asientos.value = '';
        empresa_asignada.value = '';
        conductorSeleccionado.value = '';
    };

    if (cambio.value === 0) {
        if (validateInputs()) {
            try {
                await busStore.postBus({
                    placa: placa.value,
                    numero_bus: numero_bus.value,
                    cantidad_asientos: cantidad_asientos.value,
                    empresa_asignada: empresa_asignada.value.trim(),
                    conductor_id: conductorSeleccionado._rawValue.value,
                });
                $q.notify({
                    spinner: false,
                    message: 'Operación exitosa',
                    timeout: 2000,
                    type: 'positive',
                });
                clearInputs();
                obtenerInfo();
                fixed.value = false;
                rows.value = [...buses.value].sort(
                    (a, b) => new Date(b.createAT) - new Date(a.createAT)
                );
            } catch (error) {
                $q.notify({
                    spinner: false,
                    message: 'Error al agregar el bus',
                    timeout: 2000,
                    type: 'negative',
                });
                console.error(error);
            }
        }
    } else {
        if (validateInputs()) {
            let id = idBus.value;
            if (id) {
                try {
                    await busStore.putEditarBus(id, {
                        placa: placa.value,
                        numero_bus: numero_bus.value,
                        cantidad_asientos: cantidad_asientos.value,
                        empresa_asignada: empresa_asignada.value,
                        conductor_id: conductorSeleccionado._rawValue.value,
                    });
                    limpiar();
                    obtenerInfo();
                    fixed.value = false;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}


function limpiar() {
    placa.value = '';
    numero_bus.value = '';
    cantidad_asientos.value = '';
    empresa_asignada.value = '';
}

let idBus = ref('');
async function EditarBus(id) {
    const busSeleccionado = buses.value.find((bus) => bus._id === id);
    if (busSeleccionado) {
        idBus.value = String(busSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Bus";
        placa.value = busSeleccionado.placa;
        numero_bus.value = busSeleccionado.numero_bus;
        cantidad_asientos.value = busSeleccionado.cantidad_asientos;
        empresa_asignada.value = busSeleccionado.empresa_asignada;
        conductorSeleccionado.value = {
            label: `${busSeleccionado.conductor_id.nombre} - ${busSeleccionado.conductor_id.telefono} - ${busSeleccionado.conductor_id.cedula}`,
            value: String(busSeleccionado.conductor_id._id)
        }; 
    }
}

async function InactivarBus(id) {
    await busStore.putInactivarBus(id);
    obtenerInfo();
}

async function ActivarBus(id) {
    await busStore.putActivarBus(id);
    obtenerInfo();
}
function filtrarbuses() {
    if (buscarplaca.value.trim() === "") {
        rows.value = buses.value;
    } else {
        rows.value = buses.value.filter((buses) =>
            buses.placa.toString().includes(buscarplaca.value.toString())
        );
    };
};
</script>


<style scoped>
.centrado {
    display: block;
    margin: 0 auto;
}

h3 {
    margin: 3px;
}

.q-table-container .q-td.opciones {
    text-align: center;
}

.q-btn.opcion-btn {
    margin-right: 5px;
}
</style>