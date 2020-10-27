import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import Create from '../views/CreateGame.vue'
import Join from '../views/JoinGame.vue'

import ChoiseUI from '../views/ChoiseUi.vue' // be aware of lower case i in UI 

import Results from '../views/Results.vue'

import Winner from '../views/Winner.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/Create',
    name: 'Create',
    component: Create
  },
  {
    path: '/Join',
    name: 'Join',
    component: Join
  },
  {
    path: '/ChoiseUI',
    name: 'ChoiseUI',
    component: ChoiseUI,
    props: true
  },
  {
    path: '/Results',
    name: 'Results',
    component: Results,
    props: true
  },
  {
    path: '/Winner',
    name: 'Winner',
    component: Winner,
    props: true
  }
  
  
]

const router = new VueRouter({
  routes
})

export default router
