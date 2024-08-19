
import fs from 'fs/promises';

export default class jsonManager {
    createJSONArray(topics) {
        let jsonArray = [];
    
        // Iteriere über das Array von Personen und füge jedes JSON-Objekt zum JSONArray hinzu
        for (let i = 0; i < topics.rows.length; i++) {
            let topic = this.createJSONObject(
                                        i,
                                        topics.rows[i]["content_name"],
                                        topics.rows[i]["content"],
                                        topics.rows[i]["category"],
                                        topics.rows[i]["is_boss"],
                                        topics.rows[i]["target_x"],
                                        topics.rows[i]["target_y"],
                                        topics.rows[i]["parents"],
                                        topics.rows[i]["children"]);
            jsonArray.push(topic)
        } 
    
        return jsonArray;
    }
    
    createJSONObject(id,content_name, content, category,is_boss, target_x, target_y,parents,children) {
        // Erstelle ein JSON-Objekt mit den übergebenen Parametern
        let jsonObject = {
            "id": id,
            "name": content_name,
            "category": category,
            "is_boss": is_boss,
            "content": content,
            "target_x": target_x,
            "target_y": target_y,
            "parents": parents,
            "children": children,
        };
    
        // Rückgabe des JSON-Objekts
        return jsonObject;
    }
    
    saveJSONArrayToFile(filename, jsonArray) {
        // Konvertiere das JSONArray in einen JSON-String
        let jsonString = JSON.stringify(jsonArray, null, 2);
    
        // Schreibe den JSON-String in die Datei
        fs.writeFile(filename, jsonString, (err) => {
            if (err) {
                console.error('Fehler beim Schreiben der Datei:', err);
            } else {
                console.log(`Datei erfolgreich als ${filename} gespeichert.`);
            }
        });
    }
}
