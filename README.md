# sendgrid-mustacher
[![Build Status](https://travis-ci.org/antonproject/sendgrid-mustacher.svg)](https://travis-ci.org/antonproject/sendgrid-mustacher) [![Coverage Status](https://coveralls.io/repos/antonproject/sendgrid-mustacher/badge.svg?branch=master)](https://coveralls.io/r/antonproject/sendgrid-mustacher?branch=master)

Send lot emails using Sendgrid and template that using Mustache ;D

## Get Started

```bash

npm install --save sendgrid-mustacher

```

This project help you to send Emails using the powerfull Sendgrid API and template that using the awesome Mustache! 

```javascript

var SendgridMustacher = require('sendgrid-mustacher');

var sendgridMustacher = new SendgridMustacher(API_USER, API_PASSWORD, opts); // You can just use your API_KEY instead API_USER and API_PASSWORD;

sendgridMustacher.sendBBatch({
	from: 'span@example.com',
	subject: 'Awesome email subject',
	text: 'Hello, {{name}}',
	html: '<html><body>Hello, {{name}}</body></html>'
}, [{
	email: 'awesome@mustacher.com',
	name: 'Marcos'
}, {
	email: 'awesome2@mustacher.com',
	name: 'Benjamin'
}], function(err, response){
	if(err){
		throw err;
	}

	console.log(response); // [{ email: 'awesome@mustacher.com', message: 'success'}, { email: 'awesome@mustacher.com', message: 'success'}];
});

```

### SendgridMustacher([api_key || api_user], [api_password || options])
You can instantiate the SendgridMustacher passing the API_USER and API_PASSWORD or just send your API_KEY. All options are available!

### sendBatch(sharedData, contentData [callback]) -> Promise
On the example above you can see all the information passed for the `sendBatch` the email is associated in a set of data, because the custom data are direct for the email.
You can using too a callback or a Promise for resolving this function.

## License
Licensed under the MIT License.
