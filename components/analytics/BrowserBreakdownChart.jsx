import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FiGlobe } from 'react-icons/fi';

const BrowserBreakdownChart = ({ clicks = [] }) => {
    // Define main browsers and colors
    const mainBrowsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const browserColors = {
        Chrome: '#4285F4',
        Firefox: '#FF9500',
        Safari: '#1CD758',
        Edge: '#0078D7',
        Opera: '#FF1B2D',
        Others: '#A0AEC0'
    };

    // Count browser occurrences and calculate total
    const { browserCounts, totalClicks } = clicks.reduce((acc, { browser }) => {
        const normalizedBrowser = mainBrowsers.includes(browser) ? browser : 'Others';
        acc.browserCounts[normalizedBrowser] = (acc.browserCounts[normalizedBrowser] || 0) + 1;
        acc.totalClicks += 1;
        return acc;
    }, { browserCounts: {}, totalClicks: 0 });

    // Prepare data for the chart
    const chartData = mainBrowsers.concat('Others').map(browser => ({
        name: browser,
        value: browserCounts[browser] || 0,
        color: browserColors[browser]
    }));

    return (
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 text-gray-300 mb-4">
                <FiGlobe />
                <h2 className="text-xl font-semibold text-gray-300">Browser Breakdown</h2>
            </div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center p-2 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* Background track ring */}
                        <Pie
                            data={[{ value: 1 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            fill="#E2E8F0"
                            stroke="none"
                            paddingAngle={0}
                            dataKey="value"
                            animationDuration={0}
                        />

                        {/* Main doughnut */}
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={2}
                            cornerRadius={4}
                            dataKey="value"
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
                            ))}
                        </Pie>

                        {/* Center total count */}
                        <text
                            x="50%"
                            y="35%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-2xl font-bold text-gray-700"
                        >
                            {totalClicks}
                        </text>
                        <text
                            x="50%"
                            y="35%"
                            textAnchor="middle"
                            dominantBaseline="text-after-edge"
                            className="text-sm font-medium text-gray-500"
                            dy={24}
                        >
                            Total Clicks
                        </text>

                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload || !payload.length) return null;
                                console.log('Tooltip payload:', payload) 

                                let name1, value1;
                                
                                if(!payload[1])
                                {
                                      const  { name, value } = payload[0].payload;
                                        name1=name 
                                        value1=value
                                }

                                else{
                                   const  { name, value } = payload[1].payload;
                                     name1=name
                                     value1=value
                                }
                                // console.log('Tooltip payload:', payload[1].payload)   
                                return (
                                    <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                                        <p className="font-medium text-black">{name1}</p>
                                        <p className='text-black'>{value1} {value1 === 1 ? 'click' : 'clicks'}</p>
                                    </div>
                                );
                            }}
                        />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ paddingTop: '16px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BrowserBreakdownChart;