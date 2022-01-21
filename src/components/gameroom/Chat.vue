<template>
  <div class="columns is-multiline" style="max-height: 80vh; overflow-y: scroll;">
    <div v-for="chat in allChatData"
         class="column py-1 is-12 has-text-left">
      <div :class="{box: true, 'has-background-info-light': isCurrentPlayer(chat)}">
        <strong>{{ playerNames[chat.playerIdx] }}: </strong>
        {{ chat.message }}
      </div>
    </div>
    <template v-if="activePlayer">
      <div class="column is-12">
        <div class="field">
          <div class="control">
            <textarea class="textarea" v-model="message"></textarea>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-success is-fullwidth" @click="submitMessage">Submit</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ensureArray } from '../../util/util'
export default {
  props: ['chatData', 'activePlayer', 'activePlayerIdx', 'playerNames'],
  data () {
    return {
      message: ""
    }
  },
  computed: {
    allChatData () {
      return ensureArray(this.chatData)
    }
  },
  methods: {
    isCurrentPlayer (chat) {
      return (chat.playerIdx == this.activePlayerIdx)
    },
    submitMessage () {
      this.$emit('send', {
        message: this.message
      })
      this.message = ""
    }
  }
}
</script>
