import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useVentasStore = defineStore('ventas', () => {
  const tickets = ref([]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/tickets'); // Update the URL as per your backend API endpoint
      tickets.value = response.data;
    } catch (error) {
      throw error;
    }
  };

  const agregarTicket = async (ticket) => {
    try {
      const response = await axios.post('/api/agregar', ticket); // Update the URL as per your backend API endpoint
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const editarTicket = async (id, data) => {
    try {
      const response = await axios.put(`/api/editarTicket/${id}`, data); // Update the URL as per your backend API endpoint
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const inactivarTicket = async (id) => {
    try {
      const response = await axios.put(`/api/inactivarTicket/${id}`); // Update the URL as per your backend API endpoint
      return response.data;
    } catch (error) {
      console.error('Error inactivating ticket:', error);
    }
  };

  const activarTicket = async (id) => {
    try {
      const response = await axios.put(`/api/activarTicket/${id}`); // Update the URL as per your backend API endpoint
      return response.data;
    } catch (error) {
      console.error('Error activating ticket:', error);
    }
  };

  const buscarTickets = async (idRuta, idBus, fecha) => {
    try {
      const response = await axios.get(`/api/encontrarTickets`, {
        params: { id_ruta: idRuta, id_bus: idBus, fecha: fecha },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    tickets,
    fetchTickets,
    agregarTicket,
    editarTicket,
    inactivarTicket,
    activarTicket,
    buscarTickets,
  };
});
