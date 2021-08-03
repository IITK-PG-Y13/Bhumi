<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns">
        <div class="column is-6">
          <div class="columns is-multiline">
            <div class="column is-12 py-0">
              <board :map="map"
                     :hoverData="selectedCardInfo"
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
                    {{ recipe.name }} x {{ recipeCount(idx)[recipe.name] || 0 }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="columns is-multiline">
            <div class="column is-12 is-paddingless">
              <div class="columns">
                <div class="column is-4" v-for="recipe in gameConfig.recipes">
                  <show-recipe :recipe="recipe" :recipeCount="recipeCount()[recipe.name]"></show-recipe>
                </div>
              </div>
            </div>
            <div class="column is-12 is-paddingless is-italic is-size-7">
              Move {{ turnIdx + 1 }} / {{ gameConfig.turns.length }}
            </div>
            <div class="column is-12" v-if="currentTurn.type == 'SEED'">
              <h3 class="title is-4">Seed Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="this.turnIdx"
                          :recipes="this.currentTurn.cardList"
                          @select="selectCard"></turn-cards>
            </div>
            <div class="column is-12" v-else-if="currentTurn.type == 'HARVEST'">
              <h3 class="title is-4">Harvest Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="this.turnIdx"
                          :recipes="gameConfig.recipes"
                          @select="selectCard"></turn-cards>
            </div>
          </div>
          <div class="tile is-ancestor is-parent player-status-list">
            <div class="tile is-child player-status"
                 v-for="idx in gameConfig.totalPlayers">
              <div class="notification is-success is-light m-1"
                   v-if="currentTurn.playersPlayed && currentTurn.playersPlayed[idx] != null">
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
            <span v-else-if="currentTurn.playersPlayed && currentTurn.playersPlayed[playerIdx]">
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
import recipes from '../data/recipes'
import db from '../firebase/init'
import ShowCard from './gameroom/ShowCard.vue'
import ShowRecipe from './gameroom/ShowRecipe.vue'
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
    'gameConfig.currentTurn': function () {
      this.nextTurn()
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
    allPlayersPlayed () {
      if (!this.currentTurn.playersPlayed) {
        return false
      }

      if ([...Array(this.gameConfig.totalPlayers).keys()].some((idx) => {
        return this.currentTurn.playersPlayed[idx + 1] == null
      })) {
        return false
      }

      return true
    }
  },
  methods: {
    lastMapState (idx) {
      let unparseTurn = null
      if (this.gameConfig.turns[this.gameConfig.currentTurn].playersPlayed &&
          this.gameConfig.turns[this.gameConfig.currentTurn].playersPlayed[idx]) {

        unparseTurn = this.gameConfig.currentTurn
      } else {
        unparseTurn = this.gameConfig.currentTurn - 1
      }

      if (unparseTurn < 0) {
        return {}
      }

      if (this.gameConfig.turns[unparseTurn].playersPlayed &&
          this.gameConfig.turns[unparseTurn].playersPlayed[idx]) {
        return JSON.parse(
                          this.
                            gameConfig.
                            turns[unparseTurn].
                            playersPlayed[idx]
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
      this.turnIdx = this.gameConfig.currentTurn
    },
    selectCard (evt) {
      this.selectedCardInfo = evt
    },
    clickable (i, j, type) {
      if (!this.gameConfig) {
        return false
      }

      if (this.currentTurn.playersPlayed &&
          this.currentTurn.playersPlayed[this.playerIdx] != null) {
        return false
      }

      if (this.currentTurn.type == 'SEED') {
        if (this.map[[i, j]] && this.map[[i, j]] == 'used') {
          return false
        }
      } else if (this.currentTurn.type == 'HARVEST') {
        if (!(this.map[[i, j]] && type == this.map[[i, j]]))
          return false
      }

      return true
    },
    recipeCount (idx) {
      if (idx == null) {
        idx = this.playerIdx
      }
      if (!this.gameConfig.playerRecipes || !this.gameConfig.playerRecipes[idx]) {
        return {}
      }
      return this.gameConfig.playerRecipes[idx];
    },
    getGameMap () {
      return JSON.stringify(this.map)
    },
    clickCoord (coords) {
      if (this.currentTurn.type == 'SEED') {
        coords.forEach(({ coord, type }) => {
          this.$set(this.map, coord, type)
        })

        this.passTurn()
      } else if (this.currentTurn.type == 'HARVEST') {
        coords.forEach(({ coord, type }) => {
          this.$set(this.map, coord, 'used')
        })

        let updatedRecipeCount = this.recipeCount()[this.selectedCardInfo.name]
        if (updatedRecipeCount == null) {
          updatedRecipeCount = 1
        } else {
          updatedRecipeCount += 1
        }

        db.
          ref(`games/${this.gameId}/playerRecipes/${this.playerIdx}/${this.selectedCardInfo.name}`).
          set(updatedRecipeCount)

        this.turnStarted = true
      }
    },
    passTurn () {
      db.
        ref(`games/${this.gameId}/turns/${this.turnIdx}/playersPlayed/${this.playerIdx}`).
        set(this.getGameMap()).then(() => {
          if (this.allPlayersPlayed) {
            db.ref(`games/${this.gameId}/currentTurn`).set(this.turnIdx + 1)
          }
      })
    },
    canPlayerPlay () {
      if (this.currentTurn.type == 'SEED')
        return true

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

      if (!this.canPlayerPlay()) {
        this.passTurn()
      }

      if (this.turnIdx >= this.gameConfig.turns.length) {
        this.$router.push({
          name: 'GameEnd',
          params: {
            gameId: this.gameId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
table.game td {
  &.yellow {
    background-color: #fcf5a7;
    background-image: url(../assets/tiles/yellow.png);
    background-size: 100% 100%;
  }

  &.green {
    background-color: #c9f7c6;
    background-image: url(../assets/tiles/green.png);
    background-size: 100% 100%;
  }

  &.brown {
    background-color: #e0ba77;
    background-image: url(../assets/tiles/brown.png);
    background-size: 100% 100%;
  }

  &.blue {
    background-color: #aae1fa;
    background-image: url(../assets/tiles/blue.png);
    background-size: 100% 100%;
  }

  &.used,
  &.yellow-used,
  &.green-used,
  &.brown-used,
  &.blue-used {
    background-image: url(../assets/tiles/used.png);
    background-size: 100% 100%;
  }
}

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
