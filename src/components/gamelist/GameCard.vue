<template>
  <div :class="{box: true, 'has-background-danger-light': isHighlight}">
    <div class="tile is-ancestor is-parent">
      <div class="tile is-child" v-for="idx in gameData.totalPlayers">
          <div class="notification m-1 is-info is-light" v-if="gameData.players && gameData.players[idx]">
            {{ playerName(gameData.players[idx], idx) }}

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
import { db, dbRefs } from '../../firebase/init'
import { getCurrentPlayer } from '../../util/login'

export default {
  props: ['gameId', 'gameData', 'highlight'],
  data () {
    return {
      isHighlight: this.highlight,
    }
  },
  firebase: {
    players: db.ref('players')
  },
  computed: {
    playerIdx () {
      return this.gameData.players.indexOf(getCurrentPlayer())
    },
    gameURL () {
      return window.location.origin + "/#/" + this.gameId
    }
  },
  mounted () {
    setTimeout(() => {
      this.isHighlight = false;
    }, 5000)

    if (this.isHighlight) {
      this.$el.scrollIntoView();
      window.scrollTo(0, window.scrollY - 70)
    }
  },
  methods: {
    canJoin () {
      if (this.gameData.started) {
        return false;
      }

      if (this.gameData.players.includes(getCurrentPlayer())) {
        return false;
      }

      if (this.gameData.players.length > this.gameData.totalPlayers) {
        return false;
      }

      return true;
    },
    join () {
      let playerIdx = this.gameData.players.length
      db.ref(dbRefs.gamePlayers(this.gameId, playerIdx)).set(getCurrentPlayer())
    },
    canStart () {
      if (this.gameData.started) {
        return false;
      }

      if (this.gameData.players &&
          this.gameData.players.includes(getCurrentPlayer()) &&
          this.gameData.players.indexOf(getCurrentPlayer()) === 1) {
        return true
      }

      return false;
    },
    start () {
      db.ref(dbRefs.gameConfig(this.gameId)).update({
        totalPlayers: this.gameData.players.length - 1,
        started: true
      }).then(() => {
        this.$router.push(`/${this.gameId}`)
      })
    },
    playerName (playerUuid, idx) {
      if (idx == this.playerIdx) {
        return "You"
      } else if (this.players && this.players[playerUuid]) {
        return this.players[playerUuid]
      } else {
        return "Player " + idx
      }
    }
  }
}
</script>
