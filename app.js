const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require("cors");
// const loadStitches = require("./public/script")
//import loadStitches from './public/script';




const app = express();
const port = 3000;

app.use(cors());

// Serve static files like CSS and JS
app.use(express.static(path.join(__dirname, 'docs')));
app.use(express.static(path.join(__dirname, 'docs/data')));

app.get('/read-csv', (req, res) => {
    const results = [];

    fs.createReadStream(path.join(__dirname, 'data', 'stitches.csv')) // Make sure to place the CSV file in the data folder
        .pipe(csv()) // Parse CSV content
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.table(results);
            loadStitches(results);
            res.json(results); // Send parsed data as JSON to the client-side
        });
});

// Serve the HTML page
// app.get('/', (req, res) => {
//     const results = [];
//     const script = require('./public/script');
//     return new Promise((resolve, reject) => {
//         fs.createReadStream(path.join(__dirname, 'data', 'stitches.csv')) // Make sure to place the CSV file in the data folder
//             .on('error', error => {
//                 console.log(error)
//                 reject(error);
//             }).pipe(csv()) // Parse CSV content
//             .on('data', (data) => {
//                 console.table(data);
//                 results = results.push(data)
//             })
//             .on('end', () => {
//                 console.table(results);
//                 console.log("hola")
//                 script.loadStitches(results);
//                 res.json(results); // Send parsed data as JSON to the client-side
//                 resolve(data)
//             });
//         res.sendFile(path.join(__dirname, 'public', 'index.html'));
//     });

// });

app.post('/loadStitches', (req, res) => {
    let dropDown = document.getElementById("choose-sel");
    if (dropDown.getElementsByTagName("option").length != 1) {
        const results = [];
        fs.createReadStream(path.join(__dirname, 'data', 'stitches.csv')) // Make sure to place the CSV file in the data folder
            .pipe(csv()) // Parse CSV content
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // res.json(results); // Send parsed data as JSON to the client-side
                res.json(results);
                // for (const stitch in results) {
                //     let opt = document.createElement('option');
                //     opt.value = stitch[1];
                //     opt.innerHTML = stitch[0];
                //     if (Object.prototype.hasOwnProperty.call(results, stitch)) {
                //         const element = results[stitch];

                //     }
                // }
            });
    }
});

app.get('/csv', (req, res) => {
    const filePath = path.join(__dirname, 'docs', 'stitches.csv');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading CSV file: ' + err);
        }
        //console.log(data);
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
