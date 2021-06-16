const request = require("request");

const forecast = (latitude, longitude, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=b8e7199d52fe2072a6d4b0b22a27ebd5&query=${longitude},${latitude}&units=f`;

	request({ url, json: true }, (error, {body}) => {
		if (error) {
			callback("Unable to connect to location services!");
		} else if (body.error) {
			callback("Unable to find weather info. Find another search.");
		} else {
			callback(
				undefined,
				`It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out.`
			);
		}
	});
};

module.exports = forecast;
