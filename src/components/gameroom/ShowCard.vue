<template>
  <div :class="{card: true, 'has-border-success': selected, 'is-small': true}">
    <div class="card-header pointer" v-if="header" @click="selectCard">
      <div class="card-header-title is-centered">
        {{ header }}
      </div>
    </div>
    <div class="card-content pointer"
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
import shapes from '../../data/shapes'

export default {
  props: ['cardIdx', 'selected', 'recipe', 'header'],
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

      for (let i = 0; i < rotate; i++) {
        newMatrix = shapes.rotate(newMatrix)
        if (Array.isArray(type)) {
          type = shapes.rotate(type)
        }
      }

      if (flip > 0) {
        newMatrix = shapes.flip(newMatrix)
        if (Array.isArray(type)) {
          type = shapes.flip(type)
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
      } else {
        return this.currentCard.type[i][j]
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

  /*
  &:before {
    content: "\2713";
    font-size: 2rem;
    color: #48c78e;
    position: absolute;
    left: 5px;
    top: 0;
  }
  */
}

table.game td {
  &.white {
    background-color: #eee;
  }

  &.shiny-gold {
    background-color: #d4af37;
    background: linear-gradient(45deg, #d4af37, gold);
  }

  &.shiny-blue {
    background: linear-gradient(135deg, #2a8ee0 75%, #87bcea);
  }
}

</style>
