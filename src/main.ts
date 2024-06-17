import '@/scss/app.scss'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import Vue3Toastify, {type ToastContainerOptions} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VuePlyr from '@skjnldsv/vue-plyr'

import {initializeApp} from 'firebase/app'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VuePlyr)
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
}

initializeApp(firebaseConfig)

app.mount('#app')
