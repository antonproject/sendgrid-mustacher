var nock = require('nock');
var SendgridMustacher = require('../index');
var Sendgrid = require('sendgrid');

var default_payload = {
  to            : process.env.TO || "hello@example.com",
  from          : process.env.FROM || "swift@sendgrid.com",
  subject       : "[sendgrid-nodejs] ",
  text          : "This is a text body",
  html          : "<h2>This is an html body</h2>"
};

describe('SendgridMustacher', function(){
	it('should be an instance of SendgridMustacher', function(){
		var sendgridMustacher = new SendgridMustacher(API_USER, API_PASS);
		expect(sendgridMustacher).to.be.an.instanceof(SendgridMustacher);
	});

	it('should work with an username and password', function(){
		var sendgridMustacher = new SendgridMustacher(API_USER, API_PASS);
		expect(sendgridMustacher.sendgrid).to.be.an.instanceof(Sendgrid);
		expect(sendgridMustacher.sendgrid.api_user).to.be.equal(API_USER);
		expect(sendgridMustacher.sendgrid.api_key).to.be.equal(API_PASS);
	});

	it('should work with a username, password, and options', function() {
		var sendgridMustacher = new SendgridMustacher(API_USER, API_PASS, {foo: 'bar'});
		expect(sendgridMustacher.sendgrid).to.be.an.instanceof(Sendgrid);
		expect(sendgridMustacher.sendgrid.api_user).to.equal(API_USER);
		expect(sendgridMustacher.sendgrid.api_key).to.equal(API_PASS);
		expect(sendgridMustacher.sendgrid.options.foo).to.equal('bar');
	});

	it('should work with an api key', function() {
		var sendgridMustacher = new SendgridMustacher(API_KEY);
		expect(sendgridMustacher.sendgrid).to.be.an.instanceof(Sendgrid);
		expect(sendgridMustacher.sendgrid.api_key).to.equal(API_KEY);
		expect(sendgridMustacher.sendgrid.api_user).to.be.null;
	});

	it('should work with an api key and options', function() {
		var sendgridMustacher = new SendgridMustacher(API_KEY, {foo: 'bar'});
		expect(sendgridMustacher.sendgrid).to.be.an.instanceof(Sendgrid);
		expect(sendgridMustacher.sendgrid.api_key).to.equal(API_KEY);
		expect(sendgridMustacher.sendgrid.api_user).to.be.null;
		expect(sendgridMustacher.sendgrid.options.foo).to.equal('bar');
	});

	describe('#sendBatch', function(){
		var payload, mock, webApi, postParams, postParamsString;
		
		beforeEach(function(){
			payload = Object.create(default_payload);

			webApi = nock('https://api.sendgrid.com')
						.filteringRequestBody(function(path){
							postParamsString = path;
							return '*';
						})
						.post('/api/mail.send.json');
		});	

		it('has an optional callback', function(){
			var sendgridMustacher = new SendgridMustacher(API_KEY);
			expect(function(){
				sendgridMustacher.sendBatch({
					from: 'test@example.com',
					subject: 'Just a teste',
					text: 'Just a little test for you, {{name}}'
				}, [{
					to: 'span@example.com',
					name: 'Benjamin'
				}, {
					to: 'inbox@example.com',
					name: 'Lucy'
				}]);
			}).to.not.throw(Error);
		});

		it('should return success if the message is \'success\'', function(){
			var sendgridMustacher = new SendgridMustacher(API_KEY);
			mock = webApi.reply(200, {message: 'success'});

			sendgridMustacher.sendBatch({
				from: 'test@example.com',
				subject: 'Just a teste',
				text: 'Just a little test for you, {{name}}'
			}, [{
				to: 'span@example.com',
				name: 'Benjamin'
			}, {
				to: 'inbox@example.com',
				name: 'Lucy'
			}], function(err, data){
				expect(err).to.be.null;
				expect(data).to.be.an('array');
				expect(data).to.have.length.of.at.most(2);
				expect(data[0]).to.have.property('message');
				expect(data[0]).to.have.property('email');
				expect(data[0]['message']).to.be.equal('Just a little test for you, Benjamin');
				expect(data[0]['email']).to.be.equal('span@example.com');
				expect(data[1]).to.have.property('message');
				expect(data[1]).to.have.property('email');
				expect(data[1]['message']).to.be.equal('Just a little test for you, Benjamin');
				expect(data[1]['email']).to.be.equal('span@example.com');
			});
		});
	
	});



});
