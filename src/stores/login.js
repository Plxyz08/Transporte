import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAdminStore = defineStore ("admin",()=>{
    
    const token = ref("")
    let loading=ref(false)
    const login = async(cuenta, clave)=>{
        console.log(cuenta)
        console.log(clave)
        
        try{
            loading=true
            const r = await axios.post("/vendedor/vendedor_datos",{cuenta:cuenta, clave:clave});
            console.log(r)
            token= r.data.token
            return r
        }catch (error){
            loading=true
            console.log(error);
            return error
        }finally{
            loading=false
        }
    }
    return{
        login, token, loading
    }
})

