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
                    <q-input v-model="hora_partida" label="Hora_partida" style="width: 300px;" />
                    <q-input v-model="hora_llegada" label="Hora_llegada" style="width: 300px;" />


                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar" color="primary" @click="agregarEditarHorario" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div>
            <h3>Horario</h3>
            <div class="btn-agregar" style="margin-bottom: 5%;">
                <q-btn color="primary" label="Agregar" @click="agregarHorario()" />
            </div>

            <div class="q-pa-md">
                <q-table title="Horario" :rows="rows" :columns="columns" row-key="name">
                    <template v-slot:body-cell-estado="props">
                        <q-td :props="props">
                            <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
                            <label for="" v-else style="color: red;">Inactivo</label>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-opciones="props">
                        <q-td :props="props" class="botones">
                            <q-btn color="blue-4" style="margin-right: 5px;" text-color="black"
                                @click="EditarHorario(props.row._id)"><q-icon name="edit" /></q-btn>
                            <q-btn color="green-4" glossy @click="InactivarHorario(props.row._id)"
                                v-if="props.row.estado == 1"><q-icon name="toggle_on" /></q-btn>
                            <q-btn color="red-4" glossy @click="ActivarHorario(props.row._id)" v-else><q-icon
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
import { useHorarioStore } from '../stores/horario.js';
const HorarioStore = useHorarioStore()

let horarios = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let hora_partida = ref('');
let hora_llegada = ref();

let cambio = ref(0)

async function obtenerInfo() {
    try {
        await HorarioStore.getHorario();
        horarios.value = HorarioStore.horarios;
        rows.value = HorarioStore.horarios.reverse();
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    obtenerInfo()
});

const columns = [
    { name: 'hora_partida', label: 'Hora_partida', field: 'hora_partida', sortable: true },
    { name: 'hora_llegada', label: 'Hora_llegada', field: 'hora_llegada', sortable: true },
    ,

    { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
    {
        name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,
        format: (val) => format(new Date(val), 'yyyy-MM-dd')
    },
    {
        name: 'opciones', label: 'Opciones',
        field: row => null,
        "sortable": false,
    },
];

function agregarHorario() {
    fixed.value = true;
    text.value = "Agregar Horario";
    cambio.value = 0
    limpiar();
}

async function agregarEditarHorario() {
    if (cambio.value === 0) {
        await HorarioStore.postHorario({
            hora_partida: hora_partida.value,
            hora_llegada: hora_llegada.value,

        });
        limpiar();
        obtenerInfo();
        fixed.value = false;
    } else {
        let id = idHorario.value;
        if (id) {
            await HorarioStore.putHorario(id, {
                hora_partida: hora_partida.value,
                hora_llegada: hora_llegada.value,

            });
            limpiar();
            obtenerInfo();
            fixed.value = false;
        }
    }
}

function limpiar() {
    hora_partida.value = "";
    hora_llegada.value = "";

}

let idHorario = ref('');
async function EditarHorario(id) {
    cambio.value = 1;
    const HorSeleccionado = horarios.value.find((horario) => horario._id === id);
    if (HorSeleccionado) {
        idHorario.value = String(HorSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Horario";
        hora_partida.value = HorSeleccionado.hora_partida;
        hora_llegada.value = HorSeleccionado.hora_llegada;
    }
}

async function InactivarHorario(id) {
    await HorarioStore.putHorarioInactivar(id);
    obtenerInfo();
}

async function ActivarHorario(id) {
    await HorarioStore.putHorarioActivar(id);
    obtenerInfo();
}
</script>


<style scoped>
.q-table-container .q-td.opciones {
    text-align: center;
}

h3 {
    margin: 5px;
}

.q-btn.opcion-btn {
    margin-right: 5px;
}
</style>