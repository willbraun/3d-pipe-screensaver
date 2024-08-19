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

export const areVectorComponentsIntegers = (vector: Vector3) => {
	return Number.isInteger(vector.x) && Number.isInteger(vector.y) && Number.isInteger(vector.z)
}
