import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useVentasStore = defineStore('ticket', () => {
  const tickets = ref([]);

  const getTicket = async () => {
    try {
      let res = await axios.get('/ticket/ticket');

      /* console.log('Axios Response:', res); */

      if (res && res.data) {
       /*  console.log('Full API Response:', res); */

        tickets.value = res.data;

        console.log('Data from API:', res.data);
      } else if (res.response) {
        console.error('Error response from API:', res.response);
      } else {
        console.error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching ticket data from API:', error);
    }
  };

  const postTicket = async (data) => {
    try {
      let res = await axios.post('/ticket/agregar', data);
      return res;
    } catch (error) {
      console.error('Error adding ticket:', error);
      throw error;
    }
  };

  const putEditarTicket = async (id, data) => {
    try {
      let res = await axios.put(`/editarTicket/${id}`, data);
      return res;
    } catch (error) {
      console.error('Error editing ticket:', error);
      throw error;
    }
  };

  const InactivarTicket = async (id) => {
    try {
      let res = await axios.put(`/ticket/inactivarTicket/${id}`);
      return res;
    } catch (error) {
      console.error('Error inactivating ticket:', error);
      throw error;
    }
  };

  const ActivarTicket = async (id) => {
    try {
      let res = await axios.put(`/ticket/activarTicket/${id}`);
      return res;
    } catch (error) {
      console.error('Error activating ticket:', error);
      throw error;
    }
  };

  const buscarTickets = async (idRuta, idBus, fecha) => {
    try {
      let response = await axios.get('/ticket/encontrarTickets', {
        params: { id_ruta: idRuta, id_bus: idBus, fecha: fecha },
      });
    } catch (error) {
      console.error('Error searching tickets:', error);
      throw error;
    }
  };

  const getRutasPorBus = async (busId) => {
    try {
      let response = await axios.get(`/ticket/tickets/rutas/${busId}`);
      return response.data; 
    } catch (error) {
      console.error('Error getting routes by bus:', error);
      throw error;
    }
  };

  return {
    tickets,
    getTicket,
    postTicket,
    putEditarTicket,
    InactivarTicket,
    ActivarTicket,
    buscarTickets,
    getRutasPorBus,
  };
});
