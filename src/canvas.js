
module.exports = () => {
  const canvas = document.createElement('canvas')
  canvas.style = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = `${width}`
  canvas.height = `${height}`
  return {canvas, width, height}
}
