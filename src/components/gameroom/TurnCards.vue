<template>
  <div class="columns is-multiline">
    <div class="column is-4"
         v-for="idx in cardListLength">
      <show-card :cardIdx="idx - 1"
                 :turnType="currentTurn.type"
                 :recipe="recipes[idx - 1]"
                 :selected="cardIdx == idx - 1"
                 :header="headerKey ? recipes[idx - 1][headerKey] : null"
                 @select="selectCard"></show-card>
    </div>
  </div>
</template>

<script>
import ShowCard from './ShowCard.vue'

export default {
  data () {
    return {
      selectedCard: null,
      cardIdx: -1
    }
  },
  components: {
    ShowCard,
  },
  props: [ 'currentTurn', 'recipes', 'turnIdx', 'headerKey' ],
  computed: {
    cardListLength () {
      return this.recipes.length
    },
  },
  watch: {
    turnIdx () {
      this.resetSelection()
    }
  },
  methods: {
    selectCard (evt) {
      this.selectedCard = evt.card
      this.cardIdx = evt.idx

      this.$emit('select', this.selectedCard)
    },
    resetSelection () {
      this.cardIdx = -1
      this.selectedCard = null
    },
  }
}
</script>
