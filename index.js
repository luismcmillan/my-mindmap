import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'pg';
import JsonManager from './managingJSON.js';
import { exec } from 'child_process';

// Pfad zu Ihrer C++-executable Datei
const executablePath = './test'; // oder './myprogram.exe' unter Windows

const { Client } = pkg;// Konfiguration der Verbindung 



const app = express();
const jsonManager = new JsonManager();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Statisches Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

app.get("/Home", (req, res) => {
    console.log("I got called");
    const dataPath = path.join(__dirname, 'public','index.html');
    res.sendFile(dataPath);
    
});

app.get("/update", async(req, res) => {
    let database_data;
    const caPath = path.join(__dirname, '/path/to/eu-central-1-bundle.pem');
    const caCert = await fs.readFile(caPath, 'utf8');

    const client = new Client({ user: 'postgres',
                                host: 'database-1.cva46s8aqjab.eu-central-1.rds.amazonaws.com',
                                database: 'obsidian',
                                password: 'my_database_password',
                                port: 5432,
                                ssl: {
                                    rejectUnauthorized: true,
                                    ca: caCert,
                                }}); //Verbindung herstellen 
    client.connect() .then(() => console.log('Mit der Datenbank verbunden')) .catch(err => console.error('Verbindungsfehler', err.stack)); // Eine einfache Abfrage ausführen 
    client.query('SELECT * FROM topics', (err, res) => { if (err) 
        { 
            console.error(err); 
        } else { 
            const topic_json = jsonManager.createJSONArray(res);
            jsonManager.saveJSONArrayToFile("obsidian.json",topic_json);      
        } // Verbindung beenden 
			client.end();
        });
});



app.get("/new_position", (req, res) => {
    exec(executablePath, (error, stdout, stderr) => {
        if (error) {
            console.error(`Fehler beim Ausführen des Programms: ${error.message}`);
            return;
        }
    
        if (stderr) {
            console.error(`Fehlerausgabe: ${stderr}`);
            return;
        }
    
        // Ausgabe des Programms
        console.log(`Ausgabe: ${stdout}`);
    });
    
});


app.listen(port, () => {
    console.log(`Server running on porrrrt ${port}`);
});

