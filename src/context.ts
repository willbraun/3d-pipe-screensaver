import { createContext } from 'react'
import { Vector3 } from 'three'

interface PointsContextProps {
	points: Vector3[]
	setPoints: React.Dispatch<React.SetStateAction<Vector3[]>>
}

export const PointsContext = createContext<PointsContextProps>({ points: [], setPoints: () => {} })
