import Main from "../components/Main.vue";
import Buses from "../components/Buses.vue";
import Login from "../components/Login.vue";

import {createRouter, createWebHashHistory} from "vue-router"

const routes=[
    {path:"/", component:Main},
    {path:"/Buses", component:Buses},
    {path:"/Login", component:Login},
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})
