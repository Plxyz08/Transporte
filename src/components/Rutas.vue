<template>
  <div>
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section class="row items-center q-pb-none" style="color: black">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input v-model="precio" label="Precio" style="width: 300px" />
          <q-input v-model="origen" label="Origen" style="width: 300px" />
          <q-input v-model="destino" label="Destino" style="width: 300px" />
          <q-select v-model="horarioSeleccionado" :options="optionsHorarios" label="Selecciona un horario"
            style="width: 300px" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="agregarEditarRuta" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h3>Rutas</h3>
      <div class="btn-agregar" style="margin-bottom: 5%">
        <q-btn color="primary" label="Agregar" @click="agregarRuta()" />
      </div>

      <div class="q-pa-md">
        <q-table title="Rutas" :rows="rows" :columns="columns"
          row-key="name">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <q-btn color="blue-4" style="margin-right: 5px" text-color="black" @click="EditarRuta(props.row._id)">
                <q-icon name="edit"> </q-icon>
              </q-btn>
              <q-btn color="green-4" glossy @click="InactivarRuta(props.row._id)" v-if="props.row.estado == 1"><q-icon
                  name="toggle_on" /></q-btn>
              <q-btn color="red-4" glossy @click="ActivarRuta(props.row._id)" v-else>
                <q-icon name="toggle_off"> </q-icon></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useRutasStore } from "../stores/rutas.js";
import { useHorarioStore } from "../stores/horario.js";

const horarioStore = useHorarioStore();

const rutasStore = useRutasStore();

let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let precio = ref("");
let origen = ref();
let destino = ref("");
let cambio = ref(0);
let horarioSeleccionado = ref("");
let optionsHorarios = ref([]);

async function obtenerInfo() {
  try {
    await rutasStore.getRuta();
    rutas.value = rutasStore.rutas;
    rows.value = rutasStore.rutas;
  } catch (error) {
    console.log(error);
  }
}

async function obtenerHorarios() {
  try {
    await horarioStore.getHorario();

    optionsHorarios.value = horarioStore.horarios.map(horario => ({
      label: `${horario.hora_partida} - ${horario.hora_llegada}`,
      value: horario._id,
    }));
  } catch (error) {
    console.error(error);
  }
}


onMounted(async () => {
  obtenerInfo();
  await obtenerHorarios()
});

const columns = [
  { name: "precio", label: "Precio", field: "precio", sortable: true },
  {
    name: "hora_partida",
    label: "Hora Partida",
    field: (row) => row.horario_id.hora_partida,
  },
  {
    name: "hora_llegada",
    label: "Hora LLegada",
    field: (row) => row.horario_id.hora_llegada,
  },
  { name: "origen", label: "Origen", field: "origen" },
  { name: "destino", label: "Destino", field: "destino" },
  { name: "estado", label: "Estado", field: "estado", sortable: true },
  {
    name: "createAT",
    label: "Fecha de Creación",
    field: "createAT",
    sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  { name: "opciones", label: "Opciones", sortable: false },
];

function agregarRuta() {
  fixed.value = true;
  text.value = "Agregar Ruta";
  cambio.value = 0;
  limpiar();
}

async function agregarEditarRuta() {
  if (cambio.value === 0) {
    await rutasStore.postRuta({
      precio: precio.value,
      origen: origen.value,
      destino: destino.value,
      horario_id: horarioSeleccionado._rawValue.value

    });
    limpiar();
    obtenerInfo();
    fixed.value = false;
  } else {
    let id = idRuta.value;
    if (id) {
      await rutasStore.putEditarRuta(id, {
        precio: precio.value,
        origen: origen.value,
        destino: destino.value,
        horario_id: horarioSeleccionado._rawValue.value

      });
      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
}



function limpiar() {
  precio.value = "";
  origen.value = "";
  destino.value = "";
}

let idRuta = ref("");
async function EditarRuta(id) {
  cambio.value = 1;
  const rutaSeleccionado = rutas.value.find((ruta) => ruta._id === id);
  if (rutaSeleccionado) {
    idRuta.value = String(rutaSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Ruta";
    precio.value = rutaSeleccionado.precio;
    origen.value = rutaSeleccionado.origen;
    destino.value = rutaSeleccionado.destino;
  }
}

async function InactivarRuta(id) {
  await rutasStore.putInactivarRuta(id);
  obtenerInfo();
}

async function ActivarRuta(id) {
  await rutasStore.putActivarRuta(id);
  obtenerInfo();
}
</script>

<style scoped>
.q-table-container .q-td.opciones {
  text-align: center;
}

h3{
  margin: 5px;
}

.q-btn.opcion-btn {
  margin-right: 5px;
}
</style>
