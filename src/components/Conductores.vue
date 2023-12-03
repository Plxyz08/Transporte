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
          <q-input v-model="cedula" label="Cedula" style="width: 300px" />
          <q-input v-model="nombre" label="Nombre" style="width: 300px" />
          <q-input v-model="experiencia" label="Experiencia" style="width: 300px" />
          <q-input v-model="telefono" label="Telefono" style="width: 300px" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="agregarEditarConductor" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h3>Conductores</h3>
      <q-row>
        <!-- Single column for both "Agregar Conductor" and "Buscar por Cedula" -->
        <q-col class="col-container" :span="12">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <!-- "Agregar Conductor" button -->
            <div class="btn-agregar">
              <q-btn color="primary" name="add" label="Agregar" @click="agregarConductor()" />
            </div>

            <!-- "Buscar por Cedula" input and "Buscar" button -->
            <div style="display: flex; align-items: center;">
              <q-input v-model="buscarcedula" label="Buscar por Cedula"
                style="width: 300px; border-radius: 10px; background-color: azure; margin-right: 10px;" />
              <q-btn color="primary" label="Buscar" @click="filtrarconductores" class="btnbuscar" />
            </div>
          </div>
        </q-col>
      </q-row>
      <q-table title="Conductores" style="width: 1500px; margin-top: 10px; margin-left:-10%;" :rows="rows"
        :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="blue-4" style="margin-right: 5px" text-color="black"
              @click="EditarConductor(props.row._id)"><q-icon name="edit" /></q-btn>
            <q-btn color="green-4" glossy @click="InactivarConductor(props.row._id)" v-if="props.row.estado == 1"><q-icon
                name="toggle_on" /></q-btn>
            <q-btn color="red-4" glossy @click="ActivarConductors(props.row._id)" v-else><q-icon
                name="toggle_off" /></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useConductorStore } from "../stores/conductores.js";
const conductorStore = useConductorStore();

let conductores = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let experiencia = ref("");
let telefono = ref("");
let cambio = ref(0);
let buscarcedula = ref("");


async function obtenerInfo() {
  try {
    await conductorStore.getConductor();
    conductores.value = conductorStore.conductores;
    rows.value = conductorStore.conductores;
    console.log(conductorStore);
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true },
  { name: "experiencia", label: "Experiencia", field: "experiencia" },
  { name: "telefono", label: "Telefono", field: "telefono" },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    format: (val) => (val ? "Activo" : "Inactivo"),
  },
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

function agregarConductor() {
  fixed.value = true;
  text.value = "Agregar Conductor";
  cambio.value = 0;
  limpiar();
}

async function agregarEditarConductor() {
  if (cambio.value === 0) {
    await conductorStore.postConductor({
      cedula: cedula.value,
      nombre: nombre.value,
      experiencia: experiencia.value,
      telefono: telefono.value,
    });
    limpiar();
    obtenerInfo();
    fixed.value = false;
  } else {
    let id = idConductor.value;
    if (id) {
      conductorStore.putConductor(id, {
        cedula: cedula.value,
        nombre: nombre.value,
        experiencia: experiencia.value,
        telefono: telefono.value,
      });
      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
}

function limpiar() {
  cedula.value = "";
  nombre.value = "";
  experiencia.value = "";
  telefono.value = "";
}

let idConductor = ref("");
async function EditarConductor(id) {
  cambio.value = 1;
  const conductorSeleccionado = conductores.value.find(
    (conductor) => conductor._id === id
  );
  if (conductorSeleccionado) {
    idConductor.value = String(conductorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Bus";
    cedula.value = conductorSeleccionado.cedula;
    nombre.value = conductorSeleccionado.nombre;
    experiencia.value = conductorSeleccionado.experiencia;
    telefono.value = conductorSeleccionado.telefono;
  }
}

async function InactivarConductor(id) {
  await conductorStore.putInactivarConductor(id);
  obtenerInfo();
}

async function ActivarConductors(id) {
  await conductorStore.putActivarConductor(id);
  obtenerInfo();
}
function filtrarconductores() {
  if (buscarcedula.value.trim() === "") {
    rows.value = conductores.value;
  } else {
    rows.value = conductores.value.filter((conductores) =>
      conductores.cedula.toString().includes(buscarcedula.value.toString())
    );
  };
};
</script>