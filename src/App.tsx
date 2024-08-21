import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Pipe from './Pipe'
import { Vector3 } from 'three'
import { useRef } from 'react'

export const App = () => {
	const pointsRef = useRef<Vector3[]>([])

	return (
		<Canvas shadows style={{ width: '100vw', height: '100vh' }}>
			<OrbitControls />
			<PerspectiveCamera makeDefault fov={100} position={[0, 0, 75]} />
			<ambientLight intensity={0.1} />
			<directionalLight position={[0.5, 1, 1]} />

			<Pipe start={new Vector3(-12, 0, 0)} end={new Vector3(-12, 4, 0)} pointsRef={pointsRef} color={'orange'} />
			<Pipe start={new Vector3(12, 0, 0)} end={new Vector3(12, -8, 0)} pointsRef={pointsRef} color={'limegreen'} />
			<Pipe start={new Vector3(0, -12, 0)} end={new Vector3(-8, -12, 0)} pointsRef={pointsRef} color={'cyan'} />
		</Canvas>
	)
}
