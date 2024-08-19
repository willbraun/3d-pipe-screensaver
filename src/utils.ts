import { Vector3 } from 'three'

export const getRandomPerpendicularVector = (direction: Vector3) => {
	const normalizedDir = direction.clone().normalize()
	const arbitraryVec = new Vector3(1, 0, 0)
	if (Math.abs(normalizedDir.dot(arbitraryVec)) > 0.99) {
		arbitraryVec.set(0, 1, 0)
	}

	const perpVec1 = new Vector3().crossVectors(normalizedDir, arbitraryVec).normalize()
	const perpVec2 = new Vector3().crossVectors(normalizedDir, perpVec1).normalize()
	const choices = [perpVec1, perpVec1.clone().negate(), perpVec2, perpVec2.clone().negate()]
	const randomIndex = Math.floor(Math.random() * 4)
	return choices[randomIndex]
}

export const getPerpendicularVectors = (direction: Vector3) => {
	const normalizedDir = direction.clone().normalize()
	const arbitraryVec = new Vector3(1, 0, 0)
	if (Math.abs(normalizedDir.dot(arbitraryVec)) > 0.99) {
		arbitraryVec.set(0, 1, 0)
	}

	const perpVec1 = new Vector3().crossVectors(normalizedDir, arbitraryVec).normalize()
	const perpVec2 = new Vector3().crossVectors(normalizedDir, perpVec1).normalize()
	return [perpVec1, perpVec1.clone().negate(), perpVec2, perpVec2.clone().negate()]
}

export const getPointsInDirection = (base: Vector3, direction: Vector3, points: Vector3[]) => {
	return points.filter(point => {
		const { x, y, z } = direction
		if (x !== 0) return (x === 1 ? point.x > base.x : point.x < base.x) && point.y === base.y && point.z === base.z
		if (y !== 0) return (y === 1 ? point.y > base.y : point.y < base.y) && point.x === base.x && point.z === base.z
		if (z !== 0) return (z === 1 ? point.z > base.z : point.z < base.z) && point.x === base.x && point.y === base.y
		return false
	})
}

export const getClosestPoint = (base: Vector3, pointsInDirection: Vector3[]): Vector3 | undefined => {
	const copy = [...pointsInDirection]
	copy.sort((a, b) => base.distanceTo(a) - base.distanceTo(b))
	return copy[0]

	// return pointsInDirection.reduce((prev, curr) => {
	// 	const prevDistance = base.distanceTo(prev)
	// 	const currDistance = base.distanceTo(curr)
	// 	return prevDistance < currDistance ? prev : curr
	// }, base)
}

const isNearInteger = (num: number): boolean => {
	return Math.abs(num - Math.round(num)) < 1e-4
}

export const areVectorComponentsNearIntegers = (vector: Vector3) => {
	return isNearInteger(vector.x) && isNearInteger(vector.y) && isNearInteger(vector.z)
}

export const roundVector3 = (vector: Vector3) => {
	vector.set(Math.round(vector.x), Math.round(vector.y), Math.round(vector.z))
	return vector
}
