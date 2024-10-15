import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion, AnimatePresence } from 'framer-motion';

const divorceData = {
  India: 1.1,
  Nepal: 0.7,
  Pakistan: 0.9,
  Bangladesh: 0.8,
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const colorScale = scaleLinear()
  .domain([0, 1.5])
  .range(["#e6f2ff", "#0066cc"]);

const comparisonColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

function DivorceMap() {
  const [selectedCountries, setSelectedCountries] = useState([]);

  const handleCountryClick = (countryName) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryName)) {
        return prev.filter(c => c !== countryName);
      } else if (prev.length < 5) {
        return [...prev, countryName];
      }
      return prev;
    });
  };

  return (
    <div className="w-full h-screen bg-blue-50 p-4 md:p-8 flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">Divorce Rates Comparison</h1>
      <div className="flex-grow relative bg-white rounded-lg shadow-md overflow-hidden">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 220 }}>
          <ZoomableGroup center={[85, 25]} zoom={4}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const isRelevant = countryName in divorceData;
                  const selectedIndex = selectedCountries.indexOf(countryName);
                  const isSelected = selectedIndex !== -1;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isSelected ? comparisonColors[selectedIndex] : (isRelevant ? colorScale(divorceData[countryName]) : "#F5F4F6")}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: isSelected ? comparisonColors[selectedIndex] : "#90CDF4" },
                        pressed: { outline: "none" },
                      }}
                      onClick={() => isRelevant && handleCountryClick(countryName)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <AnimatePresence>
          {selectedCountries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-h-[40%] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-blue-800 mb-2">Country Comparison</h2>
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((country, index) => (
                  <motion.div
                    key={country}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 min-w-[120px] p-2 rounded-lg"
                    style={{ backgroundColor: comparisonColors[index] }}
                  >
                    <h3 className="text-lg font-semibold text-white">{country}</h3>
                    <p className="text-white">
                      Rate: {divorceData[country]} per 1000
                    </p>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
                onClick={() => setSelectedCountries([])}
              >
                Clear All
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DivorceMap;