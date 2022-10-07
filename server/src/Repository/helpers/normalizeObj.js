exports.normalizeObj = obj => {
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined || value === null || (value instanceof Array && !value.length)) {
            delete obj[key]
        }
    }
    return obj ?? null
}