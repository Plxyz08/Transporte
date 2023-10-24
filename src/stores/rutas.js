import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useRutasStore = defineStore('ruta', () => {
    const rutas = ref([])
    const getRuta= async () => {
        try {
            let res = await axios.get(`/ruta/ruta`);
            rutas.value = res.data.ruta;
        } catch (error) {
            throw error
        }
    }
    const postRuta = async (data) =>{
        try {
            let res = await axios.post("ruta/ruta/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarRuta = async (id, data) => {
        try {
            let res = await axios.put(`ruta/ruta/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarRuta = async (id)=>{
        try {
            let res = await axios.put(`ruta/inactivarRuta/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }
    const putActivarRuta = async (id)=>{
        try {
            let res = await axios.put(`ruta/activarRuta/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }

    return {
        rutas,
        getRuta, postRuta, putEditarRuta, putInactivarRuta, putActivarRuta
    };
});
