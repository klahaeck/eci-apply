import formidable from 'formidable';

const form = formidable(); // multiples means req.files will be an array

export default async function parseMultipartForm(req, res, next) {
	const contentType = req.headers['content-type'];
	if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
		form.parse(req, (err, fields, file) => {
      if (!err) {
        req.body = fields; // sets the body field in the request object
        req.file = file.file; // sets the files field in the request object
      }
			next(); // continues to the next middleware or to the route
		});
	} else {
		let rawData = ''
		req.on('data', chunk => rawData += chunk);
		req.on('end', () => {
			const parsedData = JSON.parse(rawData);
			req.body = parsedData;
			next();
		});
	}
}
