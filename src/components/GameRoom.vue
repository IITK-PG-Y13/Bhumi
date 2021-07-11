<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns">
        <div class="column is-6">
          <board :map="map"></board>
        </div>
        <div class="column is-6">
          <div class="columns">
            <div class="column">
              Move {{ turnIdx + 1 }} / {{ gameConfig.turns.length }}
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-6"
                 v-for="idx in cardListLength">
              <show-card :cardIdx="idx - 1"
                         :cardAt="cardAt"
                         :selected="cardIdx == idx - 1"
                         @select="selectCard"></show-card>
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
import Board from './gameroom/Board.vue'

export default {
  data () {
    return {
      loaded: false,
      gameConfig: null,
      playerIdx: 1,
      cardIdx: 0,
      turnIdx: 0,
      cardFlip: 0,
      cardRotate: 0,
      hover: [],
      map: {}
    }
  },
  components: {
    ShowCard,
    Board
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
            return;
          }

          this.setGameData();
          this.loaded = true;
        });
      }
    }
  },
  created () {
  },
  computed: {
    currentTurn () {
      return this.gameConfig.turns[this.turnIdx]
    },
    cardListLength () {
      return this.currentTurn.cardList.length
    },
    currentCard () {
      return this.cardAt(this.cardIdx, this.cardFlip, this.cardRotate)
    },
    allPlayersPlayed () {
      if (!this.currentTurn.playersPlayed) {
        return false;
      }

      if ([...Array(this.gameConfig.totalPlayers).keys()].some((idx) => {
        return this.currentTurn.playersPlayed[idx + 1] == null
      })) {
        return false;
      }

      return true;
    }
  },
  methods: {
    setGameData () {
      for (let i = 0; i <= 21; i++) {
        for (let j = 0; j <= 21; j++) {
          if (i >= 11 && j == 11 && i < 21) {
            this.$set(this.map, [i, j], 'h-wall')
          } else if (i == 11 && j < 11 && j > 1) {
            this.$set(this.map, [i, j], 'v-wall')
          }
        }
      }

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
    cardAt (idx, flip, rotate) {
      let cl = this.currentTurn.cardList[idx];
      let newMatrix = shapes.get(cl.shape);
      for (let i = 0; i < rotate; i++) {
        newMatrix = shapes.rotate(newMatrix)
      }

      if (flip > 0) {
        newMatrix = shapes.flip(newMatrix);
      }

      return {
        type: cl.type,
        shape: newMatrix
      }
    },
    selectCard (evt) {
      this.cardFlip = evt.cardFlip
      this.cardRotate = evt.cardRotate
      this.cardIdx = evt.idx
    },
    getLevel (i, j) {
      let level = (i % 2 == 0 &&
              i >= 12 && i <= 20 &&
              j % 2 == 0 &&
              j >= 2 && j <= 10) ? 1 : 0;

      return level;
    },
    getShapeCoords (i, j) {
      let coords = [];

      this.currentCard.shape.forEach((row, idx) => {
        row.forEach((cell, jdx) => {
          if (cell == 1) {
            coords.push([i + 2 * idx - 2, j + 2 * jdx - 2])
          }
        });
      });

      return coords;
    },
    clickable (i, j) {
      if (!this.gameConfig) {
        return false;
      }

      if (this.currentTurn.playersPlayed &&
          this.currentTurn.playersPlayed[this.playerIdx] != null) {
        return false;
      }

      if (i % 2 == 1 || j % 2 == 1) {
        return false;
      }

      let level = -1;
      let out = true;
      this.getShapeCoords(i, j).forEach((coord) => {
        if (level == -1) {
          level = this.getLevel(...coord)
        } else if (level != this.getLevel(...coord)) {
          out = false;
        }

        if (coord[0] > 20 || coord[1] > 20 ||
            coord[0] < 2 || coord[1] < 2) {
          out = false;
        }

        if (this.map[coord]) {
          out = false;
        }
      });

      return out;
    },
    getGameMap () {
      return JSON.stringify(this.map);
    },
    clickCoord (i, j) {
      if (this.clickable(i, j)) {
        this.getShapeCoords(i, j).forEach((coord) => {
          this.$set(this.map, coord, this.currentCard.type)
        });

        db.
          ref(`games/${this.gameId}/turns/${this.turnIdx}/playersPlayed/${this.playerIdx}`).
          set(this.getGameMap()).then(() => {
            if (this.allPlayersPlayed) {
              db.ref(`games/${this.gameId}/currentTurn`).set(this.turnIdx + 1)
              // this.nextTurn()
            }
        })
      }
    },
    nextTurn () {
      this.cardIdx = 0;
      this.cardFlip = 0;
      this.cardRotate = 0;
      this.turnIdx += 1;
    }
  }
}
</script>

<style lang="scss">
table.game td {
  border: 1px solid black;
  padding: 20px;
  position: relative;

  span {
    position: absolute;
    font-size: 8px;
    left: 2px;
    top: 2px;
  }

  &.h-wall-blank {
    padding: 4px 0px;
    border: 0px;
  }

  &.v-wall-blank {
    padding: 0px 4px;
    border: 0px;
  }

  &.v-wall, &.h-wall {
    background-color: #666;
  }

  &.hover {
    &:before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #000;
      opacity: 0.2;
    }
  }

  &.white {
    background-color: #eeeeee;
  }

  &.darkwhite {
    background-color: #d5d5d5;
  }

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
}
</style>
