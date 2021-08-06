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
import 'animate.css'

export default {
  props: ['map', 'hoverData', 'size'],
  data () {
    return {
      changedKeys: {},
      hoverClass: {}
    }
  },
  watch: {
    mapCopy: {
      deep: true,
      handler (newMap, oldMap) {
        let changedKeys = {}
        Object.entries(newMap).forEach(([key, value]) => {
          if (oldMap[key] && !newMap[key]) {
            changedKeys[key] = 'base'
          } else if (!oldMap[key] || oldMap[key] != newMap[key]) {
            changedKeys[key] = value
          }
        })

        this.changedKeys = changedKeys
      }
    }
  },
  computed: {
    mapCopy () {
      return JSON.parse(JSON.stringify(this.map))
    },
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
      let animateClass = ""

      if (this.changedKeys[i + "," + j]) {
        if (this.changedKeys[i + "," + j] == 'used') {
          animateClass = " animate__animated animate__fadeIn"
        } else if (this.changedKeys[i + "," + j] == 'base') {
          animateClass = " animate__animated animate__flipInX"
        } else {
          animateClass = " animate__animated animate__bounceIn"
        }
      }

      if (this.map[[i, j]] != null) {
        return this.map[[i, j]] + animateClass
      }

      return 'base' + animateClass
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
      if (this.hoverData.type == null) {
        return null
      } else if (typeof this.hoverData.type == "string") {
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
table.game td.hover {
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

</style>
