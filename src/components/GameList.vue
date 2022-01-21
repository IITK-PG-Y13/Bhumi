<template>
<section class="hero">
  <div class="hero-body p-1">
    <div class="container">
      <h1 class="title is-3">
        Welcome to Bhumi - The Game of Nurture
      </h1>
      <intro></intro>
      <button class="button is-primary is-outlined is-light" onclick="window.open('/static/Bhumi - Rules.pdf', '_blank')">Learn the Rules</button>
    </div>
  </div>
  <div class="hero-body pt-6">
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
        <div class="column is-8 is-offset-2 box">
          <create-new-game @submit="createNewGame"></create-new-game>
        </div>
        <div class="column is-12" v-if="liveGames.length > 0">
          <hr/>
          <h2 class="title is-4">
            Spectate Games
          </h2>
        </div>
        <div class="column is-6"
             v-for="key in liveGames">
          <game-card :gameId="key[0]" :gameData="key[1]"></game-card>
        </div>
        <div class="column is-12" v-if="archivedGames.length > 0">
          <hr/>
          <h2 class="title is-4">
            Your Archived Games
          </h2>
        </div>
        <div class="column is-6"
             v-for="key in archivedGames">
          <game-card :gameId="key[0]" :gameData="key[1]"></game-card>
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
import { db, dbRefs } from '../firebase/init'
import GameCard from './gamelist/GameCard.vue'
import Intro from './gamelist/Intro.vue'
import CreateNewGame from './gamelist/CreateNewGame.vue'
import createGame from '../data/create'
import { getCurrentPlayer, setCurrentPlayer } from '../util/login'

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
      activeButNotStarted: [],
      gameList: null,
      highlight: null,
    }
  },
  components: {
    GameCard,
    Intro,
    CreateNewGame
  },
  firebase: {
    gameList: db.ref('games'),
  },
  watch: {
    'gameList': {
      deep: true,
      immediate: true,
      handler (gameList) {
        if (!gameList) {
          return
        }
        this.activeButNotStarted.forEach((key) => {
          if (gameList[key] && gameList[key].active && gameList[key].started) {
            let routeData = this.$router.resolve({
              name: "GameRoom",
              params: {
                gameId: key
              }
            })

            window.open(routeData.href, '_blank')
          }
        })

        // Update List
        this.activeButNotStarted = []
        Object.entries(gameList).filter((key) => {
          return key[1].active &&
                 !key[1].started &&
                 key[1].players &&
                 key[1].players.includes(getCurrentPlayer()) &&
                 key[1].players.indexOf(getCurrentPlayer()) != 1
        }).forEach((key) => {
          if (!this.activeButNotStarted.includes(key[0])) {
            this.activeButNotStarted.push(key[0])
          }
        })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (to.query) {
        vm.highlight = to.query.src
      }
    })
  },
  created () {
    // Redundant, but just to be safe
    setCurrentPlayer()
  },
  computed: {
    activeGames () {
      return Object.entries(this.gameList).filter((key) => {
        return key[1].active &&
               key[1].started &&
               key[1].players &&
               key[1].players.includes(getCurrentPlayer())
      });
    },
    draftGames () {
      return Object.entries(this.gameList).filter((key) => {
        return key[1].active &&
               !key[1].started
      });
    },
    liveGames () {
      return Object.entries(this.gameList).filter((key) => {
        return key[1].active &&
               key[1].started &&
               key[1].players &&
               !key[1].players.includes(getCurrentPlayer())
      });
    },
    archivedGames () {
      return Object.entries(this.gameList).filter((key) => {
        return !key[1].active &&
               key[1].started &&
               key[1].players &&
               key[1].players.includes(getCurrentPlayer())
      });
    }
  },
  methods: {
    createNewGame (newGameConfig) {
      let outputJson = createGame(newGameConfig)
      outputJson.players = [ null, getCurrentPlayer() ]

      let gameId = uuid6digit()
      db.ref(dbRefs.gameConfig(gameId)).set(outputJson)
    }
  }
}
</script>

<style lang="scss">
.page-bar {
  display: block;
  position: absolute;
  margin-right: 5px;
  right: 0;
  bottom: 0;

  .page {
    cursor: pointer;
    background-color: #bbb;
    display: inline-block;
    color: white;
    font-weight: 700;
    padding: 2px 5px;
    margin: 0 2px;
    border-radius: 2px 2px 0 0;

    &.selected {
      background-color: #00d1b2;
    }
  }
}
</style>
