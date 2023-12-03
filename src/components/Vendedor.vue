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
          <q-input v-model="telefono" label="telefono" style="width: 300px" />
          <q-input v-model="clave" label="clave" style="width: 300px" />
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
      <q-row>
        <!-- Single column for both "Agregar Vendedor" and "Buscar por Cedula" -->
        <q-col class="col-container" :span="12">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <!-- "Agregar Vendedor" button -->
            <div class="btn-agregar">
              <q-btn color="primary" label="Agregar" @click="agregarVendedor()" />
            </div>

            <!-- "Buscar por Cedula" input and "Buscar" button -->
            <div style="display: flex; align-items: center;">
              <q-input v-model="buscarCedula" label="Buscar por Cedula"
                style="width: 300px; border-radius: 10px; background-color: azure; margin-right: 10px;" />
              <q-btn color="primary" label="Buscar" @click="filtrarVendedores" class="btnbuscar" />
            </div>
          </div>
        </q-col>
      </q-row>
      <q-table title="Vendedores" style="width: 1500px; margin-top: 10px; margin-left:-10%;" :rows="rows"
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
              @click="EditarVendedor(props.row._id)"><q-icon name="edit" /></q-btn>
            <q-btn color="green-4" glossy @click="InactivarVendedor(props.row._id)" v-if="props.row.estado == 1"><q-icon
                name="toggle_on" /></q-btn>
            <q-btn color="red-4" glossy @click="ActivarVendedor(props.row._id)" v-else><q-icon
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
import { useVendedorStore } from "../stores/vendedor.js";
const VendedorStore = useVendedorStore();

let vendedores = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let cedula = ref("");
let nombre = ref();
let cuenta = ref("");
let telefono = ref("");
let clave = ref("");
let cambio = ref(0);
let buscarCedula = ref("");

async function obtenerInfo() {
  try {
    await VendedorStore.getVendedor();
    vendedores.value = VendedorStore.vendedor;
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
    try {
      await VendedorStore.postVendedor({
        cedula: cedula.value,
        nombre: nombre.value,
        cuenta: cuenta.value,
        telefono: telefono.value,
        clave: clave.value,
      });
      limpiar();
      obtenerInfo();
      fixed.value = false;
    } catch (error) {
      console.error("Error al agregar vendedor:", error);
      // Aquí puedes manejar el error de manera específica si lo deseas
    }
  } else {
    let id = idVendedor.value;
    if (id) {
      try {
        await VendedorStore.putVendedor(id, {
          cedula: cedula.value,
          nombre: nombre.value,
          cuenta: cuenta.value,
          telefono: telefono.value,
        });
        limpiar();
        obtenerInfo();
        fixed.value = false;
      } catch (error) {
        console.error("Error al editar vendedor:", error);
        // Aquí puedes manejar el error de manera específica si lo deseas
      }
    }
  }
}


function limpiar() {
  cedula.value = "";
  nombre.value = "";
  cuenta.value = "";
  telefono.value = "";
}

let idVendedor = ref("");
async function EditarVendedor(id) {
  cambio.value = 1;
  const vendedorSeleccionado = vendedores.value.find((vendedor) => vendedor._id === id);
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

function filtrarVendedores() {
  if (buscarCedula.value.trim() === "") {
    rows.value = vendedores.value;
  } else {
    rows.value = vendedores.value.filter((vendedor) =>
      vendedor.cedula.toString().includes(buscarCedula.value.toString())
    );
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