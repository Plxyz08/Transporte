<template>
    <div>
        <h3>Tickets</h3>
        <q-row>
            <!-- Single column for both "Agregar Cliente" and "Buscar por fecha" -->
            <q-col class="col-container" :span="12">
                <div style="display: flex; align-items: center; justify-content: space-between;">

                    <!-- "Agregar Ticket" button -->
                    <div class="btn-agregar">
                        <q-btn color="primary" label="Agregar" @click="agregarCliente()" />
                    </div>

                    <!-- "Buscar por cedula" input and "Buscar" button -->
                    <div style="display: flex; align-items: center;">
                        <q-input v-model="buscarFecha" label="Buscar por fecha"
                            style="width: 300px; border-radius: 10px; background-color: azure; margin-right: 10px;" />
                        <q-btn color="primary" label="Buscar" @click="filtrarTickets" class="btnbuscar" />
                    </div>
                </div>
            </q-col>
        </q-row>

        <!-- model editar Ticket  -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <q-card-section class="row items-center q-pb-none" style="color: black">
                    <div class="text-h6">Editar Ticket</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <q-select v-model="selectedTicket.cliente" :options="Clientes" label="Cliente" />
                    <q-select v-model="selectedTicket.bus" :options="Buses" label="Bus" />
                    <q-select v-model="selectedTicket.vendedor" :options="Vendedores" label="Vendedor" />
                    <q-input type="number" v-model="selectedTicket.no_asiento" label="N° asiento" />
                    <q-input type="date" v-model="selectedTicket.fecha_departida" label="Fecha de partida" />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Guardar" color="primary" @click="EditarTicket" />
                </q-card-actions>
            </q-card>
        </q-dialog>

    </div>
    <div class="q-pa-md">
        <q-table title="Tickets" :rows="tickets.ticket" :columns="columns" row-key="name" virtual-scroll
            v-model:pagination="pagination">
            <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                    <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
                    <label for="" v-else style="color: red">Inactivo</label>
                </q-td>
            </template>

            <template v-slot:body-cell-opciones="props">
                <q-td :props="props" class="botones">
                    <q-btn color="blue-4" style="margin-right: 5px" text-color="black"
                        @click="editarTicket(props.row._id)"><q-icon name="edit" /></q-btn>
                    <q-btn color="amber" style="margin-right: 5px" text-color="black"
                        @click="imprimirPDF(props.row._id)"><q-icon name="print" /></q-btn>
                    <q-btn color="green-4" glossy @click="InactivarTicket(props.row._id)"
                        v-if="props.row.estado == 1"><q-icon name="toggle_on" /></q-btn>
                    <q-btn color="red-4" glossy @click="ActivarTicket(props.row._id)" v-else>
                        <q-icon name="toggle_off" />
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
  
<script>
import { ref, onMounted, nextTick } from 'vue';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';
import { useVentasStore } from '../stores/ventas';
import { useClienteStore } from '../stores/clientes';
import { useBusStore } from '../stores/buses';
import { useVendedorStore } from '../stores/vendedor';

const columns = [
    { name: "cliente_id", label: "Info Cliente", field: (row) => `${row.cliente_id.nombre} - ${row.cliente_id.cedula}- ${row.cliente_id.telefono}`, },
    { name: "bus_id", label: "Info Bus", field: (row) => `${row.bus_id.empresa_asignada} - ${row.bus_id.placa} - N°${row.bus_id.numero_bus} `, },
    { name: "vendedor_id", label: "Info Vendedor", field: (row) => `${row.vendedor_id.nombre} - ${row.vendedor_id.telefono}`, },
    { name: "ruta_id", label: "Ruta Origen - Destino", field: (row) => `${row.ruta_id.origen} - ${row.ruta_id.destino}`, },
    { name: "ruta_id", label: "Horario Partida - Llegada", field: (row) => `${row.ruta_id.horario_id.hora_partida} - ${row.ruta_id.horario_id.hora_llegada}`, },
    { name: "no_asiento", label: "N° Asiento", field: "no_asiento", sortable: true, },
    { name: "fecha_departida", label: "Fecha de partida", field: "fecha_departida", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"), },
    { name: "estado", label: "Estado", field: "estado", sortable: true },
    { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"), },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, },
];

export default {
    setup() {
        const ventasStore = useVentasStore();
        const clientesStore = useClienteStore();
        const busStore = useBusStore();
        const vendedorStore = useVendedorStore();
        const tickets = ref([]);
        const Clientes = ref([]);
        const Buses = ref([]);
        const Vendedores = ref([]);
        const selectedTicket = ref(null);
        const fixed = ref(false);
        const pagination = ref({});
        const buscarFecha = ref('');
        const fecha_departida = ref(null);

        const obtenerInfo = async () => {
            await ventasStore.getTicket();
            tickets.value = ventasStore.tickets;
        };

        const obtenerClientes = async () => {
            try {
                await clientesStore.getCliente();
                Clientes.value = clientesStore.clientes.map((cliente) => ({
                    label: `${cliente.nombre} - ${cliente.cedula} - ${cliente.telefono}`,
                    value: String(cliente._id),
                }))
            } catch (error) {
                console.log(error);
            }

        };

        const obtenerBuses = async () => {
            try {
                await busStore.getBuses();
                Buses.value = busStore.buses.map((bus) => ({
                    label: `${bus.placa} - ${bus.empresa_asignada} - ${bus.numero_bus}`,
                    value: String(bus._id),
                }))
            } catch (error) {
                console.log(error);
            }

        };

        const obtenerVendedores = async () => {
            try {
                await vendedorStore.getVendedor();
                Vendedores.value = vendedorStore.vendedor.map((vendedor) => ({
                    label: `${vendedor.nombre} - ${vendedor.telefono}`,
                    value: String(vendedor._id),
                }))
            } catch (error) {
                console.log(error);
            }

        };

        const editarTicket = async (id) => {
            // Find the selected ticket by ID
            const selectedTicketData = tickets.value.ticket.find((ticket) => ticket._id === id);

            // Make sure the selected ticket is found
            if (selectedTicketData) {
                // Copy data from selected ticket to selectedTicket ref
                selectedTicket.value = {
                    cliente: selectedTicketData.cliente_id._id, 
                    bus: selectedTicketData.bus_id._id, 
                    vendedor: selectedTicketData.vendedor_id._id, 
                    no_asiento: selectedTicketData.no_asiento,
                    fecha_departida: selectedTicketData.fecha_departida,
                };

                // Load additional data
                await Promise.all([obtenerClientes(), obtenerBuses(), obtenerVendedores()]);

                // Access properties from the selected ticket and do something with them
                console.log(selectedTicket.value.fecha_departida);

                // Set fixed to true
                fixed.value = true;
            } else {
                console.error('Selected ticket not found');
            }
        };



        const closeModal = () => {
            selectedTicket.value = null;
            fixed.value = false;
        };

        const EditarTicket = async () => {

            closeModal();
        };

        const ActivarTicket = async (id) => {
            await ventasStore.ActivarTicket(id);
            obtenerInfo();
        };

        const InactivarTicket = async (id) => {
            await ventasStore.InactivarTicket(id);
            obtenerInfo();
        };

        const imprimirPDF = async (id) => {
            const ticketSeleccionado = tickets.value.ticket.find((ticket) => ticket._id === id);

            if (ticketSeleccionado) {
                const container = document.createElement('div');
                const content = document.createElement('div');

                await nextTick();

                // Estilo para el contenedor principal
                container.style.maxWidth = '600px';
                container.style.margin = 'auto';
                container.style.padding = '20px';
                container.style.border = '1px solid #ccc';
                container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

                // Estilo para el contenido
                content.style.fontFamily = 'Arial, sans-serif';
                content.style.fontSize = '16px';
                content.style.lineHeight = '1.6';

                // Añade detalles específicos del ticket al contenido
                content.innerHTML = `
      <h2 style="text-align: center;">Detalles del Ticket</h2>
      <p><strong>Cliente:</strong> ${ticketSeleccionado.cliente_id.nombre}</p>
      <p><strong>Info Bus:</strong> ${ticketSeleccionado.bus_id.empresa_asignada} - ${ticketSeleccionado.bus_id.placa} - N°${ticketSeleccionado.bus_id.numero_bus}</p>
      <p><strong>Ruta:</strong> ${ticketSeleccionado.ruta_id.origen} - ${ticketSeleccionado.ruta_id.destino}</p>
      <p><strong>Horario:</strong> ${ticketSeleccionado.ruta_id.horario_id.hora_partida} - ${ticketSeleccionado.ruta_id.horario_id.hora_llegada}</p>
      <p><strong>N° Asiento:</strong> ${ticketSeleccionado.no_asiento}</p>
      <p><strong>Fecha de partida:</strong> ${format(new Date(ticketSeleccionado.fecha_departida), "yyyy-MM-dd")}</p>
      <p><strong>Estado:</strong> ${ticketSeleccionado.estado === 1 ? 'Activo' : 'Inactivo'}</p>
      <p><strong>Fecha de Creación:</strong> ${format(new Date(ticketSeleccionado.createAT), "yyyy-MM-dd")}</p>
    `;

                container.appendChild(content);

                document.body.appendChild(container);
                html2pdf(container);
                document.body.removeChild(container);
            }
        };

        const filtrarTickets = async () => {
            await ventasStore.buscarTickets
        }

        onMounted(() => {
            obtenerInfo();

        });

        onMounted(async () => {
            fecha_departida.value = await fetchData();
        });

        return {
            columns,
            tickets,
            pagination,
            ActivarTicket,
            InactivarTicket,
            imprimirPDF,
            editarTicket,
            fixed,
            selectedTicket,
            Clientes,
            Buses,
            Vendedores,
            closeModal,
            EditarTicket,
            filtrarTickets,
            buscarFecha,
            fecha_departida,
        };
    },
};
</script>

<style scoped>
h3 {
    margin: 2px;
}
</style>