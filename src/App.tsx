import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Pipe from './Pipe'
import { Vector3 } from 'three'

export const App = () => {
	const firstPoints = [new Vector3(0, 0, 0), new Vector3(0, 4, 0)]

	return (
		<Canvas shadows style={{ width: '100vw', height: '100vh' }}>
			<OrbitControls />
			<PerspectiveCamera makeDefault fov={100} position={[0, 0, 50]} />
			<ambientLight intensity={0.1} />
			<directionalLight position={[1, 1, 1]} />

			<Pipe start={firstPoints[0]} end={firstPoints[1]} prevPoints={firstPoints} />
		</Canvas>
	)
}
