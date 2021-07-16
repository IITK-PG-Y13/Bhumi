<template>
  <table class="game selector">
    <tr v-for="idx in 21">
      <td v-for="jdx in 21"
          :ref="'coord-' + idx + ',' + jdx"
          :class="getClass(idx, jdx)"
          @mouseover="hoverCoord(idx, jdx)"
          @mouseout="unHover"
          @click="clickCoord(idx, jdx)">

          <span v-if="idx % 2 == 0 && jdx % 2 == 0">
            {{idx}}, {{jdx}}
          </span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['map', 'hoverData'],
  data () {
    return {
      hoverClass: {}
    }
  },
  computed: {
    hoverShape () {
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
      if (i % 2 == 1) {
        return 'h-wall-blank'
      }

      if (j % 2 == 1) {
        return 'v-wall-blank'
      }

      if (this.map[[i, j]] != null) {
        return this.map[[i, j]]
      }

      return 'white'
    },
    clickable (i, j) {
      if (i % 2 == 1 || j % 2 == 1) {
        return false;
      }

      if (this.getShapeCoords(i, j).length == 0) {
        return false
      }

      let out = true;
      this.getShapeCoords(i, j).forEach(({ coord }) => {
        if (coord[0] > 20 || coord[1] > 20 ||
            coord[0] < 2 || coord[1] < 2) {
          out = false
        }

        if (!this.$parent.clickable(coord[0], coord[1])) {
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
              coord: [i + 2 * idx - 2, j + 2 * jdx - 2],
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
}
</style>
