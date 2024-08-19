import { Sphere, Cylinder } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { FC, useEffect, useRef, useState } from 'react'
import { Mesh, Quaternion, Vector3 } from 'three'
import {
	areVectorComponentsNearIntegers,
	getClosestPoint,
	getPerpendicularVectors,
	getPointsInDirection,
	roundVector3,
} from './utils'

interface PipeProps {
	start: Vector3
	end: Vector3
	prevPoints: Vector3[]
}

const Pipe: FC<PipeProps> = ({ start, end, prevPoints }) => {
	const pipeRef = useRef<Mesh>(null)
	const [points, setPoints] = useState<Vector3[]>(prevPoints)
	const [scale, setScale] = useState(1.5)
	const [nextEnd, setNextEnd] = useState<Vector3 | null>(null)

	const difference = end.clone().sub(start)
	const length = difference.length()
	const direction = difference.clone().normalize()
	const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction)

	if (pipeRef.current) pipeRef.current.quaternion.copy(quaternion)

	useEffect(() => {
		setPoints([...points, end])

		const perpVectors = getPerpendicularVectors(direction)

		const map = new Map<Vector3, Vector3 | undefined>()
		perpVectors.forEach(perpVector => {
			const normalized = perpVector.clone().normalize()
			const pointsInDirection = getPointsInDirection(end, normalized, points)
			const closestPoint = getClosestPoint(end, pointsInDirection)
			map.set(perpVector, closestPoint)
		})
		map.forEach((closestPoint, perpVector) => {
			console.log('end', end)
			console.log('closestPoint', closestPoint)
			console.log('distance', closestPoint && end.distanceTo(closestPoint))
			if (closestPoint && end.distanceTo(closestPoint) <= 8) {
				console.log('DELETED')
				map.delete(perpVector)
			}
		})

		const randomIndex = Math.floor(Math.random() * map.size)
		const nextDirection = Array.from(map.keys())?.[randomIndex] ?? perpVectors[0]
		const maxLength = map.get(nextDirection)?.distanceTo(end) ?? 16
		const nextLength = 4 + Math.floor((Math.random() * maxLength) / 4)
		setNextEnd(end.clone().add(nextDirection.multiplyScalar(nextLength)))
	}, [])

	useFrame(() => {
		if (!pipeRef.current) return

		if (scale < length) {
			setScale(scale + 0.1)
			pipeRef.current.position.copy(start.clone().add(direction.clone().multiplyScalar(scale / 2)))

			const currentEnd = start.clone().add(direction.clone().multiplyScalar(scale))
			if (areVectorComponentsNearIntegers(currentEnd)) {
				setPoints([...points, roundVector3(currentEnd)])
			}
		}
		pipeRef.current.scale.set(1, scale, 1)
	})

	return (
		<>
			<Sphere args={[1.5, 32, 32]} position={start} castShadow receiveShadow>
				<meshStandardMaterial color='cyan' />
			</Sphere>
			<Cylinder ref={pipeRef} args={[1, 1, 1, 32]} position={end} castShadow receiveShadow>
				<meshStandardMaterial color='cyan' />
			</Cylinder>
			{scale >= length && nextEnd && <Pipe start={end} end={nextEnd} prevPoints={points} />}
		</>
	)
}

export default Pipe
