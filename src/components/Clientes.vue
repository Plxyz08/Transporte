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
          <q-input v-model="cedula" label="cedula" style="width: 300px" />
          <q-input v-model="nombre" label="nombre" style="width: 300px" />
          <q-input v-model="telefono" label="telefono" style="width: 300px" />
        </q-card-section>


        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="agregarEditarCliente" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h3>Clientes</h3>
      <q-row>
        <!-- Single column for both "Agregar Cliente" and "Buscar por cedula" -->
        <q-col class="col-container" :span="12">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <!-- "Agregar Cliente" button -->
            <div class="btn-agregar">
              <q-btn color="primary" label="Agregar" @click="agregarCliente()" />
            </div>

            <!-- "Buscar por cedula" input and "Buscar" button -->
            <div style="display: flex; align-items: center;">
              <q-input v-model="buscarcedula" label="Buscar por cedula"
                style="width: 300px; border-radius: 10px; background-color: azure; margin-right: 10px;" />
              <q-btn color="primary" label="Buscar" @click="filtrarclientes" class="btnbuscar" />
            </div>
          </div>
        </q-col>
      </q-row>

      <div class="q-pa-md">
        <q-table title="Clientes" :rows="rows"
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
                @click="EditarCliente(props.row._id)"><q-icon name="edit" /></q-btn>
              <q-btn color="green-4" glossy @click="InactivarCliente(props.row._id)" v-if="props.row.estado == 1"><q-icon
                  name="toggle_on" /></q-btn>
              <q-btn color="red-4" glossy @click="ActivarCliente(props.row._id)" v-else><q-icon
                  name="toggle_off" /></q-btn>
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
import { useClienteStore } from "../stores/clientes.js";
const ClienteStore = useClienteStore();

let clientes = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let telefono = ref("");
let cambio = ref(0);
let buscarcedula = ref("");


async function obtenerInfo() {
  try {
    await ClienteStore.getCliente();
    clientes.value = ClienteStore.clientes;
    rows.value = ClienteStore.clientes.reverse();
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "cedula", label: "Cedula", field: "cedula", sortable: true },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true },
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

function agregarCliente() {
  fixed.value = true;
  text.value = "Agregar Cliente";
  cambio.value = 0;
  limpiar();
}

async function agregarEditarCliente() {
  if (cambio.value === 0) {
    await ClienteStore.postCliente({
      cedula: cedula.value,
      nombre: nombre.value,
      telefono: telefono.value,
    });
    limpiar();
    obtenerInfo();
    fixed.value = false;
  } else {
    let id = idCliente.value;
    if (id) {
      await ClienteStore.putCliente(id, {
        cedula: cedula.value,
        nombre: nombre.value,
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
  telefono.value = "";
}

let idCliente = ref("");
async function EditarCliente(id) {
  cambio.value = 1;
  const clienteSeleccionado = clientes.value.find((cliente) => cliente._id === id);
  if (clienteSeleccionado) {
    idCliente.value = String(clienteSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Cliente";
    cedula.value = clienteSeleccionado.cedula;
    nombre.value = clienteSeleccionado.nombre;
    telefono.value = clienteSeleccionado.telefono;
  }
}

async function InactivarCliente(id) {
  await ClienteStore.putClienteInactivar(id);
  obtenerInfo();
}

async function ActivarCliente(id) {
  await ClienteStore.putClienteActivar(id);
  obtenerInfo();
}
function filtrarclientes() {
  if (buscarcedula.value.trim() === "") {
    rows.value = clientes.value;
  } else {
    rows.value = clientes.value.filter((clientes) =>
      clientes.cedula.toString().includes(buscarcedula.value.toString())
    );
  };
};
</script>

<style scoped>
.q-table-container .q-td.opciones {
  text-align: center;
}

h3{
  margin: 3px;
}

.q-btn.opcion-btn {
  margin-right: 5px;
}
</style>
