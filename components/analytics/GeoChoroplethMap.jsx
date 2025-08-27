import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map of country names in your clicks data to ISO_A3 codes

function normalizeCountryName(name) {
  if (!name) return '';
  return name.trim().replace(/\s+/g, '_');
}

const countryNameToISO3 = {
  India: "IND",
  United_States: "USA",
  Canada: "CAN",
  Brazil: "BRA",
  United_Kingdom: "GBR",
  Germany: "DEU",
  // Add more countries you expect here...
};

const countryNameToISO3_2 = { 
  "India": "IND",
  "United_States": "USA",
  "Canada": "CAN",
  "Brazil": "BRA",
  "United Kingdom": "GBR",
  "Germany": "DEU",
  // add more countries as you spot them in your data
};

function aggregateClicksByCountry(clicks) {
  const counts = {};

  clicks.forEach(({ country }) => {
    if (!country) return; // skip unknown

    const isoCode = countryNameToISO3_2[country];  // use new map here
    if (!isoCode) return; // skip if no mapping

    counts[isoCode] = (counts[isoCode] || 0) + 1;
  });

  return counts;
}

function GeoChoroplethMap({ clicks }) {
  const [geoData, setGeoData] = React.useState({});

  React.useEffect(() => {
    if (clicks) {
      console.log('Processing clicks for geo data:', aggregateClicksByCountry(clicks));
      setGeoData(aggregateClicksByCountry(clicks));
    }
  }, [clicks]);

  const colorScale = scaleQuantize()
    .domain([0, Math.max(1, ...Object.values(geoData))]) // prevent max=0
    .range([
      '#e0f3f8',
      '#a6bddb',
      '#74a9cf',
      '#3690c0',
      '#0570b0',
      '#034e7b',
    ]);

  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isoCode = countryNameToISO3_2[geo.properties.name];
            const clicksCount = geoData[isoCode] || 0;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={clicksCount ? colorScale(clicksCount) : '#EEE'}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#F53', outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

export default GeoChoroplethMap;
