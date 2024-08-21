import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Pipe from './Pipe'
import { Vector3 } from 'three'
import { useRef } from 'react'

export const App = () => {
	const pipe1 = [new Vector3(-12, 0, 0), new Vector3(-12, 4, 0)]
	const pipe2 = [new Vector3(12, 0, 0), new Vector3(12, -8, 0)]
	const pipe3 = [new Vector3(0, 12, 4), new Vector3(-8, 12, 4)]
	const pointsRef = useRef<Vector3[]>([pipe1[0], pipe2[0], pipe3[0]])

	return (
		<Canvas shadows style={{ width: '100vw', height: '100vh' }}>
			<OrbitControls />
			<PerspectiveCamera makeDefault fov={100} position={[0, 0, 60]} />
			<ambientLight intensity={0.1} />
			<directionalLight position={[0.5, 1, 1]} />

			<Pipe start={pipe1[0]} end={pipe1[1]} pointsRef={pointsRef} color={'orange'} />
			<Pipe start={pipe2[0]} end={pipe2[1]} pointsRef={pointsRef} color={'limegreen'} />
			<Pipe start={pipe3[0]} end={pipe3[1]} pointsRef={pointsRef} color={'cyan'} />
		</Canvas>
	)
}
