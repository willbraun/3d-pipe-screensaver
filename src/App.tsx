import { OrbitControls, PerspectiveCamera, Sphere } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Pipe from './Pipe'

export const App = () => {
	return (
		<Canvas style={{ width: '100vw', height: '100vh' }}>
			<OrbitControls />
			<PerspectiveCamera makeDefault fov={75} position={[0, 0, 10]} />
			<ambientLight />
			<pointLight position={[10, 10, 10]} />

			<Sphere args={[0.1, 32, 32]} position={[0, 0, 0]}>
				<meshStandardMaterial color='red' />
			</Sphere>

			<Pipe position={[2, 0, 0]} />
		</Canvas>
	)
}
