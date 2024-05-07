import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/PageHome.vue')
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('@/pages/PageAuth.vue')
        },
        {
            path: '/course/:id',
            name: 'course',
            component: () => import('@/pages/PageCourse.vue')
        }
    ]
})

export default router
