module.exports = (status, body) => {
    if (status && body) {
        return { status, body }
    }
}