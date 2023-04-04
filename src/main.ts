/*\
|c|
|u|             ,-.   -- Quạc quạc quạc
|i|     ,      ( {o\    -- Cạc cạc cạc cạc
|k|     {`"=,___) (`~
|h|      \  ,_.-   )
|o| ~^~^~^`- ~^ ~^ '~^~^~^~
|2| 
|1| ------ MTLKMS v2 ------
|0| -- Author: Cuikho210 --
\*/

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import useLayoutStore from './store/layout.store'

import 'material-icons/iconfont/material-icons.css'
import './asset/scss/main.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

const layoutStore = useLayoutStore()
layoutStore.setThemeToDefault()