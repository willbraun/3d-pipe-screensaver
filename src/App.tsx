import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Pipe from './Pipe'
import { useContext } from 'react'
import { Vector3 } from 'three'
import { PointsContext } from './context'

export const App = () => {
	const { points, setPoints } = useContext(PointsContext)

	return (
		<Canvas shadows style={{ width: '100vw', height: '100vh' }}>
			<OrbitControls />
			<PerspectiveCamera makeDefault fov={100} position={[0, 0, 50]} />
			<ambientLight intensity={0.1} />
			<directionalLight position={[1, 1, 1]} />

			<PointsContext.Provider value={{ points, setPoints }}>
				<Pipe start={points[0]} end={new Vector3(0, 4, 0)} />
			</PointsContext.Provider>
		</Canvas>
	)
}
