<template>
<section class="hero">
  <div class="hero-body p-1">
    <div class="container">
      <h1 class="title is-3">
        Welcome to Bhumi - The Game of Nurture
      </h1>
      <div class="columns">
        <div class="column is-8 is-offset-2 box is-relative">
          <div class="page-bar">
            <div v-for="p in tutorialCards.length"
                 :class="{page: true, selected: (itemId == p)}"
                 @click="itemId = p">
              {{p}}
            </div>
          </div>
          <div class="columns is-vcentered"
               v-for="(card, idx) in tutorialCards"
               v-if="itemId == idx + 1">
            <div class="column is-3">
              <img :src="card.image" class="image is-128x128 mr-6">
            </div>
            <div class="column is-9 has-text-left content is-size-5 is-italic">
              {{ card.text }}
            </div>
          </div>
        </div>
      </div>
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

let TUTORIAL_CARDS = [
  {
    image: "home_image.png",
    text: "Bhumi is a game of resource allocation. You are a farmer, nurturing and nourishing your land."
  },
  {
    image: "home_image.png",
    text: "Either trade with your neighbours to mutually grow your farm, or ask the Gods to attack their crops!"
  },
  {
    image: "home_image.png",
    text: "At the end of the game, the best harvest wins!"
  },
]

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
      itemId: 1,
      tutorialCards: TUTORIAL_CARDS,
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
  mounted () {
  //setInterval(() => {
  //  this.itemId = (this.itemId + 1) % this.tutorialCards.length
  //  if (this.itemId == 0) {
  //    this.itemId = this.tutorialCards.length
  //  }
  //}, 20000)
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
