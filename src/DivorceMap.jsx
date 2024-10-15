import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Gavel, Users, Home, X, Scale } from 'lucide-react';

import divorceData from './utils/divorceData.json'

import gif from './bg.jpeg'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const colorScale = scaleLinear()
  .domain([0, 1])
  .range(["#E6F3FF", "#90CDF4"]); // Light blue to slightly darker blue

const selectedColorScale = scaleLinear()
  .domain([0, 1])
  .range(["#FFE0B2", "#FFAB40"]); // Light orange to slightly darker orange

const topics = [
  { key: 'marriageRegistration', icon: FileText, color: 'blue' },
  { key: 'divorceJurisdiction', icon: Gavel, color: 'red' },
  { key: 'childCustody', icon: Users, color: 'green' },
  { key: 'propertyDivision', icon: Home, color: 'yellow' },
];

function DivorceMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    if (selectedCountry && !selectedTopic) {
      setSelectedTopic('marriageRegistration');
    }
  }, [selectedCountry, selectedTopic]);

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName in divorceData ? countryName : null);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleClose = () => {
    setSelectedCountry(null);
    setSelectedTopic(null);
  };

  const getButtonStyles = (color, isSelected) => {
    const baseStyles = "p-3 rounded-full transition-all duration-200 ";
    const colorStyles = {
      blue: isSelected ? "bg-blue-200 shadow-lg ring-4 ring-blue-300 ring-opacity-50" : "bg-blue-100 hover:bg-blue-200",
      red: isSelected ? "bg-red-200 shadow-lg ring-4 ring-red-300 ring-opacity-50" : "bg-red-100 hover:bg-red-200",
      green: isSelected ? "bg-green-200 shadow-lg ring-4 ring-green-300 ring-opacity-50" : "bg-green-100 hover:bg-green-200",
      yellow: isSelected ? "bg-yellow-200 shadow-lg ring-4 ring-yellow-300 ring-opacity-50" : "bg-yellow-100 hover:bg-yellow-200",
    };
    return baseStyles + colorStyles[color];
  };

  const getIconStyles = (color) => {
    const colorStyles = {
      blue: "text-blue-600",
      red: "text-red-600",
      green: "text-green-600",
      yellow: "text-yellow-600",
    };
    return colorStyles[color];
  };

  const getHeaderStyles = (color) => {
    const colorStyles = {
      blue: "text-blue-600",
      red: "text-red-600",
      green: "text-green-600",
      yellow: "text-yellow-600",
    };
    return `text-xl font-semibold ${colorStyles[color]} mb-2`;
  };

  return (
    <div className="w-full h-screen bg-blue-50 p-4 md:p-8 flex flex-col">
      <header className="mb-8 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <Scale size={36} className="text-blue-600 mr-2" />
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
            Geographical Divorce Laws
          </h1>
        </div>
        <p className="text-blue-600 text-center max-w-2xl">
          Explore divorce laws across different countries. Click on a highlighted country to learn more.
        </p>
      </header>
      <div className="flex-grow relative bg-white rounded-lg shadow-md overflow-hidden">
        <motion.div
          animate={{ x: selectedCountry ? -200 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-full"
          style={{
            backgroundImage: `url(${gif})`, // Add your ocean image here
            backgroundSize: "cover",  // Cover the container fully
            backgroundPosition: "center",  // Center the background image
          }}
        >
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 220 }}>
            <ZoomableGroup center={[85, 15]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const isRelevant = countryName in divorceData;
                    const isSelected = countryName === selectedCountry;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isRelevant ? (isSelected ? selectedColorScale(1) : colorScale(1)) : "#F5F4F6"}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: isRelevant ? (isSelected ? "#FFCC80" : "#64B5F6") : "#E0E0E0" },
                          pressed: { outline: "none" },
                        }}
                        onClick={() => handleCountryClick(countryName)}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </motion.div>
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              key={selectedCountry}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 w-[300px] h-full bg-gray-100 bg-opacity-100 p-6 overflow-y-auto shadow-lg rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCountry}</h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <hr className="border-t border-gray-300 mb-4" />
              <AnimatePresence mode="wait">
                  <motion.div
                    key={'marriageRegistration'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={getHeaderStyles(topics.find(t => t.key === 'marriageRegistration').color)}
                    >
                      {'marriageRegistration'.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="text-gray-600"
                    >
                      {divorceData[selectedCountry]['marriageRegistration']}
                    </motion.p>
                  </motion.div>
              </AnimatePresence>
              <hr className="border-t border-gray-300 mb-4 mt-4" />
              <AnimatePresence mode="wait">
                  <motion.div
                    key={'divorceJurisdiction'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={getHeaderStyles(topics.find(t => t.key === 'divorceJurisdiction').color)}
                    >
                      {'divorceJurisdiction'.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="text-gray-600"
                    >
                      {divorceData[selectedCountry]['divorceJurisdiction']}
                    </motion.p>
                  </motion.div>
              </AnimatePresence>
              <hr className="border-t border-gray-300 mb-4 mt-4" />
              <AnimatePresence mode="wait">
                  <motion.div
                    key={'childCustody'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={getHeaderStyles(topics.find(t => t.key === 'childCustody').color)}
                    >
                      {'childCustody'.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="text-gray-600"
                    >
                      {divorceData[selectedCountry]['childCustody']}
                    </motion.p>
                  </motion.div>
              </AnimatePresence>
              <hr className="border-t border-gray-300 mb-4 mt-4" />
              <AnimatePresence mode="wait">
                  <motion.div
                    key={'propertyDivision'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={getHeaderStyles(topics.find(t => t.key === 'propertyDivision').color)}
                    >
                      {'propertyDivision'.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="text-gray-600"
                    >
                      {divorceData[selectedCountry]['propertyDivision']}
                    </motion.p>
                  </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DivorceMap;