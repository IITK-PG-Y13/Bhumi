import shapes from './shapes'
import recipeObj from './recipes'
import powerObj from './powers'

// Random number from a to b inclusive.
function randInt (a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

function randElem (array) {
  return array[randInt(0, array.length - 1)]
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const tileTypes = ['yellow', 'green', 'brown', 'blue']
const tileShapes = Object.keys(shapes.shapes)

export default function createGame (config) {
  let numberOfTurns = 30;
  if (config != null && config.turns != null) {
    numberOfTurns = parseInt(config.turns)
  }

  let cardsPerTurnMin = 2;
  let cardsPerTurnMax = 3;

  let out = {
    active: true,
    started: false,
    currentTurn: 0,
    totalPlayers: 4,
  }

  if (config != null && config.maxPlayers != null) {
    out.totalPlayers = parseInt(config.maxPlayers)
  }

  let recipes = recipeObj.products.map((elem, idx) => {
    let shuffledTypes = shuffleArray(tileTypes.slice(0))
    let shape = randElem(elem.shapes)

    return {
      name: elem.name,
      shape: shape.map((row) => row.map((cell) => cell == 0 ? 0 : 1)),
      type: shape.map((row) => row.map((cell) => cell == 0 ? "null" : shuffledTypes[cell - 1])),
      idx
    }
  })

  out.recipes = recipes

  let godPowers = powerObj.godPowers.map((elem, idx) => {
    let availablePowers = elem.powers

    if (config != null && config.noDestructivePowers) {
      availablePowers = elem.powers.filter((p) => ["REJUVENATE"].includes(p.powerType))
    }

    let godPower = randElem(availablePowers)

    let type = powerObj.godPowerClasses[godPower.powerType]

    return {
      ...godPower,
      type,
    }
  })

  out.godPowers = godPowers

  let turns = []
  for (let i = 0; i < numberOfTurns; i++) {
    let numCards = randInt(cardsPerTurnMin, cardsPerTurnMax)
    let cardList = []

    for (let j = 0; j < numCards; j++) {
      cardList.push({
        shape: shapes.get(randElem(tileShapes)),
        type: randElem(tileTypes)
      })
    }

    turns.push({
      type: "SEED",
      // moveType: "PARALLEL",
      cardList,
    })

    turns.push({
      type: "HARVEST",
      // moveType: "PARALLEL"
    })

    turns.push({
      type: "WORSHIP",
      moveType: "SEQUENTIAL"
    })
  }

  out.turns = turns

  return out
}
