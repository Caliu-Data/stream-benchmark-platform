import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Database, Zap, Clock, TrendingUp, DollarSign, Cloud, Activity, Filter, Download, Settings } from 'lucide-react';

const StreamBenchmarkPlatform = () => {
  const [selectedTechs, setSelectedTechs] = useState(['Flink', 'Arroyo', 'ksqlDB', 'Proton']);
  const [selectedScenario, setSelectedScenario] = useState('streaming');
  const [selectedCloud, setSelectedCloud] = useState('all');
  const [viewMode, setViewMode] = useState('performance');

  const technologies = [
    'Flink', 'Arroyo', 'ksqlDB', 'Proton', 'Databricks', 'Azure Data Factory',
    'Airflow', 'Kafka Streams', 'Spark Streaming', 'Storm', 'Samza',
    'Pulsar', 'RisingWave', 'Materialize', 'Decodable', 'Azure Stream Analytics',
    'AWS Kinesis', 'Google Dataflow', 'Hazelcast Jet', 'Beam', 'Bytewax',
    'Striim', 'TimeScale', 'ClickHouse'
  ];

  const scenarios = [
    { id: 'streaming', name: 'Real-time Streaming', icon: Activity },
    { id: 'batch', name: 'Batch Processing', icon: Database },
    { id: 'high-volume', name: 'High Volume (>1M/sec)', icon: TrendingUp },
    { id: 'low-latency', name: 'Ultra-Low Latency (<10ms)', icon: Zap },
    { id: 'out-of-order', name: 'Out-of-Order Events', icon: Clock },
    { id: 'large-state', name: 'Large State (>100GB)', icon: Database },
    { id: 'windowing', name: 'Small Windows (<1min)', icon: Clock },
    { id: 'joins', name: 'Multiple Joins (3+)', icon: Filter }
  ];

  const clouds = ['AWS', 'Azure', 'GCP'];

  // Simulated benchmark data
  const generatePerformanceData = () => {
    const data = [];
    selectedTechs.slice(0, 8).forEach(tech => {
      clouds.forEach(cloud => {
        if (selectedCloud === 'all' || selectedCloud === cloud) {
          data.push({
            name: `${tech} (${cloud})`,
            tech,
            cloud,
            throughput: Math.random() * 1000000 + 100000,
            latency: Math.random() * 100 + 5,
            cpu: Math.random() * 80 + 20,
            memory: Math.random() * 70 + 30
          });
        }
      });
    });
    return data;
  };

  const generateCostData = () => {
    const data = [];
    selectedTechs.slice(0, 8).forEach(tech => {
      clouds.forEach(cloud => {
        if (selectedCloud === 'all' || selectedCloud === cloud) {
          const baseMultiplier = cloud === 'AWS' ? 1 : cloud === 'Azure' ? 0.95 : 0.92;
          data.push({
            name: `${tech} (${cloud})`,
            tech,
            cloud,
            hourly: (Math.random() * 5 + 0.5) * baseMultiplier,
            monthly: (Math.random() * 3000 + 500) * baseMultiplier,
            perMillion: (Math.random() * 2 + 0.1) * baseMultiplier
          });
        }
      });
    });
    return data;
  };

  const generateRadarData = () => {
    const metrics = ['Throughput', 'Latency', 'Scalability', 'Fault Tolerance', 'Ease of Use'];
    return metrics.map(metric => {
      const obj = { metric };
      selectedTechs.slice(0, 5).forEach(tech => {
        obj[tech] = Math.random() * 100;
      });
      return obj;
    });
  };

  const generateScatterData = () => {
    return selectedTechs.slice(0, 10).map(tech => {
      clouds.forEach(cloud => {
        if (selectedCloud === 'all' || selectedCloud === cloud) {
          return {
            tech: `${tech} (${cloud})`,
            cost: Math.random() * 5000 + 500,
            performance: Math.random() * 100000 + 10000,
            efficiency: Math.random() * 100 + 20
          };
        }
      });
    }).flat().filter(Boolean);
  };

  const toggleTech = (tech) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const getCloudColor = (cloud) => {
    switch(cloud) {
      case 'AWS': return '#FF9900';
      case 'Azure': return '#0078D4';
      case 'GCP': return '#4285F4';
      default: return '#8884d8';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Multi-Cloud Stream Processing Benchmark
          </h1>
          <p className="text-slate-300">Compare performance, cost, and efficiency across platforms and cloud providers</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Cloud Provider
            </label>
            <select
              value={selectedCloud}
              onChange={(e) => setSelectedCloud(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Providers</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GCP">Google Cloud</option>
            </select>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              View Mode
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              <option value="performance">Performance Metrics</option>
              <option value="cost">Cost Analysis</option>
              <option value="radar">Multi-dimensional</option>
              <option value="efficiency">Cost-Performance</option>
            </select>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700 flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Technology Selector */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700 mb-6">
          <h3 className="text-sm font-medium mb-3">Select Technologies to Compare ({selectedTechs.length} selected)</h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map(tech => (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTechs.includes(tech)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">AVG</span>
            </div>
            <div className="text-2xl font-bold mb-1">847K/sec</div>
            <div className="text-sm opacity-80">Avg Throughput</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">P95</span>
            </div>
            <div className="text-2xl font-bold mb-1">42ms</div>
            <div className="text-sm opacity-80">Avg Latency</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">MONTHLY</span>
            </div>
            <div className="text-2xl font-bold mb-1">$2,347</div>
            <div className="text-sm opacity-80">Avg Cost</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">SCORE</span>
            </div>
            <div className="text-2xl font-bold mb-1">87/100</div>
            <div className="text-sm opacity-80">Efficiency Score</div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700 mb-6">
          {viewMode === 'performance' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Performance Comparison</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-slate-300">Throughput (events/sec)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generatePerformanceData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Bar dataKey="throughput" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3 text-slate-300">Latency (ms) - Lower is Better</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generatePerformanceData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Bar dataKey="latency" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {viewMode === 'cost' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Cost Analysis by Cloud Provider</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-slate-300">Monthly Cost (USD)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generateCostData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Bar dataKey="monthly" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3 text-slate-300">Cost per Million Events (USD)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generateCostData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Bar dataKey="perMillion" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {viewMode === 'radar' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Multi-Dimensional Comparison</h3>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={generateRadarData()}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF' }} />
                  <PolarRadiusAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  {selectedTechs.slice(0, 5).map((tech, idx) => (
                    <Radar
                      key={tech}
                      name={tech}
                      dataKey={tech}
                      stroke={`hsl(${idx * 60}, 70%, 50%)`}
                      fill={`hsl(${idx * 60}, 70%, 50%)`}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </>
          )}

          {viewMode === 'efficiency' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Cost-Performance Efficiency</h3>
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" dataKey="cost" name="Monthly Cost" unit="$" tick={{ fill: '#9CA3AF' }} label={{ value: 'Monthly Cost ($)', position: 'bottom', fill: '#9CA3AF' }} />
                  <YAxis type="number" dataKey="performance" name="Throughput" unit=" evt/s" tick={{ fill: '#9CA3AF' }} label={{ value: 'Throughput (events/sec)', angle: -90, position: 'left', fill: '#9CA3AF' }} />
                  <ZAxis type="number" dataKey="efficiency" range={[50, 500]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="Technologies" data={generateScatterData()} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-400 mt-2 text-center">
                Bubble size represents efficiency score. Upper-left quadrant shows best cost-performance ratio.
              </p>
            </>
          )}
        </div>

        {/* Cloud Provider Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clouds.map(cloud => (
            <div key={cloud} className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Cloud className="w-5 h-5" style={{ color: getCloudColor(cloud) }} />
                  {cloud}
                </h4>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">Best for {selectedScenario}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Latency:</span>
                  <span className="font-medium">{(Math.random() * 50 + 20).toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Cost/hr:</span>
                  <span className="font-medium">${(Math.random() * 3 + 1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Winner:</span>
                  <span className="font-medium text-blue-400">{selectedTechs[Math.floor(Math.random() * Math.min(3, selectedTechs.length))]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreamBenchmarkPlatform;