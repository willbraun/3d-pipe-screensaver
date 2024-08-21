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

const chunkSize = 4
const getRandomLength = (max: number) => {
	const min = chunkSize
	const possibleChunks = Math.floor((max - min) / 4) + 1
	const numChunks = Math.floor(Math.random() * possibleChunks)
	return min + numChunks * 4
}

const Pipe: FC<PipeProps> = ({ start, end, pointsRef, color }) => {
	const pipeRef = useRef<Mesh>(null)
	const [scale, setScale] = useState(1.5)
	const [nextEnd, setNextEnd] = useState<Vector3 | null>(null)

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
		map.forEach((closestPoint, perpVector) => {
			if (closestPoint && end.distanceTo(closestPoint) <= 4) {
				map.delete(perpVector)
			}
		})

		let nextEnd: Vector3 | undefined = undefined
		let count = 0
		while (nextEnd === undefined) {
			const randomIndex = Math.floor(Math.random() * map.size)
			const nextDirection = Array.from(map.keys())?.[randomIndex] ?? perpVectors[0]
			const distance = map.get(nextDirection)?.distanceTo(end) ?? 24
			const maxLength = Math.min(distance, 24) - chunkSize
			const nextLength = getRandomLength(maxLength)
			const possibleEnd = end.clone().add(nextDirection.clone().multiplyScalar(nextLength))
			if (
				possibleEnd.x > -100 &&
				possibleEnd.x < 100 &&
				possibleEnd.y > -50 &&
				possibleEnd.y < 50 &&
				possibleEnd.z < 50
			) {
				nextEnd = possibleEnd
			}
			count++
			if (count > 10) {
				nextEnd = possibleEnd
				break
			}
		}

		setNextEnd(nextEnd)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useFrame(() => {
		if (!pipeRef.current) return

		if (scale < length) {
			setScale(scale + 0.25)
			pipeRef.current.position.copy(start.clone().add(direction.clone().multiplyScalar(scale / 2)))

			const currentEnd = start.clone().add(direction.clone().multiplyScalar(scale))
			if (areVectorComponentsDivisibleBy4(currentEnd)) {
				pointsRef.current.push(roundVector3(currentEnd))
			}
		}
		pipeRef.current.scale.set(1, scale, 1)
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
