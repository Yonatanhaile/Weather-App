const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const query = req.body.cityName;
    const apiKey = "03f8258916bbecfaa76f1561f938b90c"; // Consider using environment variables for API keys
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;
   
    https.get(url, function(response){
        if (response.statusCode === 200) {
            response.on("data", function(data){
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                
                // Send successful response
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Weather Results for ${query}</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background: linear-gradient(120deg, #ff6b6b 0%, #4ecdc4 100%);
                                height: 100vh;
                                margin: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            .container {
                                background-color: rgba(255, 255, 255, 0.9);
                                padding: 2rem;
                                border-radius: 15px;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                text-align: center;
                            }
                            h1 {
                                color: #333;
                                margin-bottom: 1rem;
                            }
                            p {
                                color: #555;
                                font-size: 1.2rem;
                                margin-bottom: 0.5rem;
                            }
                            img {
                                width: 100px;
                                height: 100px;
                            }
                            .temp {
                                font-size: 2.5rem;
                                font-weight: bold;
                                color: #ff6b6b;
                            }
                            .button {
                                display: inline-block;
                                padding: 0.5rem 1rem;
                                margin-top: 1rem;
                                font-size: 1rem;
                                color: white;
                                background-color: #ff6b6b;
                                text-decoration: none;
                                border-radius: 5px;
                                transition: background-color 0.3s ease;
                            }
                            .button:hover {
                                background-color: #ff5252;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Weather in ${query}</h1>
                            <img src="${imageUrl}" alt="${weatherDescription}">
                            <p class="temp">${temp}°C</p>
                            <p>${weatherDescription}</p>
                            <a href="/" class="button">Check Another City</a>
                        </div>
                    </body>
                    </html>
                `);
            });
        } else {
            // Send error response for city not found
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Error - City Not Found</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background: linear-gradient(120deg, #ff6b6b 0%, #4ecdc4 100%);
                            height: 100vh;
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .container {
                            background-color: rgba(255, 255, 255, 0.9);
                            padding: 2rem;
                            border-radius: 15px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        h1 {
                            color: #ff6b6b;
                            margin-bottom: 1rem;
                        }
                        p {
                            color: #555;
                            font-size: 1.2rem;
                            margin-bottom: 1rem;
                        }
                        .button {
                            display: inline-block;
                            padding: 0.5rem 1rem;
                            font-size: 1rem;
                            color: white;
                            background-color: #ff6b6b;
                            text-decoration: none;
                            border-radius: 5px;
                            transition: background-color 0.3s ease;
                        }
                        .button:hover {
                            background-color: #ff5252;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Oops! City Not Found</h1>
                        <p>We couldn't find weather data for "${query}". Please check the spelling and try again.</p>
                        <a href="/" class="button">Try Another City</a>
                    </div>
                </body>
                </html>
            `);
        }
    }).on('error', (error) => {
        console.error('Error:', error.message);
        res.status(500).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error - Service Unavailable</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(120deg, #ff6b6b 0%, #4ecdc4 100%);
                        height: 100vh;
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        background-color: rgba(255, 255, 255, 0.9);
                        padding: 2rem;
                        border-radius: 15px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    h1 {
                        color: #ff6b6b;
                        margin-bottom: 1rem;
                    }
                    p {
                        color: #555;
                        font-size: 1.2rem;
                        margin-bottom: 1rem;
                    }
                    .button {
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        font-size: 1rem;
                        color: white;
                        background-color: #ff6b6b;
                        text-decoration: none;
                        border-radius: 5px;
                        transition: background-color 0.3s ease;
                    }
                    .button:hover {
                        background-color: #ff5252;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Oops! Something went wrong</h1>
                    <p>We're having trouble accessing the weather data right now. Please try again later.</p>
                    <a href="/" class="button">Go Back</a>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(3000, function(){
    console.log("Server is on port 3000");
});