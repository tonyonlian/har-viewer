var finalhandler = require('finalhandler'),
	http = require('http'),
	serveStatic = require('serve-static'),
	program = require('commander'),
	fs = require('fs'),
	Handlebars = require('handlebars'),
	serve = serveStatic('public'),
	server = http.createServer(function(req, res){
		var done;

		if (req.url === '/') {
			fs.readFile('./templates/index.hbs', function (err, content) {
				var template;

				if (err) {
					console.log(err);
				} else {
					template = Handlebars.compile(content.toString());
					res.writeHead(200, {
						'Content-Type': 'text/html' + '; charset=UTF-8'
					});
					res.write(template({
						config: config
					}));
					res.end();
				}
			});
		} else if (req.url === '/config') {
			res.writeHead(200, {
				'Content-Type': 'application/json' + '; charset=UTF-8'
			});
			res.write(config);
			res.end();
		} else {
			done = finalhandler(req, res);
			serve(req, res, done);
		}
	}),
	config = '';

program
	.version('0.0.1')
	.option('-c, --config [value]', 'Set config path')
	.parse(process.argv);

if (program.config) {
	fs.readFile(program.config, function (err, content) {
		if (err) {
			console.log(err);
		} else {
			config = content.toString();
			server.listen(3000);
		}
	});
} else {
	server.listen(3000);
}