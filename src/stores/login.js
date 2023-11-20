import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAdminStore = defineStore('admin', () => {
  const token = ref('');
  const loading = ref(false);

  const login = async (cuenta, clave) => {
    try {
      loading.value = true;
      const response = await axios.post("/vendedor/vendedor_datos", { cuenta, clave });
      token.value = response.data.token;
      return response;
    } catch (error) {
      loading.value = false;
      console.error(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = ''; 
  };

  return {
    login,
    token,
    loading,
    logout,
  };
});