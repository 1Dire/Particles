import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')
/**
 * Particles
 */
// Material
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000



const positions = new Float32Array(count * 3) // 각 위치는 x, y, z로 구성되므로 3을 곱해서 배열 크기를 설정

for(let i = 0; i < count * 3; i++)// 각 위치가 x, y, z로 구성되므로 동일한 이유로 3을 곱함
{
    positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5를 사용해 -0.5에서 +0.5 사이의 랜덤 값을 생성
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // // Three.js BufferAttribute를 생성하고, 각 위치가 x, y, z로 구성되었음을 지정
//Geometry
const particlesMaterial = new THREE.PointsMaterial()

particlesMaterial.size = 0.1  // 각 점의 크기를 설정 (기본 단위: 월드 공간)
particlesMaterial.sizeAttenuation =  true// 점의 크기가 카메라와의 거리에 따라 감소할지 여부
particlesMaterial.color = new THREE.Color("#ff88cc")
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false


// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()