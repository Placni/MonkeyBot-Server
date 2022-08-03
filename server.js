const colors = require('colors');
const express = require('express');

const app = express();
const port = 8000;

app.get('/', (req, res) =>{
    res.send('Balls');
});

app.listen(port, () =>{
    console.log(`App now listening on http://localhost:${port}` .blue);
});