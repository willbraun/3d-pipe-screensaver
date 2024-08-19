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
	// const [points, setPoints] = useState<Vector3[]>(prevPoints)
	const pipeRef = useRef<Mesh>(null)
	const [scale, setScale] = useState(1.5)

	const difference = end.clone().sub(start)
	const length = difference.length()
	const direction = difference.clone().normalize()
	const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction)

	if (pipeRef.current) pipeRef.current.quaternion.copy(quaternion)

	// useEffect(() => {
	// 	setPoints([...points, end])
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [])

	useFrame(() => {
		if (!pipeRef.current) return

		if (scale < length) {
			setScale(scale + 0.5)
			pipeRef.current.position.copy(start.clone().add(direction.clone().multiplyScalar(scale / 2)))

			// const currentEnd = start.clone().add(direction.clone().multiplyScalar(scale))
			// if (areVectorComponentsNearIntegers(currentEnd)) {
			// 	setPoints([...points, roundVector3(currentEnd)])
			// }
		}
		pipeRef.current.scale.set(1, scale, 1)
	})

	const nextDirection = getRandomPerpendicularVector(direction)
	// if I have all of the previous points, the start, and the direction, filter all points to just the ones from end to the nextDirection
	// filter to the points with the same constant value (x, y, or z) as the nextDirection
	// const pointsInDirection = points
	// 	.filter(point => {
	// 		const { x, y, z } = nextDirection
	// 		if (x !== 0) return (x === 1 ? point.x > end.x : point.x < end.x) && point.y === end.y && point.z === end.z
	// 		if (y !== 0) return (y === 1 ? point.y > end.y : point.y < end.y) && point.x === end.x && point.z === end.z
	// 		if (z !== 0) return (z === 1 ? point.z > end.z : point.z < end.z) && point.x === end.x && point.y === end.y
	// 		return false
	// 	})
	// 	.sort((a, b) => {
	// 		const { x, y, z } = nextDirection
	// 		if (x !== 0) return x === 1 ? a.x - b.x : b.x - a.x
	// 		if (y !== 0) return y === 1 ? a.y - b.y : b.y - a.y
	// 		if (z !== 0) return z === 1 ? a.z - b.z : b.z - a.z
	// 		return 0
	// 	})

	// const segmentSize = 4
	// let maxSegments = 3
	// if (pointsInDirection.length > 0) {
	// 	maxSegments = end.clone().distanceTo(pointsInDirection[0])
	// }

	// sort the points by the value in the variable direction
	// set max in nextLength to the difference between the end and the point in the sorted list that is closest to the end
	// if no points are found, set max to the difference between the end position and nextDirection.length * 10.
	// console.log(points, setPoints)

	const nextLength = Math.floor(Math.random() * 10 + 4)
	const nextEnd = end.clone().add(nextDirection.multiplyScalar(nextLength))

	// const nextEnd = start.clone().add(new Vector3(0, 4, 0))

	// console.log(nextEnd)

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
