require.paths.unshift('./node_modules');

var fs = require('fs'),
		sys = require('sys'),
		url = require('url'),
		http = require('http'),
		path = require('path'),
		mime = require('mime');

var httpServer = http.createServer( function(request, response) {
		var pathname = url.parse(request.url).pathname;
		
		if (pathname === "/twitauth") {
		  response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Twit Auth\n');
      return;
		} 
		else if (pathname === '/twitoauth') {
		  var oauth, options;

      options = {
          enablePrivilege: true,
          consumerKey: 'PGBu2k8KvqBVPfNnvO2OwA',
          consumerSecret: 'utkM9i16BeaN5u3AE0m6MFf7oTg9ZiA62xCKgfIYo'
      };

      oauth = OAuth(options);
      
      oauth.get('https://api.twitter.com/oauth/request_token', function (data) {
           console.log(data);
         });
		}
		
		if (pathname === "/") {
		  pathname = "index.html";
	  }
		var filename = path.join(process.cwd(), 'public', pathname);

		path.exists(filename, function(exists) {
				if (!exists) {
					response.writeHead(404, {"Content-Type": "text/plain"});
						response.write("404 Not Found");
						response.end();
						return;
				}

				response.writeHead(200, {'Content-Type': mime.lookup(filename)});
				fs.createReadStream(filename, {
						'flags': 'r',
						'encoding': 'binary',
						'mode': 0666,
						'bufferSize': 4 * 1024
				}).addListener("data", function(chunk) {
						response.write(chunk, 'binary');
				}).addListener("close",function() {
						response.end();
				});
		});
});


//var server = ws.createServer({server: httpServer});

httpServer.listen(process.env.VMC_APP_PORT || 8000);
console.log('Server listening on port ' + (process.env.VMC_APP_PORT || 8000));
