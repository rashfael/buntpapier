import consts from './_constants'

const prefixReplace = /%PREFIX%/g

const utils = {
	prefixTemplate (component) {
		component.template = component.template.replace(prefixReplace, consts.prefix)
	}
}

export default utils
