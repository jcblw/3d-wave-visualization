module.exports = (center, radius) => {
  return ([x, y], i, arr) => {
    const a = (6.28319 / arr.length) * i // << needs to be total radians / amount
    const coordinates = [
      center[0] + (radius + y) * Math.cos(a),
      center[1] + (radius + y) * Math.sin(a)
    ]
    return [
      ...coordinates
    ]
  }
}
