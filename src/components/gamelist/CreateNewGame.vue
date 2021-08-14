<template>
  <div class="columns is-multiline">
    <div class="column is-6">
      <div class="field is-horizontal has-text-left">
        <div class="field-label" style="flex-basis: auto; text-align: left">
          <label class="label">Number of Turns</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <label class="radio">
                <input type="radio" v-model="newGameConfig.turns" value="6">
                6
              </label>
              <label class="radio">
                <input type="radio" v-model="newGameConfig.turns" value="12">
                12
              </label>
              <label class="radio">
                <input type="radio" v-model="newGameConfig.turns" value="18">
                18
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-6">
      <div class="field is-horizontal has-text-left">
        <div class="field-label" style="flex-basis: auto; text-align: left">
          <label class="label">Curated Experience?</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <label class="radio">
                <input type="radio" v-model="newGameConfig.curated" :value="true">
                Yes
              </label>
              <label class="radio">
                <input type="radio" v-model="newGameConfig.curated" :value="false">
                No
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-6" v-if="!newGameConfig.curated">
      <div class="field is-horizontal has-text-left">
        <div class="field-label" style="flex-basis: auto; text-align: left">
          <label class="label">Allow destructive God Powers</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <label class="radio">
                <input type="radio" v-model="newGameConfig.noDestructivePowers" :value="false">
                Yes
              </label>
              <label class="radio">
                <input type="radio" v-model="newGameConfig.noDestructivePowers" :value="true">
                No
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-6">
      <div class="field is-horizontal has-text-left">
        <div class="field-label" style="flex-basis: auto; text-align: left">
          <label class="label">Maximum number of Players</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <label class="radio">
                <input type="radio" v-model="newGameConfig.maxPlayers" value="2">
                2
              </label>
              <label class="radio">
                <input type="radio" v-model="newGameConfig.maxPlayers" value="3">
                3
              </label>
              <label class="radio">
                <input type="radio" v-model="newGameConfig.maxPlayers" value="4">
                4
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-12">
      <button class="button is-success" @click="createNewGame">
        Create New
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newGameConfig: {
        turns: 18,
        noDestructivePowers: false,
        maxPlayers: 4,
        curated: true
      }
    }
  },
  methods: {
    createNewGame () {
      this.$emit('submit', this.newGameConfig)
    }
  }
}
</script>
