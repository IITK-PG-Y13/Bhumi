<template>
  <div :class="{box: true, 'has-background-danger-light': isHighlight}">
    <div class="tile is-ancestor is-parent">
      <div class="tile is-child" v-for="idx in gameData.totalPlayers">
          <div class="notification m-1 is-info is-light" v-if="gameData.players && gameData.players[idx]">
            {{ idx === playerIdx ? "You" : "Player " + idx }}

          </div>
          <div class="notification m-1 is-default is-italic" v-else>
            &lt;empty&gt;
          </div>
      </div>
    </div>
    <div class="tile is-ancestor is-parent">
      Game Link: <code>{{ gameURL }}</code>
    </div>
    <div class="tile is-ancestor is-parent" v-if="canJoin()">
      <button class="button is-success is-fullwidth" @click="join">
        Join
      </button>
    </div>
    <div class="tile is-ancestor is-parent" v-if="gameData.started">
      <router-link :to="'/' + gameId"
                   class="button is-primary is-fullwidth">
        Go To Game
      </router-link>
    </div>
    <div class="tile is-ancestor is-parent" v-if="canStart()">
      <button class="button is-success is-fullwidth" @click="start">
        Start
      </button>
    </div>


  </div>
</template>

<script>
import db from '../../firebase/init'

export default {
  props: ['gameId', 'gameData', 'highlight'],
  data () {
    return {
      isHighlight: this.highlight
    }
  },
  computed: {
    playerIdx () {
      return this.gameData.players.indexOf(window.localStorage.getItem('playerId'))
    },
    gameURL () {
      return window.location.origin + "/#/" + this.gameId
    }
  },
  mounted () {
    setTimeout(() => {
      this.isHighlight = false;
    }, 5000)
  },
  methods: {
    canJoin () {
      if (this.gameData.started) {
        return false;
      }

      if (this.gameData.players.includes(window.localStorage.getItem('playerId'))) {
        return false;
      }

      if (this.gameData.players.length >= this.gameData.totalPlayers) {
        return false;
      }

      return true;
    },
    join () {
      let playerIdx = this.gameData.players.length
      db.ref(`${this.gameId}/players/${playerIdx}`).set(window.localStorage.getItem('playerId'))
    },
    canStart () {
      if (this.gameData.started) {
        return false;
      }

      if (this.gameData.players &&
          this.gameData.players.includes(window.localStorage.getItem('playerId')) &&
          this.gameData.players.indexOf(window.localStorage.getItem('playerId')) === 1) {
        return true
      }

      return false;
    },
    start () {
      db.ref(this.gameId).update({
        totalPlayers: this.gameData.players.length - 1,
        started: true
      }).then(() => {
        this.$router.push(`/${this.gameId}`)
      })
    }
  }
}
</script>
