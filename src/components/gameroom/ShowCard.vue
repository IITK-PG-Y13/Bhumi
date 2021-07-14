<template>
  <div :class="{card: true, 'has-border-success': selected}">
    <div class="card-content pointer"
         @click="selectCard">
      <table class="game selector">
        <tr v-for="row in currentCard.shape">
          <td v-for="cell in row"
              :class="(cell ? currentCard.type : null)">
          </td>
        </tr>
      </table>
    </div>
    <div class="card-footer">
      <a class="card-footer-item" @click="flipCard">
        Flip
      </a>
      <a class="card-footer-item" @click="rotateCard">
        Rotate
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['cardIdx', 'cardAt', 'selected'],
  data () {
    return {
      cardFlip: 0,
      cardRotate: 0
    }
  },
  computed: {
    currentCard () {
      return this.cardAt(this.cardIdx, this.cardFlip, this.cardRotate)
    }
  },
  methods: {
    selectCard () {
      this.$emit('select', {
        cardFlip: this.cardFlip,
        cardRotate: this.cardRotate,
        idx: this.cardIdx
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
    }
  }
}
</script>

<style lang="scss">
table.selector {
  margin-left: auto;
  margin-right: auto;
}

.pointer {
  cursor: pointer;
}

.has-border-success {
  border: 2px solid #48c78e;
  position: relative;

  &:before {
    content: "\2713";
    font-size: 2rem;
    color: #48c78e;
    position: absolute;
    left: 5px;
    top: 0;
  }
}
</style>
