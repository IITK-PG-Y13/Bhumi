<template>
  <section class="hero">
  <div class="hero-body">
    <div class="container">
      <div class="columns">
        <div class="column is-6">
          <table class="game">
            <tr v-for="idx in 21">
              <td v-for="jdx in 21"
                  :ref="'coord-' + idx + ',' + jdx"
                  :class="getClass(idx, jdx)"
                  @mouseover="hoverCoord(idx, jdx, $event)"
                  @mouseout="unHover"
                  @click="clickCoord(idx, jdx)">

                  <span v-if="idx % 2 == 0 && jdx % 2 == 0">
                    {{idx}}, {{jdx}}
                  </span>
              </td>
            </tr>
          </table>
        </div>
        <div class="column is-6">
          <div class="card" v-if="currentCard">
            <div class="card-content">
              <div class="tile is-ancestor">
                <div class="tile is-parent is-child has-background-info">
                  <table class="game">
                    <tr v-for="row in currentCard.shape">
                      <td v-for="cell in row"
                          :class="(cell ? currentCard.type : null)">
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="tile is-parent is-vertical">
                  <div class="tile is-child has-background-warning">
                    <button @click="cardFlip = 1 - cardFlip"
                            class="button is-fullwidth">
                      Flip
                    </button>
                  </div>
                  <div class="tile is-child has-background-success">
                    <button @click="cardRotate = (cardRotate + 1) % 4"
                            class="button is-fullwidth">
                      Rotate
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <a class="card-footer-item" @click="cardIdx = (cardListLength + cardIdx - 1) % cardListLength">
                Prev
              </a>
              <a class="card-footer-item" @click="cardIdx = (cardIdx + 1) % cardListLength">
                Next
              </a>
            </div>
          </div>
          <div class="level" v-if="currentTurn">
            <div class="level-item"
                 v-for="player in currentTurn.playersPlayed">
              <div class="box">
                {{player}}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import shapes from '../data/shapes'
import db from '../firebase/init'

export default {
  name: 'HelloWorld',
  data () {
    return {
      gameId: "ABC",
      gameConfig: null,
      playerId: 0,
      cardIdx: 0,
      turnIdx: 0,
      cardFlip: 0,
      cardRotate: 0,
      hover: [],
      map: {}
    }
  },
  watch: {
    gameId: {
      immediate: true,
      handler () {
        this.$rtdbBind('gameConfig', db.ref(this.gameId + '/gameConfig'))
      }
    }
  },
  created () {
    for (let i = 0; i <= 21; i++) {
      for (let j = 0; j <= 21; j++) {
        if (i >= 11 && j == 11 && i < 21) {
          this.$set(this.map, [i, j], 'h-wall')
        } else if (i == 11 && j < 11 && j > 1) {
          this.$set(this.map, [i, j], 'v-wall')
        }
      }
    }
  },
  computed: {
    cardListLength () {
      if (!this.gameConfig) {
        return null
      }

      return this.gameConfig[this.turnIdx].cardList.length
    },
    currentTurn () {
      if (!this.gameConfig) {
        return null
      }

      return this.gameConfig[this.turnIdx]
    },
    currentCard () {
      if (!this.gameConfig) {
        return null
      }

      let cl = this.gameConfig[this.turnIdx].cardList[this.cardIdx];
      let newMatrix = shapes.get(cl.shape);
      for (let i = 0; i < this.cardRotate; i++) {
        newMatrix = shapes.rotate(newMatrix)
      }

      if (this.cardFlip > 0) {
        newMatrix = shapes.flip(newMatrix);
      }

      return {
        type: cl.type,
        shape: newMatrix
      }
    }
  },
  methods: {
    getLevel (i, j) {
      let level = (i % 2 == 0 &&
              i >= 12 && i <= 20 &&
              j % 2 == 0 &&
              j >= 2 && j <= 10) ? 1 : 0;

      return level;
    },
    getElemId (i, j) {
      return 'coord-' + i + ',' + j;
    },
    getElem (i, j) {
      let el = this.$refs[this.getElemId(i, j)]
      if (el == null) {
        return false;
      } else {
        return el[0]
      }
    },
    getClass (i, j) {
      let classes = []

      if (i % 2 == 1) {
        classes.push('h-wall-blank')
      }
      if (j % 2 == 1) {
        classes.push('v-wall-blank')
      }

      if (this.map[[i, j]] != null) {
        classes.push(this.map[[i, j]])
      }

      if (classes.length > 0) {
        return classes
      } else {
        if (i > 11 && j <= 11) {
          return 'darkwhite'
        }
        return 'white'
      }
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
    clickCoord (i, j) {
      if (this.clickable(i, j)) {
        this.getShapeCoords(i, j).forEach((coord) => {
          this.$set(this.map, coord, this.currentCard.type)
        });

        db.
          ref(`${this.gameId}/gameConfig/${this.turnIdx}/playersPlayed/${this.playerId}`).
          set(this.getElemId(i, j))
      }
    },
    hoverable (i, j) {
      return this.clickable (i, j)
    },
    hoverCoord (i, j, e) {
      if (this.hoverable(i, j)) {
        this.getShapeCoords(i, j).forEach((coord) => {
          let el = this.getElem(...coord);
          if (el) {
            el.classList.add('hover');
          }
        });
      }
    },
    unHover () {
      document.querySelectorAll('table.game td.hover').forEach((elem) => {
        elem.classList.remove('hover');
      });
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
