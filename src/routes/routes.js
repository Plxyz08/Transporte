import Main from "../components/Main.vue";
import Buses from "../components/Buses.vue";
import Login from "../components/login.vue";
import Menu from "../layouts/Menu.vue";
import Card from "../components/Card.vue";
import Tiquetes from "../components/Tiquetes.vue";



import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: "/", component: Main },
    { path: "/Login", component: Login },
    {
        path: "/Menu", component: Menu,
        children: [
            { path: "/Card", component: Card },
            { path: "/Buses", component: Buses },
            { path: "/Tiquetes", component: Tiquetes },

        ]
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
