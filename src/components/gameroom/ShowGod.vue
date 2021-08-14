<template>
  <div class="card is-tiny">
    <div class="card-header">
      <div class="card-header-title has-background-success-light">
        {{ godPower.name }}
      </div>
    </div>
    <div class="card-content content has-text-left py-2 mb-0 px-0">
      <div class="is-size-7 is-italic has-text-centered pb-1">
        {{ godPower.description }}
      </div>
      <div class="is-size-7 notification is-default media mb-1 px-4 py-2">
        <div :class="{'is-inline-block': true,
                      'media-left': true,
                      'demo-card': true,
                      [godPowerClasses[godPower.powerType]]: true
                     }"></div>
        <div class="media-content">
          {{ godPowerDescriptions[godPower.powerType] }}
        </div>
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
import powerObj from '../../data/powers'
export default {
  props: ['godPower', 'recipes'],
  data () {
    return {
      godPowerClasses: powerObj.godPowerClasses,
      godPowerDescriptions: powerObj.godPowerDescriptions
    }
  },
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

<style lang="scss">
.demo-card {
  width: 1.2rem;
  height: 1.2rem;
}
</style>
