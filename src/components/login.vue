<script>
import { ref } from 'vue';
import { useAdminStore } from "../stores/login"
import { useRouter } from "vue-router"
import { useQuasar } from 'quasar'

export default {
  setup() {
    const cuenta = ref('');
    const clave = ref('');
    const useAdmin = useAdminStore();
    const router = useRouter()
    const $q = useQuasar()
    console.log(useAdmin.loading);

    async function iniciar() {

      let res = await useAdmin.login(cuenta.value, clave.value);
      console.log(res);
      if (!useAdmin.token) {
        $q.notify({
          type: 'negative',
          message: res.response.data.msg
        });
      } else {
        console.log("entra");
        router.push("/Card");
        $q.notify({
          type: 'positive',
          message: 'Inicio Exitoso'
        });
      }


    }

    return {
      iniciar,
      cuenta,
      clave,
      useAdmin,
    };
  }
};

</script>
<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" flat bordered style="width: 300px;">
      <q-img
        src="https://img.redro.pl/plakaty/login-icon-vector-user-symbol-simple-linear-pictogram-user-interface-account-log-in-400-250244157.jpg"
        class="image-style" />

      <q-card-section>

        <div class="text-h5 q-mt-sm q-mb-xs" style="margin-bottom:20px; color: black;"><b>Bienvenido</b></div>
        <div class="text-caption text-grey">
          <input type="text" v-model="cuenta" name="cajaTexto" placeholder="Cuenta"
            style="padding-left: 30px; border-radius: 5px; background-color: rgb(212, 248, 255); color: black; width: 90%; height: 30px; border: 1px solid #000000; margin-bottom: 20px;">
          <input type="password" v-model="clave" id="clave" name="cajaTexto" placeholder="Contraseña"
            style="padding-left: 30px; border-radius: 5px; background-color: rgb(212, 248, 255); color: black; width: 90%; height: 30px; border: 1px solid #000000; margin-bottom: 20px;">
          <!-- <q-btn no-caps push color="primary"  @click="iniciar()" >
            <span v-if="useAdmin.loading">Iniciar</span>
            <q-spinner-radio v-else/>
          </q-btn> -->
          <!-- <q-btn :loading="useAdmin.loading" color="purple" @click="iniciar()">
            Button
            <template v-slot:useAdmin.loading>
              <q-spinner-radio />
            </template>
          </q-btn>  -->
          <q-btn :loading="useAdmin.loading" color="blue" @click="iniciar()">
            Ingresar
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
          </q-btn>

        </div>
      </q-card-section>
    </q-card>
  </div>
</template>



<style >
.my-card {
  width: 100%;
  max-width: 350px;
}

.image-style {
  max-width: 300px;
  max-height: 230px;

}

body {
  /* background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2i85hzz13fkacRTHYMtxuI4DvD1gMaRaxvw&usqp=CAU");  */
  max-width: 100%;
  max-height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

