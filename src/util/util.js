function ensureArray (elem) {
    if (elem == null) {
        return []
    }

    if (Array.isArray(elem)) {
        return elem
    }

    let maxV = Math.max(...Object.keys(elem))
    let newElem = newArray(maxV)
    for (let i = 0; i < maxV; i++) {
        newElem[i] = elem[i] || null
    }

    return newElem
}

export { ensureArray }
