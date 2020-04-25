import VueRouter from 'vue-router';
import Vue from 'vue';
import Map from './components/Map';

const routes = [
    {
        path: '/',
        component: Map
    }
];

Vue.use(VueRouter);

export default new VueRouter({
    routes
});