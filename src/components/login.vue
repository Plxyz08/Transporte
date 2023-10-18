
<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" flat bordered style="width: 300px;">
      <q-img
        src="https://img.redro.pl/plakaty/login-icon-vector-user-symbol-simple-linear-pictogram-user-interface-account-log-in-400-250244157.jpg"
        class="image-style" />

      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs" style="margin-bottom:20px;"><b>Bienvenido</b></div>
        <div class="text-caption text-grey">
          <input type="text" id="cajaTexto" name="cajaTexto" placeholder="Usuario"
            style="padding-left: 30px; width: 90%; height: 30px; border: 1px solid #ccc; margin-bottom: 20px;">
            <input type="text" id="cajaTexto" name="cajaTexto" 
         placeholder="Contraseña" 
         style="padding-left: 30px; width: 90%; height: 30px; border: 1px solid #ccc; margin-bottom: 20px;">
          <q-btn no-caps push color="primary" label="Ingresar" @click="show()" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const cuenta = ref('');
    const clave = ref('');

    const show = async () => {
      try {
        const response = await fetch('https://transporte-czaa.onrender.com/api/vendedor/vendedor_datos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cuenta: cuenta.value,
            clave: clave.value
          }),
        });

        const data = await response.json();
        console.log(data); 

      } catch (error) {
        console.error('Error:', error);
      }
    };

    return {
      show,
      cuenta,
      clave
    };
  },
};
</script>


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
 /*  background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2i85hzz13fkacRTHYMtxuI4DvD1gMaRaxvw&usqp=CAU"); */
  max-width: 100%;
  max-height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

