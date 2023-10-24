<template>
  <div class="padre">
    <div class="card">
      <router-link to="/Buses"
        ><q-icon style="font-size: 6rem" name="directions_bus" />
        <br />Buses</router-link
      >
    </div>
    <div class="card">
      <router-link to="/"
        ><q-icon style="font-size: 6rem" name="people_alt" />
        <br />Clientes</router-link
      >
    </div>
    <div class="card">
      <router-link to="/Conductores"
        ><q-icon style="font-size: 6rem" name="badge" />
        <br />Conductores</router-link
      >
    </div>
    <div class="card">
      <router-link to="/"
        ><q-icon style="font-size: 6rem" name="today" />
        <br />Horarios</router-link
      >
    </div>
    <div class="card">
      <router-link to="/"
        ><q-icon style="font-size: 6.2rem" name="fork_right" />
        <br />
        Rutas</router-link
      >
    </div>
    <div class="card">
      <router-link to="/Tiquetes"
        ><q-icon style="font-size: 6rem" name="confirmation_number" />
        <br />Tickets</router-link
      >
    </div>
    <div class="card">
      <router-link to="/"
        ><q-icon style="font-size: 6rem" name="point_of_sale" />
        <br />Vendedores</router-link
      >
    </div>
    <div class="card">
      <router-link to="/"
        > <q-icon style="font-size: 6rem" name="payments" />
        <br />Ventas</router-link
      >
    </div>
  </div>
</template>

<script></script>

<style scoped>
.padre {
  display: flex;
  flex-wrap: wrap;
  gap: 65px;
  padding: 2%;
}

.padre a {
  text-decoration: none;
  color: #1976d2;
}

.card {
  box-sizing: border-box;
  width: 240px;
  height: 254px;
  background: white;
  box-shadow: 2px 7px 11px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s;
  display: flex;
  user-select: none;
  font-weight: bolder;
  color: black;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.card:hover {
  border: 1px solid black;
  transform: scale(1.05);
}

.card:active {
  transform: scale(0.95) rotateZ(1.7deg);
}
</style>
