import Vue from 'vue'
import {createRouter,createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import MyScene from '../views/MyScene.vue'
import PartScene from "../views/PartScene.vue";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/myScene',
        name: 'MyScene',
        component: MyScene
    },
    {
        path: '/partScene',
        name: 'MyScene2',
        component: PartScene
    }
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes: routes
})

export default router
