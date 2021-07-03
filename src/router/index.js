import Vue from 'vue'
import Router from 'vue-router'
import GameRoom from '@/components/GameRoom'
import GameList from '@/components/GameList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: GameList
    },
    {
      path: '/:gameId',
      component: GameRoom,
      props: true
    }
  ]
})
