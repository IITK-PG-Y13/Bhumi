<template>
  <table class="game">
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
  props: ['map', 'currentCard'],
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
    getLevel (i, j) {
      let level = (i % 2 == 0 &&
              i >= 12 && i <= 20 &&
              j % 2 == 0 &&
              j >= 2 && j <= 10) ? 1 : 0;

      return level;
    },
    clickable (i, j) {
      if (!this.$parent.clickable(i, j)) {
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
    hoverable (i, j) {
      return this.clickable(i, j)
    },
    hoverCoord (i, j) {
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
    },
    clickCoord (i, j) {
      return this.$parent.clickCoord(this.getShapeCoords(i, j))
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
  }
}
</script>
