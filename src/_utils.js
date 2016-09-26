import consts from './_constants'

const prefixReplace = /%PREFIX%/g

const utils = {
	prefixTemplate(component) {
		console.log(component)
		component.template = component.template.replace(prefixReplace, consts.prefix)
	}
}

export default utils
