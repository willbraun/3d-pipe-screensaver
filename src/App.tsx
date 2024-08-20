import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Pipe from './Pipe'
import { Vector3 } from 'three'

export const App = () => {
	const pipe1Points = [new Vector3(0, 0, 0), new Vector3(0, 4, 0)]
	const pipe2Points = [new Vector3(12, 0, 0), new Vector3(12, -4, 0)]

	return (
		<Canvas shadows style={{ width: '100vw', height: '100vh' }}>
			<OrbitControls />
			<PerspectiveCamera makeDefault fov={100} position={[0, 0, 75]} />
			<ambientLight intensity={0.1} />
			<directionalLight position={[1, 1, 1]} />

			<Pipe start={pipe1Points[0]} end={pipe1Points[1]} prevPoints={pipe1Points} color={'white'} />
			<Pipe start={pipe2Points[0]} end={pipe2Points[1]} prevPoints={pipe2Points} color={'red'} />
		</Canvas>
	)
}
