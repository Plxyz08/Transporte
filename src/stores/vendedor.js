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
    const postVendedor = async (data) =>{
        try {
            let res = await axios.post("vendedor/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putVendedor = async (id, data) => {
        try {
            let res = await axios.put(`vendedor/vendedor/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putVendedorInactivar = async (id)=>{
        try {
            let res = await axios.put(`vendedor/inactivarVendedor/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del cliente");
        }
    }
    const putVendedorActivar= async (id)=>{
        try {
            let res = await axios.put(`vendedor/activarVendedor/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado del cliente");
        }
    }

    return {
        vendedor,
        getVendedor, postVendedor, putVendedor, putVendedorInactivar, putVendedorActivar
    };
}); 