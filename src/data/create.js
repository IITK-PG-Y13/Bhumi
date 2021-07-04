import shapes from './shapes'

// Random number from a to b inclusive.
function randInt (a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

const tileTypes = ['yellow', 'green', 'brown', 'blue']
const tileShapes = Object.keys(shapes.shapes)

export default function createGame () {
  let numberOfTurns = 30;
  let cardsPerTurnMin = 2;
  let cardsPerTurnMax = 4;

  let out = {
    active: true,
    started: false,
    currentTurn: 0,
    totalPlayers: 4
  }

  let turns = []

  for (let i = 0; i < numberOfTurns; i++) {
    let numCards = randInt(cardsPerTurnMin, cardsPerTurnMax)
    let cardList = []

    for (let j = 0; j < numCards; j++) {
      cardList.push({
        shape: tileShapes[randInt(0, tileShapes.length - 1)],
        type: tileTypes[randInt(0, tileTypes.length - 1)]
      })
    }

    turns.push({
      cardList
    })
  }

  out.turns = turns

  return out
}
