<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns">
        <div class="column is-2" style="max-height: 80vh; overflow-y: scroll;">
          <h3 class="title is-4">Reference</h3>
          <h5 class="subtitle is-6">VP: {{ victoryPoints }}</h5>
          <div class="columns is-multiline">
            <div class="column is-12" v-for="recipe in gameConfig.recipes">
              <show-recipe :recipe="recipe" :recipeCount="recipeCount()[recipe.idx]"></show-recipe>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-12" v-for="power in gameConfig.godPowers">
              <show-god :god-power="power" :recipes="gameConfig.recipes"></show-god>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="columns is-multiline">
            <div class="column is-12 py-0">
              <board :map="map"
                     :hoverData="(needToPlay ? selectedCardInfo : null)"
                     @click="clickCoord"></board>
            </div>
            <div class="column is-12 is-paddingless">
              <hr style="margin: 0.5rem 0;"/>
            </div>
            <div class="column is-4 box"
                 v-for="idx in gameConfig.totalPlayers"
                 v-if="idx != playerIdx">
              <span class="has-text-weight-bold">
                {{ idx == playerIdx ? "You" : "Player " + idx }}
              </span>
              <board :map="lastMapState(idx)" size="is-tiny"></board>
              <div class="content">
                <ul class="has-text-left is-size-7">
                  <li v-for="recipe in gameConfig.recipes">
                    {{ recipe.name }} x {{ recipeCount(idx)[recipe.idx] || 0 }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="columns is-multiline">
            <div class="column is-12 is-paddingless is-italic is-size-7">
              Move {{ turnIdx + 1 }} / {{ gameConfig.turns.length }}
            </div>
            <div class="column is-12" v-if="currentTurn.type == 'SEED'">
              <h3 class="title is-4">Seed Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="turnIdx"
                          :recipes="currentTurn.cardList"
                          @select="selectCard"></turn-cards>
            </div>
            <div class="column is-12" v-else-if="currentTurn.type == 'HARVEST'">
              <h3 class="title is-4">Harvest Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="turnIdx"
                          :recipes="gameConfig.recipes"
                          headerKey="name"
                          @select="selectCard"></turn-cards>
            </div>
            <div class="column is-12" v-else-if="currentTurn.type == 'WORSHIP'">
              <h3 class="title is-4">Worship Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="turnIdx"
                          :recipes="gameConfig.godPowers"
                          headerKey="name"
                          @select="selectCard"></turn-cards>
            </div>
          </div>
          <div class="tile is-ancestor is-parent player-status-list">
            <div class="tile is-child player-status"
                 v-for="idx in gameConfig.totalPlayers">
              <div class="notification is-success is-light m-1"
                   v-if="currentTurn.playersPlayed && currentTurn.playersPlayed[idx]">
                {{ idx == playerIdx ? "You" : "Player " + idx }}
              </div>
              <div class="notification is-default m-1" v-else>
                {{ idx == playerIdx ? "You" : "Player " + idx }}
              </div>
            </div>
          </div>
          <div class="box">
            <button class="button is-fullwidth is-success"
                    @click="nextTurn"
                    v-if="allPlayersPlayed">
              Go to Next Turn
            </button>
            <span v-else-if="!needToPlay">
              Waiting for others...
            </span>
            <span v-else>
              It's your turn
              <br/><br/>
              <button :class="{
                                button: true,
                                'is-fullwidth': true,
                                'is-line': !turnStarted,
                                'is-success': turnStarted
                              }"
                      @click="passTurn">
                <template v-if="turnStarted">
                  Done
                </template>
                <template v-else>
                  Pass
                </template>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-else>
      Loading...
    </div>
  </div>
</section>
</template>

<script>
import shapes from '../data/shapes'
import db from '../firebase/init'
import ShowCard from './gameroom/ShowCard.vue'
import ShowRecipe from './gameroom/ShowRecipe.vue'
import ShowGod from './gameroom/ShowGod.vue'
import Board from './gameroom/Board.vue'
import TurnCards from './gameroom/TurnCards.vue'

export default {
  data () {
    return {
      loaded: false,
      gameConfig: null,
      playerIdx: null,
      turnIdx: 0,
      cardIdx: 0,
      selectedCardInfo: {},
      turnStarted: false,
      map: {}
    }
  },
  components: {
    ShowCard,
    Board,
    ShowRecipe,
    TurnCards,
    ShowGod,
  },
  props: [ 'gameId' ],
  watch: {
    gameId: {
      immediate: true,
      handler () {
        this.$rtdbBind('gameConfig', db.ref('games/' + this.gameId)).then(() => {
          // Loaded
          if (window.localStorage.getItem('playerId') == null ||
              this.gameConfig.players == null ||
              !this.gameConfig.started ||
              !this.gameConfig.active ||
              !this.gameConfig.players.includes(window.localStorage.getItem('playerId'))) {

            this.$router.push({
              path: '/',
              query: {
                src: this.gameId
              }
            })
            return
          }

          this.setGameData()
          this.loaded = true
        })
      }
    },
    'gameConfig.currentTurn': {
      handler () {
        this.nextTurn()
      }
    }
  },
  computed: {
    currentTurn () {
      return this.gameConfig.turns[this.turnIdx]
    },
    currentCard () {
      if (this.currentTurn.type == 'SEED') {
        return this.currentTurn.cardList[this.cardIdx]
      } else if (this.currentTurn.type == 'HARVEST') {
        return this.gameConfig.recipes[this.cardIdx]
      }
    },
    victoryPoints () {
      let recipeCount = this.recipeCount()

      let vp = 0

      recipeCount.forEach((ct, idx) => {
        switch (idx) {
          case 0:
            vp += ct
            break
          case 1:
            vp += ct * 5
            break
          case 2:
            vp += ct * 10
            break
        }
      })

      return vp
    },
    needToPlay () {
      if (this.currentTurn.playersPlayed && this.currentTurn.playersPlayed[this.playerIdx]) {
        return false
      } else {
        if (this.currentTurn.moveType && this.currentTurn.moveType == 'SEQUENTIAL') {
          if (!this.currentTurn.playersPlayed) {
            return (this.playerIdx == 1)
          }

          if (this.currentTurn.playersPlayed.length == this.playerIdx) {
            return true
          }

          return false
        } else {
          return true
        }
      }
    },
    allPlayersPlayed () {
      if (!this.currentTurn.playersPlayed) {
        return false
      }

      if ([...Array(this.gameConfig.totalPlayers).keys()].some((idx) => {
        return !this.currentTurn.playersPlayed[idx + 1]
      })) {
        return false
      }

      return true
    }
  },
  methods: {
    lastMapState (idx) {
      let unparseTurn = null
      if (this.gameConfig.turns[this.gameConfig.currentTurn].playerState &&
          this.gameConfig.turns[this.gameConfig.currentTurn].playerState[idx]) {

        unparseTurn = this.gameConfig.currentTurn
      } else {
        unparseTurn = this.gameConfig.currentTurn - 1
      }

      if (unparseTurn < 0) {
        return {}
      }

      if (this.gameConfig.turns[unparseTurn].playerState &&
          this.gameConfig.turns[unparseTurn].playerState[idx]) {
        return JSON.parse(
                          this.
                            gameConfig.
                            turns[unparseTurn].
                            playerState[idx]
        )
      }

      return {}
    },
    setGameData () {
      this.playerIdx = this.gameConfig.players.indexOf(window.localStorage.getItem('playerId'))

      if (this.gameConfig.initMap && this.gameConfig.currentTurn == 0) {
        this.map = JSON.parse(this.gameConfig.initMap)
      }

      this.map = this.lastMapState(this.playerIdx)
      this.nextTurn()
    },
    selectCard (evt) {
      this.selectedCardInfo = evt
    },
    clickable (i, j, type) {
      if (!this.gameConfig) {
        return false
      }

      if (!this.needToPlay) {
        return false
      }

      if (this.currentTurn.type == 'SEED') {
        if (this.map[[i, j]] && this.map[[i, j]] == 'used') {
          return false
        }

        return true
      }

      if (this.currentTurn.type == 'HARVEST') {
        if (!(this.map[[i, j]] && type == this.map[[i, j]])) {
          return false
        }

        return true
      }

      if (this.currentTurn.type == 'WORSHIP') {
        let out = true

        this.selectedCardInfo.cost.forEach((cost, idx) => {
          if (cost > 0 && (
                !this.recipeCount()[idx] ||
                this.recipeCount()[idx] < cost
          )) {
            out = false
          }
        })

        return out
      }

      return true
    },
    recipeCount (idx) {
      if (idx == null) {
        idx = this.playerIdx
      }
      if (!this.gameConfig.playerRecipes || !this.gameConfig.playerRecipes[idx]) {
        return []
      }
      let rc = this.gameConfig.playerRecipes[idx]

      // Random stuff because RTDB is weird
      // Convert to array if playerRecipes is an object
      if (Array.isArray(rc)) {
        return rc
      } else {
        let maxV = Math.max(...Object.keys(rc))
        let nrc = new Array(maxV)
        for (let i = 0; i < maxV; i++) {
          nrc[i] = rc[i] || 0
        }

        return nrc
      }
    },
    saveState () {
      return db.
        ref(`games/${this.gameId}/turns/${this.turnIdx}/playerState/${this.playerIdx}`).
        set(JSON.stringify(this.map))
    },
    clickCoord (coords) {
      if (this.currentTurn.type == 'SEED') {
        coords.forEach(({ coord, type }) => {
          this.$set(this.map, coord, type)
        })

        this.passTurn()
      }

      if (this.currentTurn.type == 'HARVEST') {
        coords.forEach(({ coord, type }) => {
          this.$set(this.map, coord, 'used')
        })

        let updatedRecipeCount = this.recipeCount()[this.selectedCardInfo.idx]
        if (updatedRecipeCount == null) {
          updatedRecipeCount = 1
        } else {
          updatedRecipeCount += 1
        }

        db.
          ref(`games/${this.gameId}/playerRecipes/${this.playerIdx}/${this.selectedCardInfo.idx}`).
          set(updatedRecipeCount)

        this.saveState()
        this.turnStarted = true
      }

      if (this.currentTurn.type == 'WORSHIP') {
        if (this.selectedCardInfo.powerType == 'REJUVENATE') {
          coords.forEach(({ coord }) => {
            if (this.map[coord] == 'used') {
              this.$set(this.map, coord, null)
            }
          })
        }

        this.selectedCardInfo.cost.forEach((cost, idx) => {
          if (cost == 0) {
            return
          }

          db.
            ref(`games/${this.gameId}/playerRecipes/${this.playerIdx}/${idx}`).
            set(this.recipeCount()[idx] - cost)
        })

        this.saveState()
        this.turnStarted = true
      }
    },
    passTurn () {
      Promise.all([
        this.saveState(),
        db.
          ref(`games/${this.gameId}/turns/${this.turnIdx}/playersPlayed/${this.playerIdx}`).
          set(true)
      ]).then(() => {
          if (this.allPlayersPlayed) {
            db.ref(`games/${this.gameId}/currentTurn`).set(this.turnIdx + 1)
          }
      })
    },
    canPlayerPlay () {
      if (this.currentTurn.type == 'SEED') {
        return true
      }

      if (this.currentTurn.type == 'HARVEST') {
        let out = true
        this.gameConfig.recipes.forEach((recipe) => {
          // out = false
        })
        return out
      }

      return true
    },
    nextTurn () {
      this.selectedCardInfo = {}
      this.cardIdx = 0
      this.turnStarted = false
      this.turnIdx = this.gameConfig.currentTurn

      if (this.turnIdx >= this.gameConfig.turns.length) {
        this.$router.push({
          name: 'GameEnd',
          params: {
            gameId: this.gameId
          }
        })
      }

      if (!this.canPlayerPlay()) {
        this.passTurn()
      }
    }
  }
}
</script>

<style lang="scss">
.player-status-list {
  .player-status {
    &:first-of-type {
      .notification {
        margin-left: 0px !important;
      }
    }
    &:last-of-type {
      .notification {
        margin-right: 0px !important;
      }
    }
  }
}
</style>
