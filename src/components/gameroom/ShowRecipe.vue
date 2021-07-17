<template>
  <div class="card is-tiny">
    <div class="card-header">
      <div class="card-header-title">
        {{ recipe.name }} {{ recipeCount ? " x " + recipeCount : " x 0" }}
      </div>
    </div>
    <div class="card-content">
      <table class="game selector is-tiny">
        <tr v-for="(row, idx) in recipe.shape">
          <td v-for="(cell, jdx) in row"
              :class="getCellType(idx, jdx)">
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['recipe', 'recipeCount'],
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
.card.is-small {
  .card-header > .card-header-title {
    padding: 0.35rem 1rem;
    font-size: 1rem;
  }

  .card-content {
    padding: 1.1rem;
  }
}

.card.is-tiny {
  .card-header > .card-header-title {
    padding: 0.25rem 1rem;
    font-size: 0.9rem;
  }

  .card-content {
    padding: 1rem;
  }
}
</style>
