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
  props: ['map'],
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
    hoverable (i, j) {
      return this.$parent.clickable(i, j)
    },
    hoverCoord (i, j) {
      if (this.hoverable(i, j)) {
        this.$parent.getShapeCoords(i, j).forEach((coord) => {
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
      return this.$parent.clickCoord(i, j)
    }
  }
}
</script>
