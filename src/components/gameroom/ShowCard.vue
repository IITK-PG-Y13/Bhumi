<template>
  <div :class="{card: true, 'has-border-success': selected, 'is-small': true}">
    <div class="card-header pointer" v-if="header" @click="selectCard">
      <div class="card-header-title is-centered">
        {{ header }}
      </div>
    </div>
    <div class="card-content pointer px-0"
         @click="selectCard">
      <table class="game selector is-small">
        <tr v-for="(row, idx) in currentCard.shape">
          <td v-for="(cell, jdx) in row"
              :class="getCellType(idx, jdx)">
          </td>
        </tr>
      </table>
    </div>
    <div class="card-footer">
      <a class="card-footer-item px-0" @click="flipCard">
        Flip
      </a>
      <a class="card-footer-item px-0" @click="rotateCard">
        Rotate
      </a>
    </div>
  </div>
</template>

<script>
import shapes from '../../data/shapes'
import powerObj from '../../data/powers'

export default {
  props: ['cardIdx', 'selected', 'recipe', 'header', 'turnType'],
  data () {
    return {
      cardFlip: 0,
      cardRotate: 0
    }
  },
  computed: {
    currentCard () {
      return this.cardAt(this.cardFlip, this.cardRotate)
    }
  },
  methods: {
    cardAt (flip, rotate) {
      let cl = this.recipe
      let type = cl.type
      let newMatrix = shapes.get(cl.shape)

      if (flip > 0) {
        newMatrix = shapes.flip(newMatrix)
        if (Array.isArray(type)) {
          type = shapes.flip(type)
        }
      }

      for (let i = 0; i < rotate; i++) {
        newMatrix = shapes.rotate(newMatrix)
        if (Array.isArray(type)) {
          type = shapes.rotate(type)
        }
      }

      return {
        ...cl,
        type: type,
        shape: newMatrix,
      }
    },
    selectCard () {
      this.$emit('select', {
        idx: this.cardIdx,
        card: this.cardAt(this.cardFlip, this.cardRotate)
      })
    },
    rotateCard () {
      this.cardRotate = (this.cardRotate + 1) % 4
      if (this.selected) {
        this.selectCard()
      }
    },
    flipCard () {
      this.cardFlip = 1 - this.cardFlip;
      if (this.selected) {
        this.selectCard()
      }
    },
    getCellType (i, j) {
      if (this.currentCard.shape[i][j] == 0) {
        return "white"
      }

      if (typeof this.currentCard.type == "string") {
        return this.currentCard.type
      } else if (Array.isArray(this.currentCard.type)) {
        return this.currentCard.type[i][j]
      } else if (this.turnType == 'WORSHIP') {
        return powerObj.godPowerClasses[this.recipe.powerType]
      }
    }
  }
}
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}

.has-border-success {
  border: 2px solid #48c78e;
  position: relative;
}
</style>
