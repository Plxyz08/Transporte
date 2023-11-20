<template>
  <div>
    <h3>Ventas de Boletos</h3>
    <q-table
      title="Ventas de Boletos"
      style="width: 1500px; margin-top: 10px; margin-left: -10%;"
      :rows="tickets"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-acciones="props">
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
import { useVentasStore } from '../stores/ventas'; // Adjust the path based on your actual file structure
import { format } from 'date-fns';

const store = useVentasStore();
const columns = [
  { name: 'numeroTicket', label: 'Número de Ticket', field: 'numeroTicket' },
  { name: 'nombreVendedor', label: 'Nombre del Vendedor', field: 'nombreVendedor' },
  { name: 'fechaVenta', label: 'Fecha de Venta', field: 'fechaVenta', format: (val) => format(new Date(val), 'yyyy-MM-dd') },
  { name: 'fechaSalida', label: 'Fecha de Salida', field: 'fechaSalida', format: (val) => format(new Date(val), 'yyyy-MM-dd') },
  { name: 'horaSalida', label: 'Hora de Salida', field: 'horaSalida' },
  { name: 'ccPasajero', label: 'Cédula del Pasajero', field: 'ccPasajero' },
  { name: 'nombrePasajero', label: 'Nombre del Pasajero', field: 'nombrePasajero' },
  { name: 'vehiculo', label: 'Vehículo', field: 'vehiculo' },
  { name: 'origen', label: 'Origen', field: 'origen' },
  { name: 'destino', label: 'Destino', field: 'destino' },
  { name: 'silla', label: 'Número de Silla', field: 'silla' },
  { name: 'valor', label: 'Valor', field: 'valor' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', sortable: false },
];

const tickets = ref([]);

// Lógica para obtener los datos de los tickets existentes (utilizando el store).
async function obtenerTicketsExistentes() {
  try {
    await store.fetchTickets();
    tickets.value = store.tickets;
  } catch (error) {
    console.error('Error al obtener los tickets:', error);
  }
}

// Ejecuta la función para obtener los tickets existentes cuando el componente se monta.
onMounted(() => {
  obtenerTicketsExistentes();
});

// Función para imprimir un ticket (debes implementar la lógica real aquí).
function imprimirTicket(venta) {
  console.log('Imprimir ticket', venta);
}
</script>

<style scoped>
.q-table-container .q-td.acciones {
  text-align: center;
}
</style>