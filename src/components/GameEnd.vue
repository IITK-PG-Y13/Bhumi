<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns is-multiline">
        <div class="column is-6" v-for="(map, idx) in maps">
          <div class="columns is-multiline">
            <div class="column is-12">
              {{ idx == playerIdx ? "You" : "Player " + idx }}
              <board :map="map"></board>
            </div>
            <div class="column is-4" v-for="recipe in gameConfig.recipes">
              <show-recipe :recipe="recipe"
                           :recipeCount="recipeCount(idx, recipe.idx)"></show-recipe>
            </div>
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
import { db } from '../firebase/init'
import Board from './gameroom/Board.vue'
import ShowRecipe from './gameroom/ShowRecipe.vue'

export default {
  data () {
    return {
      loaded: false,
      playerIdx: -1,
      gameConfig: null,
      maps: {}
    }
  },
  components: {
    Board,
    ShowRecipe
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
              !this.gameConfig.players.includes(window.localStorage.getItem('playerId'))) {

            this.$router.push({
              path: '/',
              query: {
                src: this.gameId
              }
            })
            return
          }

          if (this.gameConfig.currentTurn < this.gameConfig.turns.length) {
            this.$router.push({
              name: "GameRoom",
              params: {
                gameId: this.gameId
              }
            })
          }

          /*
          if (this.gameConfig.active) {
            this.$router.push({
              name: "GameRoom",
              params: {
                gameId: this.gameId
              }
            })
          }
          */

          this.setGameData()
          this.loaded = true
        })
      }
    }
  },
  methods: {
    setGameData () {
      this.playerIdx = this.gameConfig.players.indexOf(window.localStorage.getItem('playerId'))

      let latestTurn = this.gameConfig.turns.length - 1

      this.gameConfig.players.map((player, idx) => {
        this.$set(this.maps, idx, JSON.parse(
                                             this.
                                               gameConfig.
                                               turns[latestTurn].
                                               playerState[idx]
        ))
      })
    },
    recipeCount (playerId, recipeIdx) {
      if (!this.gameConfig.playerRecipes || !this.gameConfig.playerRecipes[playerId]) {
        return 0
      }

      return this.gameConfig.playerRecipes[playerId][recipeIdx]
    }
  }
}
</script>
