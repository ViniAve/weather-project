import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const geoAPI = "http://api.openweathermap.org/geo/1.0/direct?";
const dataAPI = "https://api.openweathermap.org/data/2.5/weather?";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/submit", async (req, res) => {
    try {
        const location = await axios.get(geoAPI, {
            params: {
                q: req.body.city,
                appid: apiKey
            }
        });
        const weather = await axios.get(dataAPI, {
            params: {
                lat: location.data[0].lat,
                lon: location.data[0].lon,
                appid: apiKey,
                units: "metric"
            }
        });
        res.render("index.ejs", {
            data: weather.data
        });
    } catch (error) {
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});