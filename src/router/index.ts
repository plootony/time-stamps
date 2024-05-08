import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext} from "vue-router";
import {useUserStore} from "@/stores/user";

const isAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
    const userStore = useUserStore()
    if (!userStore.userId) {
        next({name: 'auth'})
    } else {
        next()
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/pages/PageHome.vue'),
        beforeEnter: isAuth
    },
    {
        path: '/auth',
        name: 'auth',
        component: () => import('@/pages/PageAuth.vue')
    },
    {
        path: '/course/:id',
        name: 'course',
        component: () => import('@/pages/PageCourse.vue'),
        beforeEnter: isAuth
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})
export default router
