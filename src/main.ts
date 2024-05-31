import '@/scss/app.scss'

import {createApp} from 'vue'
import {createPinia} from 'pinia'


import App from '@/App.vue'
import router from '@/router'
import VuePlyr from '@skjnldsv/vue-plyr'

import {initializeApp} from 'firebase/app'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VuePlyr)

const firebaseConfig = {
    apiKey: 'AIzaSyCmYbBbcFNx_basy918tHuJTcaIPo5A3g4',
    authDomain: 'time-stamp-51983.firebaseapp.com',
    projectId: 'time-stamp-51983',
    storageBucket: 'time-stamp-51983.appspot.com',
    messagingSenderId: '249280867482',
    appId: '1:249280867482:web:3ab211074c5b57171c8323'
}

initializeApp(firebaseConfig)

app.mount('#app')
