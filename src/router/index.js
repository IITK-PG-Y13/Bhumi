import Vue from 'vue'
import Router from 'vue-router'
import GameRoom from '@/components/GameRoom'
import GameList from '@/components/GameList'
import GameEnd from '@/components/GameEnd'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: "GameList",
      path: '/',
      component: GameList
    },
    {
      name: "GameRoom",
      path: '/:gameId',
      component: GameRoom,
      props: true
    },
    {
      name: "GameEnd",
      path: '/:gameId/end',
      component: GameEnd,
      props: true
    }
  ]
})
