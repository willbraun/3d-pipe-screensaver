import { Vector3, useFrame } from '@react-three/fiber'
import { FC, useRef, useState } from 'react'
import { Mesh } from 'three'

interface PipeProps {
	position: Vector3
}

const Pipe: FC<PipeProps> = ({ position }) => {
	const pipeRef = useRef<Mesh>(null)
	const [scale, setScale] = useState(0.1)

	useFrame(() => {
		if (!pipeRef.current) return

		if (scale < 1) {
			setScale(scale + 0.01)
			pipeRef.current.position.y = scale * 2
		}
		pipeRef.current.scale.set(1, scale, 1) // Only grow in the Y-axis
	})

	return (
		<mesh ref={pipeRef} position={position}>
			<cylinderGeometry args={[1, 1, 4, 32]} />
			<meshStandardMaterial color='white' />
		</mesh>
	)
}

export default Pipe
