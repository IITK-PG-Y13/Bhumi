<template>
  <div class="card">
    <div class="card-header">
      <div class="card-header-title">
        {{ recipe.name }} {{ recipeCount ? " x " + recipeCount : "" }}
      </div>
    </div>
    <div class="card-content">
      <table class="game selector">
        <tr v-for="row in recipe.shape">
          <td v-for="cell in row"
              :class="cell">
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['recipe', 'recipeCount']
}
</script>

<style lang="scss">
table.selector {
  margin-left: auto;
  margin-right: auto;
}
</style>
