import { Sphere, Cylinder } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { FC, useEffect, useRef, useState } from 'react'
import { Mesh, Quaternion, Vector3 } from 'three'
import {
	areVectorComponentsDivisibleBy4,
	getClosestPoint,
	getPerpendicularVectors,
	getPointsInDirection,
	roundVector3,
} from './utils'

interface PipeProps {
	start: Vector3
	end: Vector3
	pointsRef: React.MutableRefObject<Vector3[]>
	color: string
}

const Pipe: FC<PipeProps> = ({ start, end, pointsRef, color }) => {
	const pipeRef = useRef<Mesh>(null)
	const [scale, setScale] = useState(1.5)
	const [nextEnd, setNextEnd] = useState<Vector3 | null>(null)
	const chunkSize = 4

	const difference = end.clone().sub(start)
	const length = difference.length()
	const direction = difference.clone().normalize()
	const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction)

	if (pipeRef.current) pipeRef.current.quaternion.copy(quaternion)

	useEffect(() => {
		const perpVectors = getPerpendicularVectors(direction)
		const map = new Map<Vector3, Vector3 | undefined>()
		perpVectors.forEach(perpVector => {
			const normalized = perpVector.clone().normalize()
			const pointsInDirection = getPointsInDirection(end, normalized, pointsRef.current)
			const closestPoint = getClosestPoint(end, pointsInDirection)
			map.set(perpVector, closestPoint)
		})

		const possibleEnds: Vector3[] = []
		map.forEach((closestPoint, perpVector) => {
			const distance = closestPoint?.distanceTo(end) ?? 24
			if (distance <= chunkSize) return

			const maxLength = Math.min(distance, 24) - chunkSize
			for (let i = chunkSize; i <= maxLength; i += chunkSize) {
				const possibleEnd = end.clone().add(perpVector.clone().multiplyScalar(i))
				if (
					possibleEnd.x > -100 &&
					possibleEnd.x < 100 &&
					possibleEnd.y > -50 &&
					possibleEnd.y < 50 &&
					possibleEnd.z < 50
				) {
					possibleEnds.push(possibleEnd)
				}
			}
		})

		const choice = possibleEnds[Math.floor(Math.random() * possibleEnds.length)]
		setNextEnd(choice)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useFrame(() => {
		if (!pipeRef.current) return

		const increment = 0.5
		const steps = 5

		let newScale = scale

		for (let i = 0; i < steps && newScale < length; i++) {
			newScale += increment / steps

			const newPosition = start.clone().add(direction.clone().multiplyScalar(newScale / 2))
			pipeRef.current.position.copy(newPosition)

			const currentEnd = start.clone().add(direction.clone().multiplyScalar(newScale))
			if (areVectorComponentsDivisibleBy4(currentEnd)) {
				pointsRef.current.push(roundVector3(currentEnd))
			}
		}

		setScale(newScale)
		pipeRef.current.scale.set(1, newScale, 1)
	})

	return (
		<>
			<Sphere args={[1.5, 32, 32]} position={start} castShadow receiveShadow>
				<meshStandardMaterial color={color} />
			</Sphere>
			<Cylinder ref={pipeRef} args={[1, 1, 1, 32]} position={end} castShadow receiveShadow>
				<meshStandardMaterial color={color} />
			</Cylinder>
			{scale >= length && nextEnd && <Pipe start={end} end={nextEnd} pointsRef={pointsRef} color={color} />}
		</>
	)
}

export default Pipe
