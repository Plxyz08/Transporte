import Main from "../components/Main.vue";
import Buses from "../components/Buses.vue";
import Login from "../components/login.vue";
import Clientes from "../components/Clientes.vue";
import Horarios from "../components/Horario.vue";
import Menu from "../layouts/Menu.vue";
import Card from "../components/Card.vue";
import Tiquetes from "../components/Tiquetes.vue";
import Conductores from "../components/Conductores.vue";
import Rutas from "../components/Rutas.vue";
import Vendedor from "../components/Vendedor.vue";



import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: "/", component: Login },
    { path: "/Login", component: Login },
    {
        path: "/Menu", component: Menu,
        children: [
            { path: "/Card", component: Card },
            { path: "/Buses", component: Buses },
            { path: "/Clientes", component: Clientes },
            { path: "/Horarios", component: Horarios },
            { path: "/Tiquetes", component: Tiquetes },
            { path: "/Conductores", component: Conductores },
            { path: "/Rutas", component: Rutas },
            { path: "/Vendedor", component: Vendedor },
        ]
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
