import React, { useEffect, useState } from "react";
import WorldMap from "react-svg-worldmap";
import { scaleQuantize } from "d3-scale";

// ISO2 country codes for react-svg-worldmap
const countryNameToISO2 = {
  India: "IN",
  United_States: "US",
  Canada: "CA",
  Brazil: "BR",
  "United Kingdom": "GB",
  Germany: "DE",
  // add more countries as needed...
};

function aggregateClicksByCountry(clicks) {
  const counts = {};

  clicks.forEach(({ country }) => {
    if (!country) return;

    const isoCode = countryNameToISO2[country];
    if (!isoCode) return;

    counts[isoCode] = (counts[isoCode] || 0) + 1;
  });

  // convert to array for react-svg-worldmap
  return Object.entries(counts).map(([country, value]) => ({
    country,
    value,
  }));
}

function GeoChoroplethMap({ clicks }) {
  const [geoData, setGeoData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (clicks) {
      const data = aggregateClicksByCountry(clicks);
      setGeoData(data);
    }
  }, [clicks]);

  // d3 scale to color intensity
  const colorScale = scaleQuantize()
    .domain([0, Math.max(1, ...geoData.map((d) => d.value))])
    .range([
      "#e0f3f8",
      "#a6bddb",
      "#74a9cf",
      "#3690c0",
      "#0570b0",
      "#034e7b",
    ]);

  // helper: find clicks by countryCode
  const getClicksForCountry = (countryCode) => {
    const entry = geoData.find((d) => d.country === countryCode);
    return entry ? entry.value : 0;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className=" h-[300px]">
        <WorldMap
          color="#0570b0"
          valueSuffix=" clicks"
          size="responsive"
          data={geoData}
          styleFunction={(context) => {
            const value = context.countryValue || 0;
            return {
              fill: value ? colorScale(value) : "#EEE",
              stroke: "black",
              strokeWidth: 0.5,
              outline: "none",
              cursor: "pointer",
            };
          }}
          onClickFunction={({ countryName, countryCode }) => {
            setSelectedCountry({
              name: countryName,
              clicks: getClicksForCountry(countryCode),
            });
          }}
          onMouseOverFunction={({ countryName, countryCode }) => {
            setSelectedCountry({
              name: countryName,
              clicks: getClicksForCountry(countryCode),
            });
          }}
        />
      </div>

      {/* Info tag below map */}
      {selectedCountry && (
        <div className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-[18px]">
          {selectedCountry.name}: {selectedCountry.clicks} clicks
        </div>
      )}
    </div>
  );
}

export default GeoChoroplethMap;
