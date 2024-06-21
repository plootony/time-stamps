import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext} from "vue-router";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const isAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
    let isAuth: boolean = false // Защищает нас от бесконечного редиректа

    onAuthStateChanged(getAuth(), (user): void => {
        if (user && !isAuth) {
            isAuth = true
            next()
        } else if (!user && !isAuth) {
            isAuth = true
            next('/auth')
        }
    })
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
        path: '/calendar',
        name: 'calendar',
        component: () => import('@/pages/PageCalendar.vue'),
        beforeEnter: isAuth
    },
    {
        path: '/course/:id',
        name: 'course',
        component: () => import('@/pages/PageCourse.vue'),
        beforeEnter: isAuth,
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})
export default router
