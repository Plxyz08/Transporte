import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useVendedorStore = defineStore('vendedor', () => {
    const vendedor = ref([])
    const getVendedor = async () => {
        try {
            let res = await axios.get(`/vendedor/vendedor`);
            vendedor.value = res.data.vendedor;
        } catch (error) {
            throw error
        }
    }
    const postCliente = async (data) =>{
        try {
            let res = await axios.post("cliente/cliente/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putCliente = async (id, data) => {
        try {
            let res = await axios.put(`cliente/cliente/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putClienteInactivar = async (id)=>{
        try {
            let res = await axios.put(`cliente/inactivarCliente/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del cliente");
        }
    }
    const putClienteActivar = async (id)=>{
        try {
            let res = await axios.put(`cliente/activarCliente/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del cliente");
        }
    }

    return {
        vendedor,
        getVendedor, postCliente, putCliente, putClienteInactivar, putClienteActivar
    };
}); 