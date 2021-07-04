<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameList">
      <div class="columns is-multiline">
        <div class="column is-12" v-if="activeGames.length > 0">
          Your Active Games
        </div>
        <div class="column is-6"
             v-for="key in activeGames">
          <game-card :gameId="key[0]" :gameData="key[1]"></game-card>
        </div>
        <div class="column is-12">
          Open Games
        </div>
        <div class="column is-6"
             v-for="key in draftGames">
          <game-card :gameId="key[0]" :gameData="key[1]"></game-card>
        </div>
        <div class="column is-12">
          <button class="button is-success" @click="createNewGame">
            Create New
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</section>
</template>

<script>
import db from '../firebase/init'
import GameCard from './gamelist/GameCard.vue'
import create from '../data/create'
import { v4 } from 'uuid'

export default {
  data () {
    return {
      gameList: null
    }
  },
  components: {
    GameCard
  },
  firebase: {
    gameList: db.ref('/')
  },
  created () {
    if (window.localStorage.getItem('playerId') == null) {
      window.localStorage.setItem('playerId', v4())
    }
  },
  computed: {
    activeGames () {
      return Object.entries(this.gameList).filter((key) => {
        return key[1].active &&
               key[1].started &&
               key[1].players &&
               key[1].players.includes(window.localStorage.getItem('playerId'))
      });
    },
    draftGames () {
      return Object.entries(this.gameList).filter((key) => {
        return key[1].active &&
               !key[1].started
      });
    }
  },
  methods: {
    createNewGame () {
      let outputJson = create()
      outputJson.players = [ null, window.localStorage.getItem('playerId') ]
      db.ref('DEF').set(outputJson)
    }
  }
}
</script>
