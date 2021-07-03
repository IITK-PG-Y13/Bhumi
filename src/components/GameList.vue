<template>
<section class="hero">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-6 box"
             v-for="key in activeGames">
          <router-link :to="'/' + key[0]">
            {{ key[0] }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import db from '../firebase/init'

export default {
  data () {
    return {
      gameList: null
    }
  },
  firebase: {
    gameList: db.ref('/')
  },
  computed: {
    activeGames () {
      if (!this.gameList) {
        return null
      }

      return Object.entries(this.gameList).filter((key) => {
        return key[1].active
      });
    }
  },
  methods: {
  }
}
</script>
