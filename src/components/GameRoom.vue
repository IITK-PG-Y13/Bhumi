<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns">
        <div class="column is-2" style="max-height: 80vh; overflow-y: scroll;">
          <h3 class="title is-4">Reference</h3>
          <div class="columns is-multiline">
            <div class="column is-12" v-for="recipe in gameConfig.recipes">
              <show-recipe :recipe="recipe"></show-recipe>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-12" v-for="power in gameConfig.godPowers">
              <show-god :god-power="power" :recipes="gameConfig.recipes"></show-god>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="columns is-multiline">
            <div class="column is-12" v-if="gameConfig.totalPlayers > 1">
              <div class="tabs is-centered is-fullwidth is-toggle is-primary">
                <ul>
                  <li :class="{'is-active': actionView == 'SELF'}" v-if="activePlayer">
                    <a @click="actionView = 'SELF'">You</a>
                  </li>
                  <li v-for="idx in gameConfig.totalPlayers"
                      :class="{'is-active': (actionView == 'OPP' && actionViewIdx == idx)}"
                      v-if="idx != playerIdx">
                    <a @click="actionView = 'OPP'; actionViewIdx = idx">{{ playerNames[idx] }}</a>
                  </li>
                  <li :class="{'is-active': actionView == 'CHAT'}" ref="chatTab">
                    <a @click="actionView = 'CHAT'">Chat</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="column is-12 py-0">
              <template v-if="actionView == 'SELF'">
                <board :map="map"
                       :hoverData="(needToPlay ? selectedCardInfo : null)"
                       @click="clickCoord"></board>
                <recipe-list :vpCount="vpCount()" size="are-medium has-text-weight-bold"></recipe-list>
                <hr style="margin: 0.5rem 0;"/>
                <div class="columns is-multiline">
                  <div class="column is-4"
                       v-for="idx in gameConfig.totalPlayers"
                       v-if="idx != playerIdx">
                    <div class="box p-1 pointer" @click="actionView = 'OPP'; actionViewIdx = idx">
                      <span class="has-text-weight-bold">
                        {{ playerNames[idx] }}
                      </span>
                      <board :map="lastMapState(idx)" size="is-micro"></board>
                      <recipe-list :vpCount="vpCount(idx)"
                                   size="are-small"></recipe-list>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="actionView == 'OPP'">
                <board :map="lastMapState(actionViewIdx)"
                       :hoverData="(needToPlay ? selectedCardInfo : null)"
                       @click="clickCoord"></board>
                <recipe-list :vpCount="vpCount(actionViewIdx)"></recipe-list>
              </template>
              <template v-if="actionView == 'CHAT'">
                <chat :chatData="gameConfig.chatData"
                      :activePlayer="activePlayer"
                      :playerNames="playerNames"
                      :activePlayerIdx="playerIdx"
                      @send="sendMessage"></chat>
              </template>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="columns is-multiline">
            <div class="column is-12 is-paddingless is-italic is-size-7">
              Move {{ Math.floor(turnIdx / 3) + 1 }}.{{ (turnIdx % 3) + 1 }} / {{ gameConfig.turns.length / 3 }}
            </div>
            <div class="column is-12" v-if="currentTurn.type == 'SEED'">
              <h3 class="title is-4">Seed Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="turnIdx"
                          :recipes="currentTurn.cardList"
                          @select="selectCard"></turn-cards>
            </div>
            <div class="column is-12" v-else-if="currentTurn.type == 'HARVEST'">
              <h3 class="title is-4">Harvest Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="turnIdx"
                          :recipes="gameConfig.recipes"
                          @select="selectCard"></turn-cards>
            </div>
            <div class="column is-12" v-else-if="currentTurn.type == 'WORSHIP'">
              <h3 class="title is-4">Worship Phase</h3>
              <worship-cards :currentTurn="currentTurn"
                          :turnIdx="turnIdx"
                          :vpCount="vpCount()"
                          :recipes="gameConfig.godPowers"
                          @select="selectCard"></worship-cards>
            </div>
          </div>
          <div class="tile is-ancestor is-parent player-status-list">
            <div class="tile is-child player-status"
                 v-for="idx in gameConfig.totalPlayers">
              <div class="notification is-success is-light m-1"
                   v-if="currentTurn.playersPlayed && currentTurn.playersPlayed[idx]">
                {{ playerNames[idx] }}
              </div>
              <div class="notification is-default m-1" v-else>
                {{ playerNames[idx] }}
              </div>
            </div>
          </div>
          <div class="box">
            <span v-if="!activePlayer">
              Spectating...
            </span>
            <button class="button is-fullwidth is-success"
                    @click="nextTurn"
                    v-else-if="allPlayersPlayed">
              Go to Next Turn
            </button>
            <span v-else-if="!needToPlay">
              Waiting for others...
            </span>
            <span v-else>
              It's your turn
              <br/><br/>
              <button :class="{
                                button: true,
                                'is-fullwidth': true,
                                'is-line': !turnStarted,
                                'is-success': turnStarted
                              }"
                      @click="passTurn">
                <template v-if="turnStarted">
                  Done
                </template>
                <template v-else>
                  Pass
                </template>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-else>
      Loading...
    </div>
  </div>
</section>
</template>

<script>
import 'animate.css'

import shapes from '../data/shapes'
import { db, dbRefs } from '../firebase/init'
import { ensureArray } from '../util/util'
import ShowCard from './gameroom/ShowCard.vue'
import ShowRecipe from './gameroom/ShowRecipe.vue'
import RecipeList from './gameroom/RecipeList.vue'
import ShowGod from './gameroom/ShowGod.vue'
import Board from './gameroom/Board.vue'
import Chat from './gameroom/Chat.vue'
import TurnCards from './gameroom/TurnCards.vue'
import WorshipCards from './gameroom/WorshipCards.vue'
import { getCurrentPlayer } from '../util/login'

export default {
  data () {
    return {
      actionView: 'SELF',
      actionViewIdx: 0,
      loaded: false,
      gameConfig: null,
      playerIdx: null,
      playerNames: {},
      turnIdx: 0,
      cardIdx: 0,
      selectedCardInfo: {},
      turnStarted: false,
      map: {},
      seenChatLength: 0
    }
  },
  components: {
    ShowCard,
    Board,
    ShowRecipe,
    RecipeList,
    TurnCards,
    WorshipCards,
    ShowGod,
    Chat
  },
  props: [ 'gameId' ],
  watch: {
    gameId: {
      immediate: true,
      handler () {
        this.$rtdbBind('gameConfig', db.ref(dbRefs.gameConfig(this.gameId))).then(() => {
          // Loaded
          if (getCurrentPlayer() == null ||
              this.gameConfig.players == null ||
              !this.gameConfig.started) {

            if (!this.gameConfig.active) {
              this.$router.push({
                name: 'GameEnd',
                params: {
                  gameId: this.gameId
                }
              })
              return
            }

            this.$router.push({
              path: '/',
              query: {
                src: this.gameId
              }
            })
            return
          }

          if (!this.activePlayer) {
            this.actionView = 'OPP'
            this.actionViewIdx = 1
          }

          this.setGameData()
          this.loaded = true
        })
      }
    },
    'gameConfig.currentTurn': {
      handler () {
        this.nextTurn()
      }
    },
    'gameConfig.playerState': {
      deep: true,
      handler () {
        this.map = this.lastMapState(this.playerIdx)
      }
    },
    'gameConfig.chatData': {
      deep: true,
      handler (newChatData, oldChatData) {
        if (ensureArray(newChatData).length == this.seenChatLength) {
          return
        }

        this.seenChatLength = ensureArray(newChatData).length

        if (this.$refs['chatTab']) {
          this.$refs['chatTab'].classList.add('animate__animated', 'animate__bounce', 'has-background-warning-light')
        }
      }
    }
  },
  computed: {
    activePlayer () {
      return this.gameConfig.players.includes(getCurrentPlayer())
    },
    currentTurn () {
      return this.gameConfig.turns[this.turnIdx]
    },
    currentCard () {
      if (this.currentTurn.type == 'SEED') {
        return this.currentTurn.cardList[this.cardIdx]
      } else if (this.currentTurn.type == 'HARVEST') {
        return this.gameConfig.recipes[this.cardIdx]
      }
    },
    needToPlay () {
      if (this.currentTurn.playersPlayed && this.currentTurn.playersPlayed[this.playerIdx]) {
        return false
      } else {
        if (this.currentTurn.moveType && this.currentTurn.moveType == 'SEQUENTIAL') {

          let movePlayerIdx = -1
          let allTypeTurns = this.gameConfig.turns.map((turn, idx) => { return {...turn, idx} }).filter((turn) => {
            return (turn.type == this.currentTurn.type)
          }).map((turn) => { movePlayerIdx += 1; return {...turn, movePlayerIdx} })

          let currentTurnConfig = allTypeTurns.find((turn) => turn.idx == this.gameConfig.currentTurn)

          let startingPlayerIdx = currentTurnConfig.movePlayerIdx
          startingPlayerIdx = (startingPlayerIdx % this.gameConfig.totalPlayers) + 1

          if (!this.currentTurn.playersPlayed) {
            return (this.playerIdx == startingPlayerIdx)
          }

          let nextPlayer = startingPlayerIdx + ensureArray(this.currentTurn.playersPlayed).filter((e) => e).length
          if (nextPlayer > this.gameConfig.totalPlayers) {
            nextPlayer -= this.gameConfig.totalPlayers
          }

          return (this.playerIdx == nextPlayer)
        } else {
          return true
        }
      }
    },
    allPlayersPlayed () {
      if (!this.currentTurn.playersPlayed) {
        return false
      }

      if ([...Array(this.gameConfig.totalPlayers).keys()].some((idx) => {
        return !this.currentTurn.playersPlayed[idx + 1]
      })) {
        return false
      }

      return true
    }
  },
  methods: {
    lastMapState (idx) {
      if (this.gameConfig &&
          this.gameConfig.playerState &&
          this.gameConfig.playerState[idx]) {
        return JSON.parse(this.gameConfig.playerState[idx])
      }

      return {}
    },
    setGameData () {
      this.playerIdx = this.gameConfig.players.indexOf(getCurrentPlayer())

      this.playerNames = {}
      this.gameConfig.players.forEach((player, idx) => {
        if (idx == 0)
          return;
        db.ref(dbRefs.playerName(player)).once('value').then((snapshot) => {
          if (snapshot.val() && snapshot.val() != null && snapshot.val() != "") {
            this.playerNames[idx] = snapshot.val()
          } else {
            this.playerNames[idx] = "Player " + idx
          }
        })
      })
      this.playerNames[this.playerIdx] = "You"

      this.map = this.lastMapState(this.playerIdx)
      this.nextTurn()
    },
    selectCard (evt) {
      this.selectedCardInfo = evt
    },
    sendMessage (evt) {
      let chatData = ensureArray(this.gameConfig.chatData)

      chatData.push({
        playerIdx: this.playerIdx,
        message: evt.message
      })

      db.
        ref(dbRefs.chatData(this.gameId)).
        set(chatData)
    },
    clickable (i, j, type) {
      // Base Checks
      if (!this.gameConfig) {
        return false
      }

      if (!this.needToPlay) {
        return false
      }

      // Check if user is playing on the right board
      if (this.actionView != 'SELF' && ['SEED', 'HARVEST'].includes(this.currentTurn.type)) {
        return false
      }

      if (this.actionView != 'SELF' &&
          this.currentTurn.type == 'WORSHIP' &&
          this.selectedCardInfo.powerType == 'REJUVENATE') {
        return false;
      }

      if (this.actionView != 'SELF' &&
          this.currentTurn.type == 'WORSHIP' &&
          this.selectedCardInfo.powerType == 'GUARD') {
        return false;
      }

      if (this.actionView == 'SELF' &&
          this.currentTurn.type == 'WORSHIP' &&
          this.selectedCardInfo.powerType == 'BURN') {
        return false;
      }

      // Base conditions for map-click
      if (this.currentTurn.type == 'SEED') {
        if (this.map[[i, j]] && this.map[[i, j]].state == 'used') {
          return false
        }
      }

      if (this.currentTurn.type == 'HARVEST') {
        if (!(this.map[[i, j]] && type == this.map[[i, j]].state)) {
          return false
        }
      }

      if (this.currentTurn.type == 'WORSHIP') {
        if (this.selectedCardInfo.cost > this.vpCount()) {
          return false;
        }

        if (this.selectedCardInfo.powerType == 'BURN') {
          let oppMap = this.lastMapState(this.actionViewIdx);

          if (oppMap[[i, j]] && oppMap[[i, j]].protected) {
            return false;
          }
        }
      }

      return true
    },
    vpCount (idx) {
      if (idx == null) {
        idx = this.playerIdx
      }
      if (!this.gameConfig.playerVPs) {
        return 0
      }

      return this.gameConfig.playerVPs[idx]
    },
    saveState (playerId, map) {
      if (playerId == null) {
        playerId = this.playerIdx
      }

      if (map == null) {
        map = this.map
      }

      return Promise.all([
        db.
          ref(dbRefs.playerState(this.gameId, this.turnIdx, playerId)).
          set(JSON.stringify(map)),
        db.ref(dbRefs.state(this.gameId, playerId)).set(JSON.stringify(map))
      ])
    },
    clickCoord (coords) {
      if (this.currentTurn.type == 'SEED') {
        coords.forEach(({ coord, type }) => {
          if (!this.map[coord]) {
            this.$set(this.map, coord, {})
          }

          this.$set(this.map[coord], 'state', type)
        })

        this.passTurn()
      }

      if (this.currentTurn.type == 'HARVEST') {
        coords.forEach(({ coord, type }) => {
          if (!this.map[coord]) {
            this.$set(this.map, coord, {})
          }

          this.$set(this.map[coord], 'state', 'used')
          this.$delete(this.map[coord], 'protected')
        })

        let updatedRecipeCount = this.vpCount()
        if (updatedRecipeCount == null) {
          updatedRecipeCount = this.selectedCardInfo.vp
        } else {
          updatedRecipeCount += this.selectedCardInfo.vp
        }

        db.
          ref(dbRefs.playerVPs(this.gameId, this.playerIdx)).
          set(updatedRecipeCount)

        this.saveState()
        this.turnStarted = true
      }

      if (this.currentTurn.type == 'WORSHIP') {
        // Perform power
        if (this.selectedCardInfo.powerType == 'REJUVENATE') {
          coords.forEach(({ coord }) => {
            if (this.map[coord] && this.map[coord].state == 'used') {
              this.$delete(this.map[coord], 'state')
            }
          })
        }

        if (this.selectedCardInfo.powerType == 'BURN') {
          let oppMap = this.lastMapState(this.actionViewIdx);
          coords.forEach(({ coord }) => {
            if (!oppMap[coord]) {
              oppMap[coord] = {}
            }

            if (!oppMap[coord].protected) {
              oppMap[coord].state = 'used'
            }
          })
          this.saveState(this.actionViewIdx, oppMap)
        }

        if (this.selectedCardInfo.powerType == 'GUARD') {
          coords.forEach(({ coord }) => {
            if (!this.map[coord]) {
              this.$set(this.map, coord, {})
            }

            if (this.map[coord].state != 'used') {
              this.$set(this.map[coord], 'protected', true)
            }
          })
        }

        // Subtract cost
        db.
          ref(dbRefs.playerVPs(this.gameId, this.playerIdx)).
          set(this.vpCount() - this.selectedCardInfo.cost)

        this.saveState()
        this.turnStarted = true
      }
    },
    passTurn () {
      Promise.all([
        this.saveState(),
        db.
          ref(dbRefs.playersPlayed(this.gameId, this.turnIdx, this.playerIdx)).
          set(true)
      ]).then(() => {
          if (this.allPlayersPlayed) {
            db.ref(dbRefs.currentTurn(this.gameId)).set(this.turnIdx + 1)
          }
      })
    },
    canPlayerPlay () {
      if (!this.currentTurn) {
        return false
      }
      if (this.currentTurn.type == 'SEED') {
        return true
      }

      if (this.currentTurn.type == 'HARVEST') {
        let out = true
        this.gameConfig.recipes.forEach((recipe) => {
          // out = false
        })
        return out
      }

      return true
    },
    nextTurn () {
      this.selectedCardInfo = {}
      this.cardIdx = 0
      this.turnStarted = false
      this.actionView = 'SELF'
      this.turnIdx = this.gameConfig.currentTurn

      if (this.turnIdx >= this.gameConfig.turns.length) {
        this.$router.push({
          name: 'GameEnd',
          params: {
            gameId: this.gameId
          }
        })
        return
      }

      if (this.currentTurn && !this.canPlayerPlay()) {
        this.passTurn()
      }
    }
  }
}
</script>

<style lang="scss">
.player-status-list {
  .player-status {
    &:first-of-type {
      .notification {
        margin-left: 0px !important;
      }
    }
    &:last-of-type {
      .notification {
        margin-right: 0px !important;
      }
    }
  }
}

.tabs.is-primary > ul > li.is-active > a {
  background-color: #ebfffc;
  color: black;
  border-color: #00d1b2;
}
</style>
