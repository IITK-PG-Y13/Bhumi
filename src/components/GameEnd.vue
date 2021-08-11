<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns is-multiline">
        <div class="column is-6 is-offset-3">
          <div v-for="(rank, idx) in ranks()"
               :class="{
                         notification: true,
                         'is-gold': (idx == 0),
                         'is-silver': (idx == 1),
                         'is-bronze': (idx == 2),
                         'is-default': (idx > 2)
                       }">
            <strong>
              {{ rank.name }}: {{ rank.victoryPoints }} points
            </strong>
          </div>
        </div>


      </div>
      <div class="columns is-multiline">
        <div class="column is-6" v-for="(map, idx) in maps">
          <div class="box">
            <div class="columns is-multiline">
              <div class="column is-12">
                <div class="notification is-default level">
                  <strong class="level-left">
                    {{ idx == playerIdx ? "You" : "Player " + idx }}
                  </strong>
                  <strong class="level-right">
                    Victory Points: {{ victoryPoints(idx) }}
                  </strong>
                </div>
              </div>
              <div class="column is-12">
                <board :map="map" size="is-small"></board>
              </div>
              <div class="column is-4" v-for="recipe in gameConfig.recipes">
                <show-recipe :recipe="recipe"
                             :recipeCount="recipeCount(idx, recipe.idx)"></show-recipe>
              </div>
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
import { ensureArray } from '../util/util'

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

          if (this.gameConfig.active) {
            db.ref(`games/${this.gameId}/active`).set(false)
          }

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
        this.$set(this.maps, idx, JSON.parse(this.gameConfig.playerState[idx]))
      })
    },
    recipeCount (playerId, recipeIdx) {
      if (!this.gameConfig.playerRecipes || !this.gameConfig.playerRecipes[playerId]) {
        return 0
      }

      return this.gameConfig.playerRecipes[playerId][recipeIdx]
    },
    recipeCountTotal (idx) {
      if (idx == null) {
        idx = this.playerIdx
      }
      if (!this.gameConfig.playerRecipes || !this.gameConfig.playerRecipes[idx]) {
        return []
      }
      let rc = this.gameConfig.playerRecipes[idx]

      return ensureArray(rc)
    },
    victoryPoints (idx) {
      // FIXME: Currently copied from GameRoom.vue
      let recipeCount = this.recipeCountTotal(idx)

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
    ranks () {
      let score = []
      for (let i = 1; i <= this.gameConfig.totalPlayers; i++) {
        score.push({
          name: i == this.playerIdx ? "You" : `Player ${i}`,
          victoryPoints: this.victoryPoints(i)
        })
      }

      score.sort((a, b) => b.victoryPoints - a.victoryPoints)

      return score
    }
  }
}
</script>

<style lang="scss">
.is-gold {
  background: linear-gradient(0deg, gold 70%, #ffffdd);
}

.is-silver {
  background: linear-gradient(0deg, silver 70%, #eee);
}
</style>
