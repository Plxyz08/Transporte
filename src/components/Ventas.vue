<template>
  <div>
    <h3>Ventas de Boletos</h3>
    <q-table title="Ventas de Boletos"  :rows="rows"
      :columns="columns" row-key="name">
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-btn color="green" style="margin-right: 5px" @click="imprimirTicket(props.row)">
            Imprimir
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVentasStore } from '../stores/ventas';
import { format } from 'date-fns';

const ventasStore = useVentasStore();

const rows = ref([]);
const dataLoaded = ref(false);

const columns = [
  { name: 'numeroTicket', label: '# de Ticket', align: 'left', field: 'numeroTicket', sortable: true },
  { name: 'nombreVendedor', label: 'Vendedor', align: 'left', field: 'nombreVendedor', sortable: true },
  { name: 'fechaVenta', label: 'Fecha de Venta', align: 'left', field: 'fechaVenta', format: (val) => format(new Date(val), 'yyyy-MM-dd'), sortable: true },
  { name: 'fechaSalida', label: 'Fecha de Salida', align: 'left', field: 'fechaSalida', format: (val) => format(new Date(val), 'yyyy-MM-dd'), sortable: true },
  { name: 'horaSalida', label: 'Hora de Salida', align: 'left', field: 'horaSalida', sortable: true },
  { name: 'ccPasajero', label: 'Pasajero', align: 'left', field: 'ccPasajero', sortable: true },
  { name: 'nombrePasajero', label: 'Nombre del Pasajero', align: 'left', field: 'nombrePasajero', sortable: true },
  { name: 'vehiculo', label: 'Vehículo', align: 'left', field: 'vehiculo', sortable: true },
  { name: 'origen', label: 'Origen', align: 'left', field: 'origen', sortable: true },
  { name: 'destino', label: 'Destino', align: 'left', field: 'destino', sortable: true },
  { name: 'silla', label: '# de Silla', align: 'left', field: 'silla', sortable: true },
  { name: 'valor', label: 'Valor', align: 'left', field: 'valor', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones', sortable: false },
];

onMounted(async () => {
  await obtenerInfo();
});

async function obtenerInfo() {
  try {
    await ventasStore.getTicket();
    rows.value = ventasStore.tickets;
    dataLoaded.value = true;
    console.log('Datos de la API:', rows);
  } catch (error) {
    console.error(error);
  }
}

function imprimirTicket(venta) {
  console.log('Imprimir ticket', venta);
}
</script>

<style scoped>
.q-table-container .q-td.acciones {
  text-align: center;
}
</style>
