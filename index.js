var _ = require('lodash');
var Promise = require('bluebird');
var sendgrid = require('sendgrid');
var mustache = require('mustache');

var Sendgrid = function(apiUserOrKey, apiKeyOrOptions, options){
	
	if( !this instanceof Sendgrid ) {
		return new SendgridMustacher(apiUserOrkey, apiKeyOrOptions, options);
	}

	// Just instantiate an sendgrid object
	this.sendgrid = sendgrid(apiUserOrKey, apiKeyOrOptions, options);	
};

Sendgrid.prototype.sendBatch = function(raw, data, callback){
	var self = this;

	return Promise
	.bind(this)
	.return(_.filter(data, 'to')) 
	.map(function(email){
		var rawEmail = new this.sendgrid.Email({
			to: email['to'],
			from: raw['from'],
			subject: raw['subject'],
			text: mustache.render(raw['text'], email),
			html: mustache.render(raw['html'], email)
		});

		return new Promise(function(resolve, reject){
			self.sendgrid.send(rawEmail, function(error, json){
				if(error){
					return reject(error);
				}
				
				json['email'] = rawEmail.to;

				resolve(json);
			});
		});
	
	})
	.nodeify(callback);
};

module.exports = Sendgrid;
