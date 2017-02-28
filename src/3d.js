// OG: https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_buffergeometry.html

const THREE = require('three')
const Simplex = require('perlin-simplex')

require('three-first-person-controls')(THREE)

let container
let camera
let controls
let scene
let renderer
let light1
let planeMesh

const clock = new THREE.Clock()
const worldWidth = 256
const worldDepth = 100
const worldHalfWidth = worldWidth / 2
const worldHalfDepth = worldDepth / 2

function init (el, size = 100) {
  container = el
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000)
  controls = new THREE.FirstPersonControls(camera)

  const data = generateHeight(worldWidth, worldDepth)
  camera.position.y = data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 100
  controls.movementSpeed = 1000
  controls.lookSpeed = 0.1
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xb3d9ff, 100, 3000)

  const plane = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1)
  plane.rotateX(-Math.PI / 2)

  const vertices = plane.attributes.position.array
  for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = data[i] * 10
  }

  const texture = new THREE.MeshPhongMaterial({
    specular: '#fff',
    fog: true,
    color: '#2192ff',
    shininess: 0.1
  })
  planeMesh = new THREE.Mesh(plane, texture)

  scene.add(new THREE.AmbientLight(0xffffff))

  // const light1 = new THREE.AmbientLight(0xffffff, 0.5)
  // light1.position.set(1, 1, 1)
  // light1.position.y = data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 5000
  // scene.add(light1)

  scene.add(planeMesh)

  const intensity = 50
  const distance = 100
  const decay = 2.0
  const c1 = 0xff0040
  const sphere = new THREE.SphereGeometry(0.25, 16, 8)
  light1 = new THREE.PointLight(c1, intensity, distance, decay)
  light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: c1 })))
  scene.add(light1)

  renderer = new THREE.WebGLRenderer({ antialias: false })
  renderer.setClearColor(scene.fog.color)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)
}

const perlin = new Simplex()
function generateHeight (width, height, freq) {
  const z = Date.now() * 0.001
  const size = width * height
  const data = new Uint8Array(size)
  let quality = 1
  // const z = Math.random() * 100
  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < size; i++) {
      const x = i % width
      const y = ~~(i / width)
      data[ i ] += Math.abs(perlin.noise3d(x / quality, y / quality, z) * quality * 1.75)
    }
    quality *= freq || 0.2
  }
  return data
}

function updateVerticies (plane, freq) {
  const vertices = plane.attributes.position.array
  const data = generateHeight(worldWidth, worldDepth, freq)
  for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = data[i] * 10
  }
  plane.attributes.position.needsUpdate = true
}

function draw (freq) {
  // planeMesh.rotation.x = time * 0.40
  // planeMesh.rotation.y = time * 0.22
  // uncomment to get back controls
  controls.update(clock.getDelta())
  // mesh.geometry.position.array
  updateVerticies(planeMesh.geometry, freq)

  renderer.render(scene, camera)
}

module.exports = {
  init,
  draw
}
