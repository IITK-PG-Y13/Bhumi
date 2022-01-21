<template>
  <div id="app">
    <nav class="navbar is-primary is-fixed-top">
      <div class="navbar-brand">
        <a class="navbar-item">
          <img src="static/favicon-32x32.png" class="image pr-2">
          <strong>
            Bhumi
          </strong>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">
            Home
          </router-link>
        </div>
        <div class="navbar-end">
          <a class="navbar-item" @click="playerNameModalShown = true">
            {{ userPlayerName }}
          </a>
        </div>
      </div>
    </nav>
    <div class="modal is-active" v-show="playerNameModalShown">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="box">
          <h3 class="title is-4">Enter your Name</h3>
          <h5 class="subtitle is-6">This allows other players to recognize you</h5>
          <div class="field">
            <div class="control">
              <input class="input" type="text" v-model="userPlayerName">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary is-fullwidth" @click="updateName">Update</button>
            </div>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { db, dbRefs } from './firebase/init'
import { getCurrentPlayer, setCurrentPlayer } from './util/login'
export default {
  data () {
    return {
      userPlayerName: null,
      playerNameModalShown: false,
    }
  },
  firebase: {
    players: db.ref('players')
  },
  created () {
    setCurrentPlayer()
  },
  mounted () {
    db.ref('players').once('value').then(() => {
      if (!this.currentPlayerName()) {
        this.playerNameModalShown = true
      } else {
        this.userPlayerName = this.currentPlayerName()
      }
    })
  },
  methods: {
    currentPlayerName () {
      if (!getCurrentPlayer()) {
        return null
      }
      if (!this.players) {
        return null
      }
      return this.players[getCurrentPlayer()]
    },
    updateName () {
      this.closeModal()
      if (this.userPlayerName != null && this.userPlayerName != "") {
        db.ref(dbRefs.playerName(getCurrentPlayer())).set(this.userPlayerName)
      }
    },
    closeModal () {
      this.playerNameModalShown = false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
