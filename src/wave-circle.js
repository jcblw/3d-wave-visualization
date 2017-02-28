const circle = require('./circle')
const mapSegments = require('./map-segments')

module.exports = (points, center, radius, circleRadius = 3) => {
  const circles = []
  points
    .map(mapSegments(center, radius))
    .forEach((pointCenter) => {
      circles.push(circle(pointCenter, circleRadius))
    })
  return circles
}
