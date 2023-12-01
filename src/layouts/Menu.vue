<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-icon name="share_location" style="font-size: 2.5rem" />
          Transporte
        </q-toolbar-title>

        <q-btn dense flat round icon="logout" @click="cerrarSesion" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay style="background-color: #242424">
      <q-scroll-area style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #242424;
        ">
        <q-list padding>
          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="home_work" />
            </q-item-section>

            <q-item-section> <router-link to="/Card">Home</router-link> </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="directions_bus" />
            </q-item-section>

            <q-item-section>
              <router-link to="/Buses">Buses</router-link>
            </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="people_alt" />
            </q-item-section>

            <q-item-section> <router-link to="/Clientes">Clientes</router-link> </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="badge" />
            </q-item-section>

            <q-item-section><router-link to="/Conductores"> Conductores</router-link> </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="today" />
            </q-item-section>

            <q-item-section><router-link to="/Horarios"> Horarios</router-link> </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="fork_right" />
            </q-item-section>

            <q-item-section><router-link to="/Rutas">Rutas </router-link> </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="point_of_sale" />
            </q-item-section>

            <q-item-section><router-link to="/Vendedor"> Vendedores</router-link></q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="confirmation_number" />
            </q-item-section>

            <q-item-section><router-link to="/Tiquetes">Tickets</router-link> </q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon style="font-size: 2.5rem" name="payments" />
            </q-item-section>

            <q-item-section><router-link to="/Ventas">Ventas</router-link> </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div><span>&copy; 2023 - Todos los derechos reservados</span></div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useAdminStore } from "../stores/login.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const useAdmin = useAdminStore();
    const router = useRouter();

    const cerrarSesion = () => {
      useAdmin.logout();
      router.push({ name: "login" });
    };

    return {
      leftDrawerOpen,
      cerrarSesion,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>

<style scoped>
.q-drawer--left.q-drawer--bordered {
  border-right: 0px solid rgba(0, 0, 0, 0.12);
}
</style>
