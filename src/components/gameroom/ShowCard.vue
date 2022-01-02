<template>
  <div :class="{card: true, 'has-border-success': selected, 'is-small': true}">
    <div class="card-header pointer" v-if="['WORSHIP', 'HARVEST'].includes(turnType)" @click="selectCard">
      <div class="card-header-title is-centered">
        {{ recipe.name }}
      </div>
    </div>
    <div :class="'card-content pointer px-0 pb-2' + (turnType == 'SEED' ? '' : ' pt-0')"
         @click="selectCard">
      <template v-if="turnType == 'HARVEST'">
        <span class="is-size-7">
          {{ recipe.vp }} WP
        </span>
      </template>
      <template v-if="turnType == 'WORSHIP'">
        <span class="is-size-7">
          Cost: {{ recipe.cost }}
        </span>
      </template>
      <table class="game selector is-small">
        <tr v-for="(row, idx) in currentCard.shape">
          <td v-for="(cell, jdx) in row"
              :class="getCellType(idx, jdx)">
          </td>
        </tr>
      </table>
    </div>
    <div class="card-footer">
      <a class="card-footer-item px-0 is-size-7 py-2" @click="flipCard">
        Flip
      </a>
      <a class="card-footer-item px-0 is-size-7 py-1" @click="rotateCard">
        Rotate
      </a>
    </div>
  </div>
</template>

<script>
import shapes from '../../data/shapes'
import powerObj from '../../data/powers'

export default {
  props: ['cardIdx', 'selected', 'recipe', 'header', 'turnType', 'description'],
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
      this.selectCard()
    },
    flipCard () {
      this.cardFlip = 1 - this.cardFlip;
      this.selectCard()
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
</style>
