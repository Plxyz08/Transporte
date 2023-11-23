import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useVentasStore = defineStore('ticket', () => {
  const tickets = ref([]);

  const getTicket = async () => {
    try {
      let res = await axios.get('/ticket/ticket');
      tickets.value = res.data.tickets;
    } catch (error) {
      throw error;
    }
  };

  const postTicket = async (data) => {
    try {
      let res = await axios.post('/ticket/agregar', data);
      return res
    } catch (error) {
      console.error('Error adding ticket:', error);
      throw error
    }
  };

  const putEditarTicket = async (id, data) => {
    try {
      let res = await axios.put(`/editarTicket/${id}`, data);
      return res
    } catch (error) {
      console.error('Error editing ticket:', error);
      throw error
    }
  };

  const putTicketInactivar = async (id) => {
    try {
      let res = await axios.put(`/ticket/inactivarTicket/${id}`);
      return res;
    } catch (error) {
      console.error('Error inactivating ticket:', error);
      throw error;
    }
  };

  const putTicketActivar = async (id) => {
    try {
      let res = await axios.put(`ticket/activarTicket/${id}`);
      return res
    } catch (error) {
      console.error('Error activating ticket:', error);
      throw error
    }
  };

  const buscarTickets = async (idRuta, idBus, fecha) => {
    try {
      let response = await axios.get(`/ticket/encontrarTickets`, {
        params: { id_ruta: idRuta, id_bus: idBus, fecha: fecha },
      });
      return response.data; // Adjusted to return only the data
    } catch (error) {
      console.error('Error searching tickets:', error);
      throw error;
    }
  };


  return {
    tickets,
    getTicket,
    postTicket,
    putEditarTicket,
    putTicketInactivar,
    putTicketActivar,
    buscarTickets
  };
});
