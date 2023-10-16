import { createApp } from 'vue'
import wslink from "./wslink";
import { install } from "vue-vtk-js";
import App from './App.vue'

const client = wslink.createClient();
client.connect().then(() => {
    const vueApp = createApp(App);
    install(vueApp);
    vueApp.provide("wsClient", client);
    vueApp.mount('#app')
});
