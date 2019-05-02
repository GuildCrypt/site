const static = require('node-static')
const http = require('http')

const file = new static.Server('./', {
  cache: 0
})

http.createServer((request, response) => {
  request.addListener('end', function() {
    file.serve(request, response)
  }).resume();
}).listen(process.env.PORT || 3000)
