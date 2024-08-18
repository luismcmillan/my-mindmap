#include <iostream>
#include <fstream>
#include "json.hpp"
#include "circle.cpp"
#include <cmath>
#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif
#define canvas_size 1000

using json = nlohmann::json;
const int grid_size = canvas_size / 12.5;
std::vector<std::vector<std::vector<int>>> location(grid_size, std::vector<std::vector<int>>(grid_size));

int sort_position(float pos)
{
    if (pos < canvas_size / 2.0)
    { // < 400
        if (pos < canvas_size / 4.0)
        { // <200
            if (pos < canvas_size / 8.0)
            { // <100
                if (pos < canvas_size / 16.0)
                { // <50
                    if (pos < canvas_size / 32.0)
                    { // <25
                        if (pos < canvas_size / 64.0)
                        {             // <12.5
                            return 0; // 0 < x < 12.5
                        }
                        else
                        {
                            return 1; // 12.5 <= x < 25
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 32.0 + canvas_size / 64.0)
                        {             //< 37.5
                            return 2; // 25 < x < 37.5
                        }
                        else
                        {
                            return 3; // 37.5 <= x < 50
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 16.0 + canvas_size / 32.0)
                    { // <75
                        if (pos < canvas_size / 16.0 + canvas_size / 64.0)
                        {             // <62.5
                            return 4; // 50 < x < 62.5
                        }
                        else
                        {
                            return 5; // 62.5 <= x < 75
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {             //<87.5
                            return 6; // 75 < x < 87.5
                        }
                        else
                        {
                            return 7; // 87.5 <= x < 100
                        }
                    }
                }
            }
            else
            {
                if (pos < canvas_size / 8.0 + canvas_size / 16.0)
                { //<150
                    if (pos < canvas_size / 8.0 + canvas_size / 32.0)
                    { // <125
                        if (pos < canvas_size / 8.0 + canvas_size / 64.0)
                        {             //<112.5
                            return 8; // 100 < x < 112.5
                        }
                        else
                        {
                            return 9; // 112.5 <= x < 125
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 8.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<137.5
                            return 10; // 125 < x < 137.5
                        }
                        else
                        {
                            return 11; // 137.5 <= x < 150
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0)
                    { // <175
                        if (pos < canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 64.0)
                        {              //<162.5
                            return 12; // 150 < x < 162.5
                        }
                        else
                        {
                            return 13; // 162.5 <= x < 175
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              // 187.5
                            return 14; // 175 < x < 187.5
                        }
                        else
                        {
                            return 15; // 187.5 <= x < 200
                        }
                    }
                }
            }
        }
        else
        {
            if (pos < canvas_size / 4.0 + canvas_size / 8.0)
            { // <300
                if (pos < canvas_size / 4.0 + canvas_size / 16.0)
                { // <250
                    if (pos < canvas_size / 4.0 + canvas_size / 32.0)
                    { // <225
                        if (pos < canvas_size / 4.0 + canvas_size / 64.0)
                        {              // 212.5
                            return 16; // 200 < x < 212.5
                        }
                        else
                        {
                            return 17; // 212.5 <= x < 225
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 4.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<237.5
                            return 18; // 225 < x < 237.5
                        }
                        else
                        {
                            return 19; // 237.5 <= x < 250
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 4.0 + canvas_size / 16.0 + canvas_size / 32.0)
                    { // <275
                        if (pos < canvas_size / 4.0 + canvas_size / 16.0 + canvas_size / 64.0)
                        {              //<262.5
                            return 20; // 250 < x < 262.5
                        }
                        else
                        {
                            return 21; // 262.5 <= x < 275
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 4.0 + canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<287
                            return 22; // 275 < x < 287.5
                        }
                        else
                        {
                            return 23; // 287.5 <= x < 300
                        }
                    }
                }
            }
            else
            {
                if (pos < canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0)
                { // <350
                    if (pos < canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 32.0)
                    { // <325
                        if (pos < canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 64.0)
                        {              //<312.5
                            return 24; // 300 < x < 312.5
                        }
                        else
                        {
                            return 25; // 312.5 <= x < 325
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<337.5
                            return 26; // 325 < x < 337.5
                        }
                        else
                        {
                            return 27; // 337.5 <= x < 350
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0)
                    { // <375
                        if (pos < canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 64.0)
                        {
                            return 28; // 350 < x < 362.5
                        }
                        else
                        {
                            return 29; // 362.5 <= x < 375
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<387.5
                            return 30; // 375 < x < 387.5
                        }
                        else
                        {
                            return 31; // 387.5 <= x < 400
                        }
                    }
                }
            }
        }
    }
    else
    { //>400
        if (pos < canvas_size / 2.0 + canvas_size / 4.0)
        { // <600
            if (pos < canvas_size / 2.0 + canvas_size / 8.0)
            { // <500
                if (pos < canvas_size / 2.0 + canvas_size / 16.0)
                { // <450
                    if (pos < canvas_size / 2.0 + canvas_size / 32.0)
                    { // <425
                        if (pos < canvas_size / 2.0 + canvas_size / 64.0)
                        {              //<412.5
                            return 32; // 400 < x < 412.5
                        }
                        else
                        {
                            return 33; // 412.5 <= x < 425
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<437.5
                            return 34; // 425 < x < 437.5
                        }
                        else
                        {
                            return 35; // 437.5 <= x < 450
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 2.0 + canvas_size / 16.0 + canvas_size / 32.0)
                    { // <475
                        if (pos < canvas_size / 2.0 + canvas_size / 16.0 + canvas_size / 64.0)
                        {              //<462.5
                            return 36; // 450 < x < 462.5
                        }
                        else
                        {
                            return 37; // 462.5 <= x < 475
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<487.5
                            return 38; // 475 < x < 487.5
                        }
                        else
                        {
                            return 39; // 487.5 <= x < 500
                        }
                    }
                }
            }
            else
            {
                if (pos < canvas_size / 2.0 + canvas_size / 8.0 + canvas_size / 16.0)
                { // <550
                    if (pos < canvas_size / 2.0 + canvas_size / 8.0 + canvas_size / 32.0)
                    { // <525
                        if (pos < canvas_size / 2.0 + canvas_size / 8.0 + canvas_size / 64.0)
                        {              //<512.5
                            return 40; // 500 < x < 512.5
                        }
                        else
                        {
                            return 41; // 512.5 <= x < 525
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 8.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<537.6
                            return 42; // 525 < x < 537.5
                        }
                        else
                        {
                            return 43; // 537.5 <= x < 550
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 2.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0)
                    { // <575
                        if (pos < canvas_size / 2.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 64.0)
                        {              //<562.5
                            return 44; // 550 < x < 562.5
                        }
                        else
                        {
                            return 45; // 562.5 <= x < 575
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<587.5
                            return 46; // 575 < x < 587.5
                        }
                        else
                        {
                            return 47; // 587.5 <= x < 600
                        }
                    }
                }
            }
        }
        else
        {
            if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0)
            { // <700
                if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 16.0)
                { // <650
                    if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 32.0)
                    { // <625
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 64.0)
                        {              //<612.5
                            return 48; // 600 < x < 612.5
                        }
                        else
                        {
                            return 49; // 612.5 <= x < 625
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<637.5
                            return 50; // 625 < x < 637.5
                        }
                        else
                        {
                            return 51; // 637.5 <= x < 650
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 16.0 + canvas_size / 32.0)
                    { // <675
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 16.0 + canvas_size / 64.0)
                        {              //<662.5
                            return 52; // 650 < x < 662.5
                        }
                        else
                        {
                            return 53; // 662.5 <= x < 675
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<687.5
                            return 54; // 675 < x < 687.5
                        }
                        else
                        {
                            return 55; // 687.5 <= x < 700
                        }
                    }
                }
            }
            else
            {
                if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0)
                { // <750
                    if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 32.0)
                    { // <725
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 64.0)
                        {              //<712.5
                            return 56; // 700 < x < 712.5
                        }
                        else
                        {
                            return 57; // 712.5 <= x < 725
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<737.5
                            return 58; // 725 < x < 737.5
                        }
                        else
                        {
                            return 59; // 737.5 <= x < 750
                        }
                    }
                }
                else
                { //>50
                    if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0)
                    { // <775
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 64.0)
                        {              //<762.5
                            return 60; // 750 < x < 762.5
                        }
                        else
                        {
                            return 61; // 762.5 <= x < 775
                        }
                    }
                    else
                    {
                        if (pos < canvas_size / 2.0 + canvas_size / 4.0 + canvas_size / 8.0 + canvas_size / 16.0 + canvas_size / 32.0 + canvas_size / 64.0)
                        {              //<787.5
                            return 62; // 775 < x < 787.5
                        }
                        else
                        {
                            return 63; // 787.5 <= x < 800
                        }
                    }
                }
            }
        }
    }
    std::cerr << "miau error" << std::endl;
    return -1;
}

void calculate_new_position(std::vector<std::vector<int>> matrix, std::vector<Circle> circles, std::unordered_map<std::string, int> name_id)
{
    std::cerr << "x " + circles[36].name << circles[36].x << std::endl;
    std::cerr << "y " + circles[36].name << circles[36].y << std::endl;
    for (int i = 0; i < matrix.size(); i++)
    {
        for (int j = 0; j < matrix.size(); j++)
        {
            if (matrix[j][i] == 1)
            {
                Circle a = circles[i];
                Circle b = circles[j];
                a.follow(b);
                b.follow(a);
                circles[name_id[a.name]] = a;
                circles[name_id[b.name]] = b;
            }
        }
    }
}

int main()
{
    
    std::ifstream file("obsidian.json");
    if (!file.is_open())
    {
        std::cerr << "Error opening file" << std::endl;
        return 1;
    }

    json circle_json;
    file >> circle_json;
    int circles_size = circle_json.size();
    std::vector<Circle> circles;
    std::unordered_map<std::string, int> name_id;

    for (int i = 0; i < grid_size; i++)
    {
        for (int j = 0; j < grid_size; j++)
        {
            std::vector<int> circles_at_x_y;
            location[i][j] = circles_at_x_y;
        }
    }

    // Create all topics/circles
    float angle = 0.0;
    float x_pos = 0.0;
    float y_pos = 0.0;
    int district_x = -1;
    int district_y = -1;
    int old_district_x = -1;
    int old_district_y = -1;
    for (int i = 0; i < circle_json.size(); i++)
    {
        name_id[circle_json[i]["name"]] = circle_json[i]["id"];
        angle = i / ((float)circles_size);
        x_pos = canvas_size / 2.0 + canvas_size * 0.45 * std::sin(angle * 2.0 * M_PI);
        y_pos = canvas_size / 2.0 + canvas_size * 0.45 * std::cos(angle * 2.0 * M_PI);
        district_x = sort_position(x_pos);
        district_y = sort_position(y_pos);
        location[district_x][district_y].emplace_back(circle_json[i]["id"]);
        Circle myCircle(circle_json[i]["id"],circle_json[i]["category"], circle_json[i]["name"], x_pos, y_pos, district_x, district_y, circle_json[i]["content"]);
        circles.emplace_back(myCircle);
    }

    // Define all Connections between topics/circles
    for (Circle circle : circles)
    {
        for (int i = 0; i < circle_json[circle.id]["children"].size(); i++)
        {
            circle.child_links.emplace_back(circles[name_id[circle_json[circle.id]["children"][i]]]);
        }
        for (int i = 0; i < circle_json[circle.id]["parents"].size(); i++)
        {
            circle.parent_links.emplace_back(circles[name_id[circle_json[circle.id]["parents"][i]]]);
        }
        circles[circle.id] = circle;
    }
    // Declaration of Connectivity matrix
    std::vector<std::vector<int>> matrix(circles_size, std::vector<int>(circles_size, 0));
    for (Circle circle : circles)
    {
        for (Circle child : circle.child_links)
        {
            matrix[circle.id][name_id[child.name]] = 1;
        }
    }




    float sum_x = 0.0;
    float sum_y = 0.0;
    int follow_count = 0;
    std::vector<int> local;
    std::vector<int> local2;
    int iteration = 0;
    while (iteration < 2000)
    {
        iteration++;
        // calculate_new_position(matrix, circles, name_id);
        //std::cerr << "x " + circles[86].name << circles[86].district_x << std::endl;
        //std::cerr << "y " + circles[86].name << circles[86].district_y << std::endl;
        for (int i = 0; i < matrix.size(); i++)
        {
            sum_x = 0.0;
            sum_y = 0.0;
            follow_count = 0;
            for (int j = 0; j < matrix.size(); j++)
            {
                if (matrix[i][j] == 1)
                {
                    follow_count++;
                    sum_x += circles[j].x;
                    sum_y += circles[j].y;
                }
            }
            //following Part
            if (follow_count > 0)
            {
                circles[i].follow(sum_x/follow_count, sum_y/follow_count);
                old_district_x = circles[i].district_x;
                old_district_y = circles[i].district_y;
                district_x = sort_position(circles[i].x);
                district_y = sort_position(circles[i].y);
                circles[i].district_x = district_x;
                circles[i].district_y = district_y;
                local = location[old_district_x][old_district_y];
                auto it = std::find(local.begin(), local.end(), circles[i].id);
                if (it != local.end())
                {
                    local.erase(it);
                }
                location[old_district_x][old_district_y] = local;
                location[district_x][district_y].emplace_back(circles[i].id);
            }
            
            sum_x = 0.0;
            sum_y = 0.0;
            local.empty();
            for(int x = district_x-2; x < district_x+3;x++){
                for(int y = district_y-2; y < district_y+3;y++){
                    if(y >= 0 && y < grid_size && x >= 0 && x < grid_size){
                        local2 = location[x][y];
                        local.insert(local.end(), local2.begin(), local2.end());
                    }
                } 
            } 
            //std::cerr << "size" << local.size() << std::endl;
            
            for(int j = 0;j < local.size(); j++){
                sum_x += circles[local[j]].x;
                sum_y += circles[local[j]].y;
            }
            if (local.size() > 1){
                circles[i].keep_distance_to(sum_x/local.size(),sum_y/local.size());
                old_district_x = circles[i].district_x;
                old_district_y = circles[i].district_y;
                district_x = sort_position(circles[i].x);
                district_y = sort_position(circles[i].y);
                circles[i].district_x = district_x;
                circles[i].district_y = district_y;
                local = location[old_district_x][old_district_y];
                auto it = std::find(local.begin(), local.end(), circles[i].id);
                if (it != local.end())
                {
                    local.erase(it);
                }
                location[old_district_x][old_district_y] = local;
                location[district_x][district_y].emplace_back(circles[i].id);
            }
            
            
            
        }

        /*
        int sum =0;
        
        for (int i = 0; i < grid_size; i++)
        {
            for (int j = 0; j < grid_size; j++)
            {
                sum += location[i][j].size();
            }
        }
        std::cerr << sum << std::endl;
        */
    }
    

    // Übergeordnetes JSON-Objekt erstellen und die Dokumente hinzufügen
    nlohmann::json jsonObj;
    
    for(int i = 0; i < circles.size(); i++){
        nlohmann::json jsonDoc;
        jsonDoc["name"] = circles[i].name;
        jsonDoc["id"] = circles[i].id;
        jsonDoc["category"] = circles[i].category;
        jsonDoc["x_pos"] = circles[i].x;
        jsonDoc["y_pos"] = circles[i].y;
        
        std::vector<std::string> child_array;
        for(int j = 0; j < circles[i].child_links.size(); j++){
            child_array.emplace_back(circles[i].child_links[j].name);
        }   
        jsonDoc["children"] = child_array;
        std::vector<std::string> parent_array;
        for(int j = 0; j < circles[i].parent_links.size(); j++){
            parent_array.emplace_back(circles[i].parent_links[j].name);
        }
        jsonDoc["parents"] = parent_array;
        jsonDoc["content"] = circles[i].content;
        jsonObj[i] = jsonDoc;
    }

    
    // JSON-Daten in eine Datei schreiben
    std::ofstream datei("public/obsidian_with_position.json");
    if (!datei) {
        std::cerr << "Fehler beim Öffnen der Datei!" << std::endl;
        return 1; // Rückgabewert 1 signalisiert einen Fehler
    }
    datei << jsonObj.dump(2) << std::endl;
    datei.close();
    std::cout << "Text wurde erfolgreich in die Datei geschrieben." << std::endl;
    return 0;
}
