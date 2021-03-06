'use strict';
const
    bodyParser = require('body-parser'),
    config = require('config'),
    request = require('request');
const express = require('express');

const app = express();
const port = process.env.PORT || process.env.PORT || 5000;
app.set('port', port);
app.use(bodyParser.json());

const WEATHER_APP_ID = config.get('weather_app_id');

app.post('/webhook', function(req, res){
    let data = req.body;
    let queryDate = data.queryResult.parameters.date;
    let queryCity = data.queryResult.parameters['geo-city'];
    let propertiesObject = {
        q: queryCity,
        appid: WEATHER_APP_ID,
        units: 'metric'
    };
    request({
        url: 'https://api.openweathermap.org/data/2.5/weather?',
        json: true,
        qs: propertiesObject
    }, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            res.json(
                { 
                    fulfillmentText: queryCity + ' 的天氣 ' + body.weather[0].description + '，' + body.main.temp + ' 度。',
                    fulfillmentMessages: [{
                            "card": {
                                title: queryCity,
                                subtitle: body.weather[0].description,
                                imageUri: "https://openweathermap.org/img/w/" + body.weather[0].icon + '.png',
                                buttons: [
                                    {
                                        text: body.weather[0].description,
                                        postback: "https://openweathermap.org/" 
                                    }
                                ]
                            }
                        }
                    ]
                }
            );
        }else{
            console.log(response.statusCode);
            console.log(response.body.message)
            console.log("OpenWeatherMap faiilleedd ");
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
