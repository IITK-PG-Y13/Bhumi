import { v4 } from 'uuid'

function getCurrentPlayer () {
    if (window.localStorage.getItem('playerId') == null) {
        return null
    } else {
        return window.localStorage.getItem('playerId')
    }
}

function setCurrentPlayer (force = false) {
    if (getCurrentPlayer() == null || force) {
        window.localStorage.setItem('playerId', v4())
    }
}

export { getCurrentPlayer, setCurrentPlayer }
