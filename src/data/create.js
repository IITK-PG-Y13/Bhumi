import shapes from './shapes'
import recipeObj from './recipes'
import powerObj from './powers'
import curatedStart from './curatedStart'

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

let tileTypes = ['yellow', 'green', 'brown']
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

  let recipes = recipeObj.products.map((elem) => {
    let shuffledTypes = shuffleArray(tileTypes.slice(0))
    let shape = randElem(elem.shapes)

    return {
      name: elem.name,
      shape: shape.map((row) => row.map((cell) => cell == 0 ? 0 : 1)),
      type: shape.map((row) => row.map((cell) => cell == 0 ? "null" : shuffledTypes[cell - 1])),
      vp: elem.vp,
    }
  })

  if (config != null && config.curated) {
    recipes = curatedStart.recipeList
  }

  out.recipes = recipes

  let godPowers = []

  powerObj.godPowers.forEach((elem) => {
    if (config != null && config.noDestructivePowers) {
      if (["BURN"].includes(elem.powerType)) {
        return
      }
    }

    let type = powerObj.godPowerClasses[elem.powerType]

    godPowers.push({
      name: elem.name,
      description: elem.description,
      powerType: elem.powerType,
      cost: elem.cost,
      type: powerObj.godPowerClasses[elem.powerType],
    })
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
      moveType: "SEQUENTIAL", // PARALLEL
      cardList,
    })

    turns.push({
      type: "HARVEST",
      moveType: "SEQUENTIAL"
    })

    turns.push({
      type: "WORSHIP",
      moveType: "SEQUENTIAL"
    })
  }

  out.turns = turns

  return out
}
