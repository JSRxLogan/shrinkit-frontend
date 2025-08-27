import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, Legend as BarLegend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend
} from 'recharts';
import { FiSmartphone, FiMonitor, FiTablet } from 'react-icons/fi';

const DeviceOSBreakdownChart = ({ clicks = [] }) => {
  // Define categories
  const deviceCategories = ['Mobile', 'Desktop', 'Tablet', 'Others'];
  const osCategories = ['Windows', 'macOS', 'Linux', 'Android', 'iOS', 'Others'];

  // Color schemes
  const deviceColors = {
    Mobile: '#4F46E5',
    Desktop: '#10B981',
    Tablet: '#F59E0B',
    Others: '#9CA3AF'
  };

  const osColors = {
    Windows: '#3B82F6',
    macOS: '#6366F1',
    Linux: '#F59E0B',
    Android: '#10B981',
    iOS: '#EC4899',
    Others: '#9CA3AF'
  };

  // Process click data
  const deviceCounts = clicks.reduce((acc, { device }) => {
    const normalizedDevice = deviceCategories.includes(device) ? device : 'Others';
    acc[normalizedDevice] = (acc[normalizedDevice] || 0) + 1;
    return acc;
  }, {});

  const osCounts = clicks.reduce((acc, { os }) => {
  // Guard for missing or empty OS
  if (!os) os = "Others";

  // Remove anything after the first space (e.g., "Windows 10.0" -> "Windows")
  const baseOS = os.split(" ")[0];

  // Normalize against fixed categories
  const normalizedOS = osCategories.includes(baseOS) ? baseOS : "Others";

  // Count
  acc[normalizedOS] = (acc[normalizedOS] || 0) + 1;
  return acc;
}, {});


  // Prepare chart data
  const deviceData = deviceCategories.map(device => ({
    name: device,
    count: deviceCounts[device] || 0,
    color: deviceColors[device]
  }));

  const osData = osCategories.map(os => ({
    name: os,
    value: osCounts[os] || 0,
    color: osColors[os]
  }));

  // Custom tooltip components
  const DeviceTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const { name, count } = payload[0].payload;
    console.log("Payload for DeviceTooltip ",payload);
    console.log("Name: ", name, " Count: ", count);
    return (
      <div className="bg-white p-2 shadow-md rounded border border-gray-200">
        <p className="font-semibold text-black">{name}</p>
        <p className='text-black'>{count} clicks</p>
      </div>
    );
  };

  const OSTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const { name, value } = payload[0].payload;
    const percentage = ((value / clicks.length) * 100).toFixed(1);
    return (
      <div className="bg-white p-2 shadow-md rounded border border-gray-200">
        <p className="font-semibold">{name}</p>
        <p>{value} clicks ({percentage}%)</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center  gap-2 text-gray-300 mb-6">
        <FiSmartphone className="text-lg" />
        <h2 className="text-xl font-semibold">Device Breakdown</h2>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
        {/* Device Bar Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FiMonitor className="text-gray-600" />
            Device Types
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deviceData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <BarTooltip content={<DeviceTooltip />} />
                <BarLegend />
                <Bar dataKey="count" name="Clicks">
                  {deviceData.map((entry, index) => (
                    <Cell key={`device-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OS Doughnut Chart */}
        {/* <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FiTablet className="text-gray-600" />
            Operating Systems
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={osData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                >
                  {osData.map((entry, index) => (
                    <Cell key={`os-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <PieTooltip content={<OSTooltip />} />
                <PieLegend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default DeviceOSBreakdownChart;