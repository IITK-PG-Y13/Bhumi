<template>
  <div class="card is-tiny">
    <div class="card-header">
      <div class="card-header-title has-background-success-light">
        Lv {{ godPower.idx + 1 }}: {{ godPower.name }}
      </div>
    </div>
    <div class="card-content content has-text-left py-2 mb-0 px-0">
      <div class="is-size-7 is-italic has-text-centered pb-1">
        {{ godPower.description }}
      </div>
      <div class="is-size-7 notification is-default media mb-1 px-4 py-2">
        <template v-if="godPower.powerType == 'REJUVENATE'">
          <div class="is-inline-block media-left"
               style="width: 20px; height: 20px; background: linear-gradient(135deg, #2a8ee0 75%, #87bcea)"></div>
          <div class="media-content">
            Restores previously harvested land
          </div>
        </template>
      </div>
      <div class="is-size-7 px-4">
        Requirements
        <ul class="mt-0">
          <li v-for="(cost, idx) in godPower.cost" v-if="cost > 0">
            {{ recipes[idx].name }} x {{ cost }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['godPower', 'recipes'],
  methods: {
    getCellType (i, j) {
      if (this.recipe.shape[i][j] == 0) {
        return "white"
      }

      if (typeof this.recipe.type == "string") {
        return this.recipe.type
      } else {
        return this.recipe.type[i][j]
      }
    }
  }
}
</script>
