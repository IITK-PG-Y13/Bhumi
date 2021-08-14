<template>
  <div :class="'tags is-centered pt-2 ' + (size ? size : '')">
    <span class="tag is-rounded is-info is-light" ref="vpTag">
      Worship Points: {{ vpCount }}
    </span>
  </div>
</template>

<script>
export default {
  props: ['vpCount', 'size'],
  watch: {
    vpCount: {
      handler (newV, oldV) {
        if (newV != oldV) {
          this.$refs.vpTag.classList.add('animate__animated', 'animate__pulse')
          window.setTimeout(() => {
            this.$refs.vpTag.classList.remove('animate__animated', 'animate__pulse', 'animate__fast')
          }, 1000)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.tags.are-small .tag {
  font-size: 0.6rem;
}
</style>
