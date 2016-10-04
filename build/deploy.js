var ghpages = require('gh-pages')
var path = require('path')

ghpages.publish(path.join(__dirname, '../dist'), function(err){
	if(err)
		return console.log(err)
	console.log('UPLOADED')
})
