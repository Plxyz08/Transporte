import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

// Define el store de Pinia llamado 'ticket'
export const useVentasStore = defineStore('ticket', () => {
  // Declara una referencia reactiva para almacenar los tickets
  const tickets = ref([]);

  // Función asincrónica para obtener tickets desde la API
  const getTicket = async () => {
    try {
      let res = await axios.get('/ticket/ticket');

      // Agrega el log para imprimir la respuesta de Axios
      console.log('Axios Response:', res);

      // Verifica que la respuesta tenga una propiedad 'data'
      if (res && res.data) {
        // Imprime la respuesta completa para entender su estructura
        console.log('Full API Response:', res);

        // Actualiza la referencia con la propiedad 'data' de la respuesta
        tickets.value = res.data;

        console.log('Data from API:', res.data);
      } else if (res.response) {
        // Si hay un objeto 'response', puede contener detalles del error
        console.error('Error response from API:', res.response);
      } else {
        console.error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching ticket data from API:', error);
      // Puedes lanzar el error aquí si es necesario
    }
  };

  // Función asincrónica para agregar un nuevo ticket
  const postTicket = async (data) => {
    try {
      // Realiza una solicitud POST a '/ticket/agregar' con los datos proporcionados
      let res = await axios.post('/ticket/agregar', data);
      return res;
    } catch (error) {
      // Manejo de errores al agregar un ticket
      console.error('Error adding ticket:', error);
      throw error;
    }
  };

  // Función asincrónica para editar un ticket por ID
  const putEditarTicket = async (id, data) => {
    try {
      // Realiza una solicitud PUT a `/editarTicket/${id}` con los datos proporcionados
      let res = await axios.put(`/editarTicket/${id}`, data);
      return res;
    } catch (error) {
      // Manejo de errores al editar un ticket
      console.error('Error editing ticket:', error);
      throw error;
    }
  };

  // Función asincrónica para inactivar un ticket por ID
  const putTicketInactivar = async (id) => {
    try {
      // Realiza una solicitud PUT a `/ticket/inactivarTicket/${id}`
      let res = await axios.put(`/ticket/inactivarTicket/${id}`);
      return res;
    } catch (error) {
      // Manejo de errores al inactivar un ticket
      console.error('Error inactivating ticket:', error);
      throw error;
    }
  };

  // Función asincrónica para activar un ticket por ID
  const putTicketActivar = async (id) => {
    try {
      // Realiza una solicitud PUT a `ticket/activarTicket/${id}`
      let res = await axios.put(`ticket/activarTicket/${id}`);
      return res;
    } catch (error) {
      // Manejo de errores al activar un ticket
      console.error('Error activating ticket:', error);
      throw error;
    }
  };

  // Función asincrónica para buscar tickets con parámetros específicos
  const buscarTickets = async (idRuta, idBus, fecha) => {
    try {
      // Realiza una solicitud GET a '/ticket/encontrarTickets' con parámetros
      let response = await axios.get('/ticket/encontrarTickets', {
        params: { id_ruta: idRuta, id_bus: idBus, fecha: fecha },
      });
      return response.data; // Ajustado para devolver solo los datos
    } catch (error) {
      // Manejo de errores al buscar tickets
      console.error('Error searching tickets:', error);
      throw error;
    }
  };

  // Función asincrónica para obtener rutas por ID de bus
  const getRutasPorBus = async (busId) => {
    try {
      // Realiza una solicitud GET a `/ticket/tickets/rutas/${busId}`
      let response = await axios.get(`/ticket/tickets/rutas/${busId}`);
      return response.data; // Ajustado para devolver solo los datos
    } catch (error) {
      // Manejo de errores al obtener rutas por bus
      console.error('Error getting routes by bus:', error);
      throw error;
    }
  };

  // Devuelve todas las propiedades y funciones que estarán disponibles en el store
  return {
    tickets,
    getTicket,
    postTicket,
    putEditarTicket,
    putTicketInactivar,
    putTicketActivar,
    buscarTickets,
    getRutasPorBus,
  };
});
