#include <emscripten/bind.h>
#include <iostream>
#include <string>
#include <vector>
#include <math.h>

using namespace emscripten;

const double PI = 3.14159;

std::vector<std::string> split(const std::string& str, const std::string& delim)
{
    std::vector<std::string> tokens;
    size_t prev = 0, pos = 0;
    do
    {
        pos = str.find(delim, prev);
        if (pos == std::string::npos) pos = str.length();
        std::string token = str.substr(prev, pos-prev);
        if (!token.empty()) tokens.push_back(token);
        prev = pos + delim.length();
    }
    while (pos < str.length() && prev < str.length());
    return tokens;
}

double countDistance(double lat1, double lat2, double lon1, double lon2){
    double phi1 = (lat1 * PI) / 180;
    double phi2 = (lat2 * PI) / 180;
    double lam1 = (lon1 * PI) / 180;
    double lam2 = (lon2 * PI) / 180;
    /*
     * double dist = 6371.01 *
            acos(
              sin(phi1) * sin(phi2) +
                cos(phi1) * cos(phi2) * cos(lam2 - lam1)
            );

    std::cout << "lat1 " << lat1 << std::endl;
    std::cout << "lon1 " << lon1 << std::endl;
    std::cout << "lat2 " << lat2 << std::endl;
    std::cout << "lon2 " << lon2 << std::endl;
    std::cout << "dist " << dist << std::endl;*/
    return (
          6371.01 *
          acos(
            sin(phi1) * sin(phi2) +
              cos(phi1) * cos(phi2) * cos(lam2 - lam1)
          )
        );
}


int processSpots(std::string spotsStr, double distance = -1.0){
    if(distance == -1.0){
      return -1;
    }
    std::vector<std::vector<double>> parsedVec;
    int count = 0;


    std::vector<std::string> splitted = split(spotsStr, ";");
    for(std::vector<std::string>::size_type i = 0; i < splitted.size(); i++){
        std::string elem = splitted.at(i);
        std::vector<std::string> split2 = split(elem, ",");
        double lat = std::stof(split2.at(0));
        double lon = std::stof(split2.at(1));
        parsedVec.push_back({lat, lon});
    }

    // Populated the vector

    for(std::vector<std::vector<double>>::size_type i = 0; i < parsedVec.size(); i++){
        std::vector<double> element = parsedVec.at(i);
        for(std::vector<double>::size_type j = 0; j < parsedVec.size(); j++){
            std::vector<double> element2 = parsedVec.at(j);
            if( i == j){
                continue;
            }
            if (
              countDistance(
                element.at(0),
                element2.at(0),
                element.at(1),
                element2.at(1)
              ) < distance
            ) {
              count++;

              break;
            }
        }
    }

  return count;
}



int main() {

  int spots = processSpots("20.3433,63.245;20.3133,63.241;21.242,56.34535;20.32,61.23;21.111,60.3312", 500.002);
    std::cout << "Spots from c++ " << spots << std::endl;
  return 0;
}


EMSCRIPTEN_BINDINGS(my_module) {
  function("processSpots", &processSpots);
}