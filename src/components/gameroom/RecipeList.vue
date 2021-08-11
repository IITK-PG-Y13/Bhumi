<template>
  <div :class="'tags is-centered pt-2 ' + (size ? size : '')">
    <span class="tag is-rounded is-info is-light"
          v-for="recipe in recipes">
      {{ recipe.name }} {{ recipeCount[recipe.idx] ? " x " + recipeCount[recipe.idx] : " x 0" }}
    </span>
  </div>
</template>

<script>
export default {
  props: ['recipes', 'recipeCount', 'size']
}
</script>

<style lang="scss">
.tags.are-small .tag {
  font-size: 0.6rem;
}
</style>
