import {createRouter,createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import CarGroup from "@/views/CarGroup.vue";
import CarView from "@/views/CarView.vue";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/cargroup',
        name: 'CarGroup',
        component: CarGroup
    },
    {
        path: '/carview',
        name: 'CarView',
        component: CarView
    },
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes: routes
})

export default router
