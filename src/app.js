const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const PORT = process.env.PORT || 3000;

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
	res.render("index", {
		title: "Weather",
		name: "David Hernandez"
	});
});

app.get("/about", (req, res) => {
	res.render("about", {
		title: "About Me",
		name: "David Hernandez"
	});
});

app.get("/help", (req, res) => {
	res.render("help", {
		message: "Let me in!!!",
		title: "Help",
		name: "David Hernandez"
	});
});

// weather
app.get("/weather", (req, res) => {
	const lookupAddress = req.query.address;
	if (!lookupAddress) {
		return res.send({
			error: "You must provide an address"
		});
	} 
	geocode(
		lookupAddress,
		(error, { latitude, longitude, location } = {}) => {
			if (error) {
				return res.send({
					error,
					errorMsg: "Error occurred while fetching coordinates"
				});
			}
			forecast(longitude, latitude, (error, forecastData) => {
				if (error) {
					return res.send({
						error,
						errorMsg: "Error occurred while fetching forecast"
					});
				}
				res.send({
					forecast: forecastData,
					location,
					address: lookupAddress
				});
			});
		}
	);
});

// products
app.get("/products", (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: "You must provide a search term"
		});
	}
	console.log(req.query);
	res.send({
		products: []
	});
});

app.get("/help/*", (req, res) => {
	res.render("404page", {
		title: "404",
		name: "David Hernandez",
		errorMessage: "Help article not found"
	});
});

// 404 page
app.get("*", (req, res) => {
	res.render("404page", {
		title: "404",
		name: "David Hernandez",
		errorMessage: "Page not found"
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on Port ${PORT}`);
});
