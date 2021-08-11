<template>
  <div class="columns">
    <div class="column is-8 is-offset-2 box is-relative">
      <div class="page-bar">
        <div v-for="p in tutorialCards.length"
             :class="{page: true, selected: (itemId == p)}"
             @click="itemId = p">
          {{p}}
        </div>
      </div>
      <div class="columns is-vcentered"
           v-for="(card, idx) in tutorialCards"
           v-if="itemId == idx + 1">
        <div class="column is-3">
          <img :src="card.image" class="image is-128x128 mr-6">
        </div>
        <div class="column is-9 has-text-left content is-size-5 is-italic">
          {{ card.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

let TUTORIAL_CARDS = [
  {
    image: "static/home_image.png",
    text: "Bhumi is a game of resource allocation. You are a farmer, nurturing and nourishing your land."
  },
  {
    image: "static/home_image.png",
    text: "Either trade with your neighbours to mutually grow your farm, or ask the Gods to attack their crops!"
  },
  {
    image: "static/home_image.png",
    text: "At the end of the game, the best harvest wins!"
  },
]

export default {
  data () {
    return {
      tutorialCards: TUTORIAL_CARDS,
      itemId: 1
    }
  },
  mounted () {
  //setInterval(() => {
  //  this.itemId = (this.itemId + 1) % this.tutorialCards.length
  //  if (this.itemId == 0) {
  //    this.itemId = this.tutorialCards.length
  //  }
  //}, 20000)
  },
}
</script>
