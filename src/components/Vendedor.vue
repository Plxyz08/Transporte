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
          <q-input v-model="cuenta" label="cuenta" style="width: 300px" />
          <q-input v-model="clave" label="clave" style="width: 300px" />
          <q-input v-model="telefono" label="telefono" style="width: 300px" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="agregarEditarVendedor" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h3>Vendedores</h3>
      <div class="btn-agregar" style="margin-bottom: 5%">
        <q-btn color="primary" label="Agregar" @click="agregarVendedor()" />
      </div>
      <q-input
        v-model="searchCedula"
        label="Buscar por Cedula"
        style="
          width: 300px;
          border-radius: 5 px;
          background-color: azure;
          position: relative;
          left: 80%;
        "
      />
      <q-table title="Vendedores" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="blue-4"
              style="margin-right: 5px"
              text-color="black"
              @click="EditarVendedor(props.row._id)"
              ><q-icon name="edit"
            /></q-btn>
            <q-btn
              color="green-4"
              glossy
              @click="InactivarVendedor(props.row._id)"
              v-if="props.row.estado == 1"
              ><q-icon name="toggle_on"
            /></q-btn>
            <q-btn color="red-4" glossy @click="ActivarVendedor(props.row._id)" v-else
              ><q-icon name="toggle_off"
            /></q-btn>
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
import { useVendedorStore } from "../stores/vendedor.js";
const VendedorStore = useVendedorStore();

let vendedor = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let cuenta = ref("");
let clave = ref("");
let telefono = ref("");
let cambio = ref(0);

async function obtenerInfo() {
  try {
    await VendedorStore.getVendedor();
    vendedor.value = VendedorStore.vendedor;
    rows.value = VendedorStore.vendedor;
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
  { name: "cuenta", label: "Cuenta", field: "cuenta" },
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

function agregarVendedor() {
  fixed.value = true;
  text.value = "Agregar Vendedor";
  cambio.value = 0;
  limpiar();
}

async function agregarEditarVendedor() {
  if (cambio.value === 0) {
    await VendedorStore.postVendedor({
      cedula: cedula.value,
      nombre: nombre.value,
      cuenta: cuenta.value,
      clave: clave.value, // This line includes the 'clave' field
      telefono: telefono.value,
    });
    limpiar();
    obtenerInfo();
    fixed.value = false;
  } else {
    let id = idVendedor.value;
    if (id) {
      await VendedorStore.putVendedor(id, {
        cedula: cedula.value,
        nombre: nombre.value,
        cuenta: cuenta.value,
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
  cuenta.value = "";
  clave.value = "";
  telefono.value = "";
}

let idVendedor = ref("");
async function EditarVendedor(_id) {
  cambio.value = 1;
  const vendedorSeleccionado = vendedor.value.find((vendedor) => vendedor._id === _id);
  if (vendedorSeleccionado) {
    idVendedor.value = String(vendedorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Vendedor";
    cedula.value = vendedorSeleccionado.cedula;
    nombre.value = vendedorSeleccionado.nombre;
    cuenta.value = vendedorSeleccionado.cuenta;
    telefono.value = vendedorSeleccionado.telefono;
  }
}

async function InactivarVendedor(id) {
  await VendedorStore.putVendedorInactivar(id);
  obtenerInfo();
}

async function ActivarVendedor(id) {
  await VendedorStore.putVendedorActivar(id);
  obtenerInfo();
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
