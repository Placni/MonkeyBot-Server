require('dotenv').config();
const { connect, pushTokens} = require('./mongo/mongo');
const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const request = require('request');


async function main(){   

    // Await connection to mongoDB
    const con = await connect() ? console.log('Connected to mongo' .green) : console.log('Error connecting to mongo' .red);

    // Build https app
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    const options = {
        key: fs.readFileSync('./certs/cert.key'),
        cert: fs.readFileSync('./certs/cert.crt')
    }

    // Useless splash page
    app.get('/', (req, res) => {
        console.log(`New req to /` .red);
        res.send(`You've reached monkeybot o7`);
    });

    // Handle oauth requests
    app.get('/oauth', (req, res) => {

        // Check for valid query from oauth
        if (!req.query?.code || !req.query?.state) return res.send('Invalid code and/or state. Please try again');
        let discordid = req.query.state
        let code = req.query.code

        // Build POST request to Bungie
        // Auth string locally encoded using env vals. It is comprised of your client_id and client_secret
        // btoa() is a deprecated function but it is simple and works
        const auth = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
        var postopts = {
        method: 'POST',
        url: 'https://www.bungie.net/platform/app/oauth/token/',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
        },
        form: {
            'grant_type': 'authorization_code',
            'code': code
        }};

        // Send POST request
        request(postopts, (error, res2) => {
            if (error) throw new Error(error);
            let info = JSON.parse(res2?.body);
            
            // Check response from Bungie
            if (!info?.access_token || !info?.refresh_token || !info?.membership_id) return res.send('Invalid response from bungo D:');
            
            // Push info to mongoDB
            let r = pushTokens(discordid, info.access_token, info.refresh_token, info.membership_id)
            if (!r) return res.send('Error occured pushing to database, please yell and Myssto and try again');
            return res.send('Successfully authorized Monkeybot');
        });
    });
    
    const port = 8000;
    https.createServer(options, app).listen(port, () => {
        console.log(`Server listening on https://127.0.0.1:${port}`)
    });
}
main();