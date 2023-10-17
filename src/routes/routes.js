import Main from "../components/Main.vue";
import Buses from "../components/Buses.vue";

import {createRouter, createWebHashHistory} from "vue-router"

const routes=[
    {path:"/", component:Main},
    {path:"/Buses", component:Buses}
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})