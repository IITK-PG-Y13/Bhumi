<template>
<section class="hero">
  <div class="hero-body">
    <div class="container" v-if="gameConfig && loaded">
      <div class="columns">
        <div class="column is-2" style="max-height: 80vh; overflow-y: scroll;">
          <h3 class="title is-4">Reference</h3>
          <h5 class="subtitle is-6">VP: {{ victoryPoints }}</h5>
          <div class="columns is-multiline">
            <div class="column is-12" v-for="recipe in gameConfig.recipes">
              <show-recipe :recipe="recipe" :recipeCount="recipeCount()[recipe.idx]"></show-recipe>
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
                    <a @click="actionView = 'OPP'; actionViewIdx = idx">Player {{ idx }}</a>
                  </li>
                  <li :class="{'is-active': actionView == 'CHAT'}" ref="chatTab">
                    <a @click="actionView = 'CHAT'">Chat</a>
                  </li>
                  <li :class="{'is-active': actionView == 'TRADE'}" ref="tradeTab">
                    <a @click="actionView = 'TRADE'">Trade</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="column is-12 py-0">
              <template v-if="actionView == 'SELF'">
                <board :map="map"
                       :hoverData="(needToPlay ? selectedCardInfo : null)"
                       @click="clickCoord"></board>
                <recipe-list :recipes="gameConfig.recipes"
                             :recipeCount="recipeCount()"></recipe-list>
                <hr style="margin: 0.5rem 0;"/>
                <div class="column is-4"
                     v-for="idx in gameConfig.totalPlayers"
                     v-if="idx != playerIdx">
                  <div class="box p-1 pointer" @click="actionView = 'OPP'; actionViewIdx = idx">
                    <span class="has-text-weight-bold">
                      {{ idx == playerIdx ? "You" : "Player " + idx }}
                    </span>
                    <board :map="lastMapState(idx)" size="is-micro"></board>
                    <recipe-list :recipes="gameConfig.recipes"
                                 :recipeCount="recipeCount(idx)"
                                 size="are-small"></recipe-list>
                  </div>
                </div>
              </template>
              <template v-if="actionView == 'OPP'">
                <board :map="lastMapState(actionViewIdx)"
                       :hoverData="(needToPlay ? selectedCardInfo : null)"
                       @click="clickCoord"></board>
                <recipe-list :recipes="gameConfig.recipes"
                             :recipeCount="recipeCount(actionViewIdx)"></recipe-list>
              </template>
              <template v-if="actionView == 'CHAT'">
                <chat :chatData="gameConfig.chatData"
                      :activePlayer="activePlayer"
                      :activePlayerIdx="playerIdx"
                      @send="sendMessage"></chat>
              </template>
              <template v-if="actionView == 'TRADE'">
                <i>Coming Soon!</i>
              </template>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="columns is-multiline">
            <div class="column is-12 is-paddingless is-italic is-size-7">
              Move {{ turnIdx + 1 }} / {{ gameConfig.turns.length }}
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
                          headerKey="name"
                          @select="selectCard"></turn-cards>
            </div>
            <div class="column is-12" v-else-if="currentTurn.type == 'WORSHIP'">
              <h3 class="title is-4">Worship Phase</h3>
              <turn-cards :currentTurn="currentTurn"
                          :turnIdx="turnIdx"
                          :recipes="gameConfig.godPowers"
                          headerKey="name"
                          @select="selectCard"></turn-cards>
            </div>
          </div>
          <div class="tile is-ancestor is-parent player-status-list">
            <div class="tile is-child player-status"
                 v-for="idx in gameConfig.totalPlayers">
              <div class="notification is-success is-light m-1"
                   v-if="currentTurn.playersPlayed && currentTurn.playersPlayed[idx]">
                {{ idx == playerIdx ? "You" : "Player " + idx }}
              </div>
              <div class="notification is-default m-1" v-else>
                {{ idx == playerIdx ? "You" : "Player " + idx }}
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

export default {
  data () {
    return {
      actionView: 'SELF',
      actionViewIdx: 0,
      loaded: false,
      gameConfig: null,
      playerIdx: null,
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
          if (window.localStorage.getItem('playerId') == null ||
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
      return this.gameConfig.players.includes(window.localStorage.getItem('playerId'))
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
    victoryPoints () {
      let recipeCount = this.recipeCount()

      let vp = 0

      recipeCount.forEach((ct, idx) => {
        switch (idx) {
          case 0:
            vp += ct
            break
          case 1:
            vp += ct * 5
            break
          case 2:
            vp += ct * 10
            break
        }
      })

      return vp
    },
    needToPlay () {
      if (this.currentTurn.playersPlayed && this.currentTurn.playersPlayed[this.playerIdx]) {
        return false
      } else {
        if (this.currentTurn.moveType && this.currentTurn.moveType == 'SEQUENTIAL') {
          if (!this.currentTurn.playersPlayed) {
            return (this.playerIdx == 1)
          }

          if (this.currentTurn.playersPlayed.length == this.playerIdx) {
            return true
          }

          return false
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
      this.playerIdx = this.gameConfig.players.indexOf(window.localStorage.getItem('playerId'))

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

        return true
      }

      if (this.currentTurn.type == 'HARVEST') {
        if (!(this.map[[i, j]] && type == this.map[[i, j]].state)) {
          return false
        }

        return true
      }

      if (this.currentTurn.type == 'WORSHIP') {
        let out = true

        this.selectedCardInfo.cost.forEach((cost, idx) => {
          if (cost > 0 && (
                !this.recipeCount()[idx] ||
                this.recipeCount()[idx] < cost
          )) {
            out = false
          }
        })

        return out
      }

      return true
    },
    recipeCount (idx) {
      if (idx == null) {
        idx = this.playerIdx
      }
      if (!this.gameConfig.playerRecipes || !this.gameConfig.playerRecipes[idx]) {
        return []
      }
      let rc = this.gameConfig.playerRecipes[idx]

      return ensureArray(rc)
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

        let updatedRecipeCount = this.recipeCount()[this.selectedCardInfo.idx]
        if (updatedRecipeCount == null) {
          updatedRecipeCount = 1
        } else {
          updatedRecipeCount += 1
        }

        db.
          ref(dbRefs.playerRecipes(this.gameId, this.playerIdx, this.selectedCardInfo.idx)).
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
        this.selectedCardInfo.cost.forEach((cost, idx) => {
          if (cost == 0) {
            return
          }

          db.
            ref(dbRefs.playerRecipes(this.gameId, this.playerIdx, idx)).
            set(this.recipeCount()[idx] - cost)
        })

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
      }

      if (!this.canPlayerPlay()) {
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
