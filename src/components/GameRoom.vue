<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns">
        <div class="column is-6">
          <div class="columns is-multiline">
            <div class="column is-12">
              <board :map="map"
                     :hoverData="selectedCardInfo"
                     @click="clickCoord"></board>
            </div>
            <div class="column is-6" v-for="recipe in gameConfig.recipes">
              <show-recipe :recipe="recipe" :recipeCount="recipeCount[recipe.name]"></show-recipe>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="columns is-multiline">
            <div class="column is-12">
              Move {{ turnIdx + 1 }} / {{ gameConfig.turns.length }}
            </div>
            <div class="column is-12" v-if="currentTurn.type == 'SEED'">
              <turn-cards :currentTurn="currentTurn"
                          :recipes="this.currentTurn.cardList"
                          @select="selectCard"></turn-cards>
            </div>
            <div class="column is-12" v-else-if="currentTurn.type == 'HARVEST'">
              <turn-cards :currentTurn="currentTurn"
                          :recipes="gameConfig.recipes"
                          @select="selectCard"></turn-cards>
            </div>
          </div>
          <div class="tile is-ancestor is-parent mt-5">
            <div class="tile is-child"
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
          <div class="box mt-5">
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
              <button class="button is-line is-fullwidth" @click="passTurn">Pass</button>
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
    },
    recipeCount () {
      if (!this.gameConfig.playerRecipes) {
        return {}
      }
      return this.gameConfig.playerRecipes[this.playerIdx];
    }
  },
  methods: {
    setGameData () {
      this.playerIdx = this.gameConfig.players.indexOf(window.localStorage.getItem('playerId'))

      if (this.gameConfig.initMap && this.gameConfig.currentTurn == 0) {
        this.map = JSON.parse(this.gameConfig.initMap)
      }

      if (this.gameConfig.currentTurn > 0) {
        let unparseTurn = null
        if (this.gameConfig.turns[this.gameConfig.currentTurn].playersPlayed &&
            this.gameConfig.turns[this.gameConfig.currentTurn].playersPlayed[this.playerIdx]) {

          unparseTurn = this.gameConfig.currentTurn
        } else {
          unparseTurn = this.gameConfig.currentTurn - 1
        }

        this.map = JSON.parse(
                              this.
                                gameConfig.
                                turns[unparseTurn].
                                playersPlayed[this.playerIdx]
        )

        this.turnIdx = this.gameConfig.currentTurn
      }
    },
    recipeAt (idx, flip, rotate) {
      let cl = this.gameConfig.recipes[idx]

      return {
        type: cl.type,
        shape: shapes.getNew(cl.shape)
      }
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
        if (this.map[[i, j]]) {
          return false
        }
      } else if (this.currentTurn.type == 'HARVEST') {
        if (!(this.map[[i, j]] && type == this.map[[i, j]]))
          return false
      }

      return true
    },
    getGameMap () {
      return JSON.stringify(this.map)
    },
    clickCoord (coords) {
      if (this.currentTurn.type == 'SEED') {
        coords.forEach(({ coord, type }) => {
          this.$set(this.map, coord, type)
        })
      } else if (this.currentTurn.type == 'HARVEST') {
        coords.forEach(({ coord, type }) => {
          this.$set(this.map, coord, type + '-used')
        })

        let updatedRecipeCount = this.recipeCount[this.selectedCardInfo.name]
        if (updatedRecipeCount == null) {
          updatedRecipeCount = 1
        } else {
          updatedRecipeCount += 1
        }

        db.
          ref(`games/${this.gameId}/playerRecipes/${this.playerIdx}/${this.selectedCardInfo.name}`).
          set(updatedRecipeCount)
      }

      this.passTurn()
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
    nextTurn () {
      this.selectedCardInfo = {}
      this.cardIdx = 0
      this.turnIdx += 1
    }
  }
}
</script>

<style lang="scss">
table.game td {
  &.yellow {
    background-color: yellow;
  }

  &.green {
    background-color: green;
  }

  &.brown {
    background-color: brown;
  }

  &.blue {
    background-color: blue;
  }

  &.yellow-used {
    background-color: yellow;
    opacity: 0.2;
  }

  &.green-used {
    background-color: green;
    opacity: 0.2;
  }

  &.brown-used {
    background-color: brown;
    opacity: 0.2;
  }

  &.blue-used {
    background-color: blue;
    opacity: 0.2;
  }
}
</style>
