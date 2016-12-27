export default message => value => {
  if (Array.isArray(value)) return !!value.length
	const valid = value === undefined || value === null
    ? false
    : !!String(value).length
  return {$invalid: !valid, $messages: valid ? null : [message]}
}
