import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'pg';
import JsonManager from './managingJSON.js';
import { exec } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

// Pfad zur C++-Executable-Datei
const executablePath = './position_calculation'; // oder './myprogram.exe' unter Windows

const { Client } = pkg;
const app = express();
const jsonManager = new JsonManager();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Statisches Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Route für die Startseite
app.get("/Home", (req, res) => {
    console.log("I got called");
    const dataPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(dataPath);
});

// Route zum Aktualisieren der Daten
app.get("/update", async (req, res) => {
    let client;
    try {
        const caPath = path.join(__dirname, '/path/to/eu-central-1-bundle.pem');
        const caCert = await fs.readFile(caPath, 'utf8');
        
        client = new Client({
            user: process.env.DB_USERNAME,
            host: process.env.DB_DOMAIN,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD, 
            port: 5432,
            ssl: {
                rejectUnauthorized: true,
                ca: caCert,
            }
        });

        await client.connect();
        console.log('Mit der Datenbank verbunden');

        const result = await client.query('SELECT * FROM topics');
        const topic_json = jsonManager.createJSONArray(result);
        
        await jsonManager.saveJSONArrayToFile("public/obsidian.json", topic_json);

        res.send('Daten aktualisiert');
    } catch (err) {
        console.log(err);
        console.error('Fehler beim Abrufen der Daten:', err);
        res.status(500).send('Fehler beim Abrufen der Daten');
    } finally {
        client.end();
    }
});

// Route für neue Position
app.get("/new_position", (req, res) => {
    exec(executablePath, (error, stdout, stderr) => {
        if (error) {
            console.error(`Fehler beim Ausführen des Programms: ${error.message}`);
            res.status(500).send('Fehler beim Ausführen des Programms');
            return;
        }

        if (stderr) {
            console.error(`Fehlerausgabe: ${stderr}`);
            res.status(500).send('Fehlerausgabe des Programms');
            return;
        }

        console.log(`Ausgabe: ${stdout}`);
        res.send(`Ausgabe: ${stdout}`);
    });
});

// Server starten
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});