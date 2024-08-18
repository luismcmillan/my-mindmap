#include "config.h"
#include <vector>
#include <cmath>
#include <string>
#include <iostream>

class Circle {
public:
    int id;
    std::string category;
    std::string name;
    float x, y;
    int district_x, district_y;
    float vx, vy;
    float radius;
    std::string content;
    std::string color;
    bool dragging;
    bool hovered;
    float attraction;
    float rejection;
    std::vector<Circle> parent_links;
    std::vector<Circle> child_links;

    Circle(int id, std::string category,std::string name, float x, float y, float district_x, float district_y,std::string content)
        : id(id), category(category),name(name), x(x), y(y), district_x(district_x), district_y(district_y),content(content),
          vx(2), vy(2), color("grey"), dragging(false), hovered(false)
    {
        // These values would be retrieved from a GUI element in JavaScript
        float gravityValue = 10; // Placeholder value
        float rejectionValue = 10; // Placeholder value
        int radius =25;
        attraction = 800 / gravityValue;
        rejection = rejectionValue / 100 * attraction;
    }


    void follow(Circle parent) {
        float distance = std::sqrt((parent.x - this->x) * (parent.x - this->x) + (parent.y - this->y) * (parent.y - this->y));
        if (distance > attraction) {
            this->x = set_position(this->x - this->vx * ((this->x - parent.x) / (std::abs(this->x - parent.x) + std::abs(this->y - parent.y))));
            this->y = set_position(this->y - this->vy * ((this->y - parent.y) / (std::abs(this->x - parent.x) + std::abs(this->y - parent.y))));
        } else if (distance < rejection) {
            this->x = set_position(this->x + this->vx * ((this->x - parent.x) / (std::abs(this->x - parent.x) + std::abs(this->y - parent.y))));
            this->y = set_position(this->y + this->vy * ((this->y - parent.y) / (std::abs(this->x - parent.x) + std::abs(this->y - parent.y))));
        }
    }

    void follow(float pos_x, float pos_y) {
        float distance = std::sqrt((pos_x - this->x) * (pos_x - this->x) + (pos_y - this->y) * (pos_y - this->y));
        if (distance > attraction) {
            this->x = set_position(this->x - this->vx * ((this->x - pos_x) / (std::abs(this->x - pos_x) + std::abs(this->y - pos_y))));
            this->y = set_position(this->y - this->vy * ((this->y - pos_y) / (std::abs(this->x - pos_x) + std::abs(this->y - pos_y))));
        } else if (distance < rejection) {
            this->x = set_position(this->x + this->vx * ((this->x - pos_x) / (std::abs(this->x - pos_x) + std::abs(this->y - pos_y))));
            this->y = set_position(this->y + this->vy * ((this->y - pos_y) / (std::abs(this->x - pos_x) + std::abs(this->y - pos_y))));
        }
    }

    void keep_distance_to(Circle neighbor) {
        float distance = std::sqrt((neighbor.x - this->x) * (neighbor.x - this->x) + (neighbor.y - this->y) * (neighbor.y - this->y));
        if (distance < 50.0) {
            this->x = set_position(this->x + this->vx * ((this->x - neighbor.x) / (std::abs(this->x - neighbor.x) + std::abs(this->y - neighbor.y))));
            this->y = set_position(this->y + this->vy * ((this->y - neighbor.y) / (std::abs(this->x - neighbor.x) + std::abs(this->y - neighbor.y))));
        }
    }

    void keep_distance_to(float pos_x, float pos_y) {
        float distance = std::sqrt((pos_x - this->x) * (pos_x - this->x) + (pos_y - this->y) * (pos_y - this->y));
        if (distance < 50.0) {
            this->x = set_position(this->x + 0.1*this->vx * ((this->x - pos_x) / (std::abs(this->x - pos_x) + std::abs(this->y - pos_y))));
            this->y = set_position(this->y + 0.1*this->vy * ((this->y - pos_y) / (std::abs(this->x - pos_x) + std::abs(this->y - pos_y))));
        }
    }

    bool isPointInside(float px, float py) {
        float dx = px - x;
        float dy = py - y;
        hovered = dx * dx + dy * dy <= radius * radius;
        return hovered;
    }

    float set_position(float target){
        if(target < 0.0){
            return 75.0;
        }else if(target > canvas_size){
            return canvas_size-75.0;
        }else{
            return target;
        }
    }

    void change_circle_gravity(float gravityValue) {
        attraction = 800 / gravityValue;
    }

    void change_circle_rejection(float rejectionValue) {
        rejection = rejectionValue / 100 * attraction;
    }

    void change_circle_size(float newSize) {
        radius = newSize * (10 + child_links.size()) / 10;
    }

    std::vector<Circle> get_child_links() {
        return child_links;
    }

    void change_child_links(std::vector<Circle> links) {
        child_links = links;
    }

    void change_parent_links(std::vector<Circle> links) {
        parent_links = links;
    }

    std::string give_content() {
        return content;
    }

    std::string give_miau() {
        return "miau";
    }
};
