import { Sphere, Cylinder } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { FC, useRef, useState } from 'react'
import { Mesh, Quaternion, Vector3 } from 'three'
import { getRandomPerpendicularVector } from './utils'

interface PipeProps {
	start: Vector3
	end: Vector3
}

const Pipe: FC<PipeProps> = ({ start, end }) => {
	const pipeRef = useRef<Mesh>(null)
	const [scale, setScale] = useState(1.5)

	const difference = end.clone().sub(start)
	const length = difference.length()
	const direction = difference.clone().normalize()
	const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction)

	if (pipeRef.current) pipeRef.current.quaternion.copy(quaternion)

	useFrame(() => {
		if (!pipeRef.current) return

		if (scale < length) {
			setScale(scale + 0.5)
			pipeRef.current.position.copy(start.clone().add(direction.clone().multiplyScalar(scale / 2)))
		}
		pipeRef.current.scale.set(1, scale, 1)
	})

	const nextDirection = getRandomPerpendicularVector(direction)
	const nextLength = Math.floor(Math.random() * 4) * 4 + 4
	const nextEnd = end.clone().add(nextDirection.multiplyScalar(nextLength))

	return (
		<>
			<Sphere args={[1.5, 32, 32]} position={start} castShadow receiveShadow>
				<meshStandardMaterial color='cyan' />
			</Sphere>
			<Cylinder ref={pipeRef} args={[1, 1, 1, 32]} position={end} castShadow receiveShadow>
				<meshStandardMaterial color='cyan' />
			</Cylinder>
			{scale >= length && <Pipe start={end} end={nextEnd} />}
		</>
	)
}

export default Pipe
