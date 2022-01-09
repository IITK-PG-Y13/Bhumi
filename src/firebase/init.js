import firebase from 'firebase/app';
import firestore from 'firebase/database';
import firebaseConfig from './config';

const firebaseApp = firebase.initializeApp(firebaseConfig);

let dbRefs = {
    gameConfig (id) {
        return `games/${id}`
    },
    gameActive (id) {
        return `games/${id}/active`
    },
    gamePlayers (id, playerId) {
        return `games/${gameId}/players/${playerId}`
    },
    state (gameId, playerId) {
        return `games/${gameId}/playerState/${playerId}`
    },
    playerState (gameId, turnId, playerId) {
        return `games/${gameId}/turns/${turnId}/playerState/${playerId}`
    },
    playerVPs (gameId, playerId) {
        return `games/${gameId}/playerVPs/${playerId}`
    },
    playersPlayed (gameId, turnId, playerId) {
        return `games/${gameId}/turns/${turnId}/playersPlayed/${playerId}`
    },
    currentTurn (gameId) {
        return `games/${gameId}/currentTurn`
    },
    chatData (gameId) {
        return `games/${gameId}/chatData`
    }
}
let db = firebaseApp.database()

export {dbRefs, db}
