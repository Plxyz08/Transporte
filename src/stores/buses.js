import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';


export const useBusStore = defineStore('bus', () => {
    const buses = ref([])
    const obtenerInfoBuses = async () => {
        try {
            let response = await axios.get(`/bus/buses`);
            buses.value = response.data.buses;
        } catch (error) {
            throw error
        }
    }
    return {
        buses,
        obtenerInfoBuses
    }
}
)


