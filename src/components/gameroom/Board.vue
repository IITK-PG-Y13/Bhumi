<template>
  <table :class="'game selector main ' + (size || '')">
    <tr v-for="idx in 10">
      <td v-for="jdx in 10"
          :ref="'coord-' + idx + ',' + jdx"
          :class="getClass(idx, jdx)"
          @mouseover="hoverCoord(idx, jdx)"
          @mouseout="unHover"
          @click="clickCoord(idx, jdx)">
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['map', 'hoverData', 'size'],
  data () {
    return {
      hoverClass: {}
    }
  },
  computed: {
    hoverShape () {
      if (this.hoverData == null) {
        return null
      }
      return this.hoverData.shape
    }
  },
  methods: {
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
      if (this.map[[i, j]] != null) {
        return this.map[[i, j]]
      }

      return 'white'
    },
    clickable (i, j) {
      if (!this.hoverData) {
        return false;
      }

      if (this.getShapeCoords(i, j).length == 0) {
        return false
      }

      let out = true;
      this.getShapeCoords(i, j).forEach(({ coord, type }) => {
        if (coord[0] > 10 || coord[1] > 10 ||
            coord[0] < 1 || coord[1] < 1) {
          out = false
        }

        if (!this.$parent.clickable(coord[0], coord[1], type)) {
          out = false
        }
      });

      return out;
    },
    getHoverType (i, j) {
      if (typeof this.hoverData.type == "string") {
        return this.hoverData.type
      } else {
        return this.hoverData.type[i][j]
      }
    },
    hoverCoord (i, j) {
      if (this.clickable(i, j)) {
        this.getShapeCoords(i, j).forEach(({ coord }) => {
          let el = this.getElem(...coord);
          if (el) {
            el.classList.add('hover')
            el.classList.remove('red')
          }
        });
      } else {
        this.getShapeCoords(i, j).forEach(({ coord }) => {
          let el = this.getElem(...coord);
          if (el) {
            el.classList.add('hover')
            el.classList.add('red')
          }
        });
      }
    },
    unHover () {
      document.querySelectorAll('table.game td.hover').forEach((elem) => {
        elem.classList.remove('hover');
      });
    },
    clickCoord (i, j) {
      if (this.clickable(i, j)) {
        this.$emit('click', this.getShapeCoords(i, j))
      }
    },
    getShapeCoords (i, j) {
      let coords = [];

      if (!this.hoverShape) {
        return []
      }

      this.hoverShape.forEach((row, idx) => {
        row.forEach((cell, jdx) => {
          if (cell == 1) {
            coords.push({
              coord: [i + idx - 1, j + jdx - 1],
              type: this.getHoverType(idx, jdx)
            })
          }
        });
      });

      return coords;
    },
  }
}
</script>

<style lang="scss">
table.selector {
  margin-left: auto;
  margin-right: auto;
}

table.main {
  border-collapse: separate;
  border-spacing: 4px;

  td.white {
    background-color: rgba(0,0,0,0.1);
    background-image: url(../../assets/tiles/white.png);
    background-size: 100% 100%;
  }
}

table.game td {
  border: 1px solid white;
  padding: 20px;
  position: relative;

  span {
    position: absolute;
    font-size: 8px;
    left: 2px;
    top: 2px;
  }

  &.hover {
    cursor: pointer;

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

    &.red {
      border: 1px solid red;
      cursor: not-allowed;

      &:before {
        background-color: #600;
      }
    }
  }

  &.white {
    background-color: #eee;
  }
}

table.game.is-small {
  border-spacing: 4px;

  td {
    padding: 15px;
  }
}

table.game.is-tiny {
  border-spacing: 2px;
  border: 0px;

  td {
    padding: 8px;
  }
}

table.game.is-micro {
  border-spacing: 0px;
  border-collapse: collapse;
  border: 0px;

  td {
    padding: 4px;
  }
}
</style>
