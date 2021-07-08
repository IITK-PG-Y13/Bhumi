<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameList">
      <div class="columns is-multiline">
        <div class="column is-12" v-if="activeGames.length > 0">
          <h2 class="title is-4">
            Your Active Games
          </h2>
        </div>
        <div class="column is-6"
             v-for="key in activeGames">
          <game-card :gameId="key[0]" :gameData="key[1]"></game-card>
        </div>
        <div class="column is-12">
          <h2 class="title is-4">
            Open Games
          </h2>
        </div>
        <div class="column is-6"
             v-for="key in draftGames">
          <game-card :gameId="key[0]" :gameData="key[1]" :highlight="key[0] == highlight"></game-card>
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

function uuid6digit () {
  let str = "QWERTYUIOPASDFGHJKLZXCVBNM"
  let out = ""

  for (let i = 0; i < 6; i++) {
    out += str[Math.floor(Math.random() * 26)]
  }

  return out;
}

export default {
  data () {
    return {
      gameList: null,
      highlight: null
    }
  },
  components: {
    GameCard
  },
  firebase: {
    gameList: db.ref('games')
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (to.query) {
        vm.highlight = to.query.src
      }
    })
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

      let gameId = uuid6digit()
      db.ref('games/' + gameId).set(outputJson)
    }
  }
}
</script>
