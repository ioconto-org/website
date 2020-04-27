import VueRouter from 'vue-router';
import Vue from 'vue';

import Homepage from './pages/Homepage';
import MunicipalityDetails from './pages/MunicipalityDetails';

const routes = [
    {
        path: '/',
        component: Homepage
    },
    {
        path: '/istat/:istatId',
        component: MunicipalityDetails
    }
];

Vue.use(VueRouter);

export default new VueRouter({
    routes
});