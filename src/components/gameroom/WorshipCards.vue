<template>
  <div class="columns is-multiline">
    <div class="column is-4"
         v-for="idx in cardListLength">
      <div :class="{card: true, 'has-border-success': (cardIdx == idx), 'is-small': true}">
        <div class="card-header pointer" @click="selectCard(idx)">
          <div class="card-header-title is-centered">
            {{ recipe(idx).name }}
          </div>
        </div>
        <div class="card-content pointer px-0 pb-2 pt=0"
             @click="selectCard(idx)">
          <span class="is-size-7">
            Cost: {{ recipe(idx).cost }}
          </span>
          <table class="game selector is-small">
            <tr v-for="idxx in 3">
              <td v-for="jdxx in 3"
                  :class="getCellType(idx, idxx, jdxx)">
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="column is-12 is-small">
      <div class="tags is-centered pt-2">
        <span class="tag is-rounded is-info is-light">
          Worship Points: {{ vpCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import shapes from '../../data/shapes'
import powerObj from '../../data/powers'

export default {
  data () {
    return {
      selectedCard: null,
      cardIdx: -1
    }
  },
  props: [ 'currentTurn', 'recipes', 'turnIdx', 'vpCount' ],
  computed: {
    cardListLength () {
      return this.recipes.length
    },
    turnType () {
      return this.currentTurn.type
    },
  },
  watch: {
    turnIdx () {
      this.resetSelection()
    }
  },
  methods: {
    recipe (idx) {
      return this.recipes[idx - 1]
    },
    getCellType (idx, i, j) {
      if (i == 2 && j == 2) {
        return powerObj.godPowerClasses[this.recipe(idx).powerType]
      } else {
        return "white"
      }
    },
    selectCard (idx) {
      let recipe = this.recipe(idx)
      this.cardIdx = idx
      this.selectedCard = {
        cardIdx: idx,
        ...recipe,
        shape: [
          [ 0, 0, 0 ],
          [ 0, 1, 0 ],
          [ 0, 0, 0 ]
        ]
      }

      this.$emit('select', this.selectedCard)
    },
    resetSelection () {
      this.cardIdx = -1
      this.selectedCard = null
    },
  }
}
</script>
