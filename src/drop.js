import consts from './_constants'
import Drop from 'tether-drop'

const BuntDrop = Drop.createContext({
	classPrefix: `${consts.prefix}-drop`
})

export default BuntDrop
