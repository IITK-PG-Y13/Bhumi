<template>
  <div class="columns is-multiline">
    <div class="column is-6"
         v-for="idx in cardListLength">
      <show-card :cardIdx="idx - 1"
                 :cardAt="cardAt"
                 :selected="cardIdx == idx - 1"
                 @select="selectCard"></show-card>
    </div>
  </div>
</template>

<script>
import shapes from '../../data/shapes'
import ShowCard from './ShowCard.vue'

export default {
  data () {
    return {
      cardIdx: 0,
      cardFlip: 0,
      cardRotate: 0,
    }
  },
  components: {
    ShowCard,
  },
  props: [ 'currentTurn', 'recipes' ],
  computed: {
    cardListLength () {
      return this.recipes.length
    },
  },
  mounted () {
    this.updateSelection()
  },
  updated () {
    if (this.cardIdx >= this.cardListLength) {
      this.cardIdx = 0
    }
    this.updateSelection()
  },
  methods: {
    cardAt (idx, flip, rotate) {
      let cl = this.recipes[idx]
      let type = cl.type
      let newMatrix = shapes.get(cl.shape)

      for (let i = 0; i < rotate; i++) {
        newMatrix = shapes.rotate(newMatrix)
        if (typeof type != "string") {
          type = shapes.rotate(type)
        }
      }

      if (flip > 0) {
        newMatrix = shapes.flip(newMatrix)
        if (typeof type != "string") {
          type = shapes.flip(type)
        }
      }

      return {
        type: type,
        shape: newMatrix
      }
    },
    selectCard (evt) {
      this.cardFlip = evt.cardFlip
      this.cardRotate = evt.cardRotate
      this.cardIdx = evt.idx

      this.updateSelection()
    },
    updateSelection () {
      if (this.cardIdx >= this.cardListLength) {
        this.cardIdx = 0
      }

      this.$emit('select', this.cardAt(this.cardIdx, this.cardFlip, this.cardRotate))
    },
  }
}
</script>
