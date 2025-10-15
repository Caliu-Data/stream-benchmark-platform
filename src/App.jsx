import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Zap, TrendingUp, DollarSign, Cloud, Activity, Download, Settings } from 'lucide-react';

const StreamBenchmarkPlatform = () => {
  const [selectedTechs, setSelectedTechs] = useState(['Flink', 'Arroyo', 'ksqlDB', 'Proton']);
  const [selectedEnterpriseScenario, setSelectedEnterpriseScenario] = useState('Customer 360 & Personalization');
  const [selectedCloud, setSelectedCloud] = useState('all');
  const [viewMode, setViewMode] = useState('performance');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const technologyCategories = {
    'Stream Processing Engines': ['Flink', 'Arroyo', 'Kafka Streams', 'Spark Streaming', 'Storm', 'Samza', 'Hazelcast Jet', 'Bytewax'],
    'SQL Stream Engines': ['ksqlDB', 'Proton', 'RisingWave', 'Materialize', 'Decodable'],
    'Cloud Managed Streaming': ['Azure Stream Analytics', 'AWS Kinesis', 'Google Dataflow', 'AWS MSK'],
    'ETL Orchestration': ['Azure Data Factory', 'AWS Glue', 'Google Cloud Data Fusion', 'Airflow', 'Dagster', 'Prefect'],
    'Unified Analytics Platforms': ['Databricks', 'Snowflake', 'Google BigQuery', 'Azure Synapse Analytics', 'Microsoft Fabric'],
    'Columnar Storage & Analytics': ['DuckDB', 'ClickHouse', 'Apache Druid', 'Apache Pinot', 'Apache Parquet'],
    'Query Engines': ['Apache Trino', 'Presto', 'AWS Athena', 'Apache Drill'],
    'Data Lake Table Formats': ['Apache Iceberg', 'Delta Lake', 'Apache Hudi']
  };

  const enterpriseNeeds = {
    'Financial Services': {
      technologies: ['Flink', 'Kafka Streams', 'ksqlDB', 'Hazelcast Jet', 'Materialize', 'ClickHouse'],
      requirements: 'Low latency, exactly-once semantics, audit trails',
      useCases: ['Financial Trading & Risk', 'Fraud Detection & Security']
    },
    'E-commerce & Retail': {
      technologies: ['Kafka Streams', 'Databricks', 'Snowflake', 'AWS Kinesis', 'BigQuery', 'Apache Druid'],
      requirements: 'High throughput, scalability, real-time inventory',
      useCases: ['Real-time Inventory Management', 'Customer 360 & Personalization', 'Real-time Recommendations']
    },
    'IoT & Manufacturing': {
      technologies: ['Flink', 'AWS Kinesis', 'Azure Stream Analytics', 'ClickHouse', 'Apache Druid', 'RisingWave'],
      requirements: 'High volume, out-of-order events, time-series analytics',
      useCases: ['IoT & Sensor Data Processing', 'Predictive Maintenance']
    },
    'Media & Entertainment': {
      technologies: ['Spark Streaming', 'Databricks', 'Snowflake', 'ClickHouse', 'Apache Pinot', 'BigQuery'],
      requirements: 'Real-time analytics, audience segmentation, content recommendations',
      useCases: ['Clickstream & User Analytics', 'Real-time Recommendations', 'Content Engagement Analytics']
    },
    'Healthcare & Life Sciences': {
      technologies: ['Flink', 'Snowflake', 'Azure Synapse Analytics', 'AWS Glue', 'Materialize', 'Databricks'],
      requirements: 'HIPAA compliance, data privacy, real-time patient monitoring',
      useCases: ['Patient Monitoring & Healthcare', 'Clinical Decision Support']
    },
    'Telecommunications': {
      technologies: ['Flink', 'Kafka Streams', 'ClickHouse', 'Apache Druid', 'Spark Streaming', 'AWS Kinesis'],
      requirements: 'Network monitoring, fraud detection, high-volume CDRs',
      useCases: ['Network Monitoring & Observability', 'Fraud Detection & Security', 'Customer Experience Analytics']
    },
    'Gaming': {
      technologies: ['Flink', 'ksqlDB', 'ClickHouse', 'Apache Druid', 'RisingWave', 'DuckDB'],
      requirements: 'Player analytics, real-time leaderboards, event tracking',
      useCases: ['Clickstream & User Analytics', 'Real-time Leaderboards & Gaming', 'Player Behavior Analysis']
    },
    'AdTech & Marketing': {
      technologies: ['Apache Druid', 'ClickHouse', 'Kafka Streams', 'BigQuery', 'Snowflake', 'Apache Pinot'],
      requirements: 'Real-time bidding, attribution, high QPS analytics',
      useCases: ['Marketing Attribution & ROI', 'Real-time Bidding', 'Customer 360 & Personalization']
    },
    'Logistics & Supply Chain': {
      technologies: ['Databricks', 'Snowflake', 'AWS Glue', 'Spark Streaming', 'Azure Synapse Analytics', 'Flink'],
      requirements: 'Route optimization, inventory tracking, predictive analytics',
      useCases: ['Supply Chain Visibility', 'Real-time Inventory Management', 'Fleet & Asset Tracking']
    },
    'Energy & Utilities': {
      technologies: ['Flink', 'Azure Stream Analytics', 'ClickHouse', 'AWS Kinesis', 'RisingWave', 'Databricks'],
      requirements: 'Smart grid monitoring, predictive maintenance, IoT sensors',
      useCases: ['Energy Grid & Smart Meters', 'Predictive Maintenance', 'Demand Forecasting']
    },
    'Recruiting & HR Tech': {
      technologies: ['Snowflake', 'Databricks', 'BigQuery', 'Kafka Streams', 'AWS Glue', 'Azure Data Factory'],
      requirements: 'Candidate matching, pipeline analytics, engagement tracking',
      useCases: ['Candidate Pipeline Analytics', 'Talent Matching & Recommendations', 'Recruitment Marketing Analytics']
    },
    'Non-Profit & Social Impact': {
      technologies: ['Snowflake', 'BigQuery', 'DuckDB', 'AWS Glue', 'Databricks', 'Apache Druid'],
      requirements: 'Donor analytics, campaign tracking, impact measurement, cost-effective',
      useCases: ['Donor Engagement Analytics', 'Campaign Performance Tracking', 'Impact Measurement & Reporting']
    }
  };

  const technologies = Object.values(technologyCategories).flat();


  const enterpriseScenarios = {
    'Customer 360 & Personalization': {
      description: 'Real-time customer data integration across touchpoints',
      requirements: 'Stream joins, identity resolution, ML inference',
      dataVolume: 'Medium-High',
      latency: '<1 second'
    },
    'Fraud Detection & Security': {
      description: 'Real-time anomaly detection and threat prevention',
      requirements: 'Complex event processing, pattern matching, low latency',
      dataVolume: 'High',
      latency: '<100ms'
    },
    'Real-time Inventory Management': {
      description: 'Cross-channel inventory sync and availability',
      requirements: 'Exactly-once semantics, high throughput, multiple sources',
      dataVolume: 'High',
      latency: '<5 seconds'
    },
    'IoT & Sensor Data Processing': {
      description: 'Manufacturing, smart devices, telemetry processing',
      requirements: 'Out-of-order events, windowing, time-series aggregation',
      dataVolume: 'Very High',
      latency: '<1 second'
    },
    'Financial Trading & Risk': {
      description: 'Market data, order processing, risk calculation',
      requirements: 'Ultra-low latency, exactly-once, stateful processing',
      dataVolume: 'Medium-High',
      latency: '<10ms'
    },
    'Clickstream & User Analytics': {
      description: 'Web/mobile event tracking and behavior analysis',
      requirements: 'High throughput, sessionization, funnel analysis',
      dataVolume: 'Very High',
      latency: '<5 seconds'
    },
    'Supply Chain Visibility': {
      description: 'End-to-end tracking and predictive logistics',
      requirements: 'Multi-source integration, complex joins, predictions',
      dataVolume: 'Medium',
      latency: '<30 seconds'
    },
    'Real-time Recommendations': {
      description: 'Personalized product/content recommendations',
      requirements: 'ML model serving, feature engineering, A/B testing',
      dataVolume: 'High',
      latency: '<500ms'
    },
    'Network Monitoring & Observability': {
      description: 'Infrastructure, application, and network monitoring',
      requirements: 'High cardinality metrics, log aggregation, alerting',
      dataVolume: 'Very High',
      latency: '<5 seconds'
    },
    'Patient Monitoring & Healthcare': {
      description: 'Real-time vital signs and clinical decision support',
      requirements: 'Reliability, compliance (HIPAA), alert routing',
      dataVolume: 'Medium',
      latency: '<1 second'
    },
    'Marketing Attribution & ROI': {
      description: 'Multi-touch attribution and campaign performance',
      requirements: 'Complex joins, deduplication, lookback windows',
      dataVolume: 'High',
      latency: '<1 minute'
    },
    'Energy Grid & Smart Meters': {
      description: 'Power consumption monitoring and demand forecasting',
      requirements: 'Time-series, predictive analytics, aggregations',
      dataVolume: 'Very High',
      latency: '<10 seconds'
    },
    'Candidate Pipeline Analytics': {
      description: 'Real-time tracking of candidate journey and pipeline metrics',
      requirements: 'Event tracking, funnel analysis, engagement metrics',
      dataVolume: 'Medium',
      latency: '<5 seconds'
    },
    'Talent Matching & Recommendations': {
      description: 'AI-powered candidate-job matching and recommendations',
      requirements: 'ML inference, feature engineering, real-time scoring',
      dataVolume: 'Medium-High',
      latency: '<1 second'
    },
    'Recruitment Marketing Analytics': {
      description: 'Campaign performance and candidate acquisition analytics',
      requirements: 'Attribution modeling, conversion tracking, ROI analysis',
      dataVolume: 'Medium',
      latency: '<1 minute'
    },
    'Donor Engagement Analytics': {
      description: 'Real-time donor behavior and engagement tracking',
      requirements: 'Event tracking, segmentation, engagement scoring',
      dataVolume: 'Low-Medium',
      latency: '<5 seconds'
    },
    'Campaign Performance Tracking': {
      description: 'Multi-channel campaign analytics and performance monitoring',
      requirements: 'Attribution, conversion tracking, cost analysis',
      dataVolume: 'Medium',
      latency: '<1 minute'
    },
    'Impact Measurement & Reporting': {
      description: 'Program impact tracking and outcome measurement',
      requirements: 'Data aggregation, reporting, outcome tracking',
      dataVolume: 'Low-Medium',
      latency: '<1 hour'
    }
  };

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

  const selectIndustryStack = (industry) => {
    if (industry === 'all') {
      setSelectedIndustry('all');
      return;
    }
    setSelectedIndustry(industry);
    setSelectedTechs(enterpriseNeeds[industry].technologies);
    
    // Reset enterprise scenario to first available one for the industry
    const industryUseCases = enterpriseNeeds[industry]?.useCases || [];
    if (industryUseCases.length > 0) {
      setSelectedEnterpriseScenario(industryUseCases[0]);
    }
  };

  const getFilteredEnterpriseScenarios = () => {
    if (selectedIndustry === 'all') {
      return Object.keys(enterpriseScenarios);
    }
    
    // Filter scenarios based on industry use cases
    const industryUseCases = enterpriseNeeds[selectedIndustry]?.useCases || [];
    return Object.keys(enterpriseScenarios).filter(scenario => 
      industryUseCases.includes(scenario)
    );
  };

  // Ensure selected scenario is valid for current industry
  useEffect(() => {
    const filteredScenarios = getFilteredEnterpriseScenarios();
    if (!filteredScenarios.includes(selectedEnterpriseScenario)) {
      if (filteredScenarios.length > 0) {
        setSelectedEnterpriseScenario(filteredScenarios[0]);
      }
    }
  }, [selectedIndustry, selectedEnterpriseScenario]);

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
              <TrendingUp className="w-4 h-4" />
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => selectIndustryStack(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Industries</option>
              {Object.keys(enterpriseNeeds).map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {selectedIndustry !== 'all' && (
              <p className="text-xs text-slate-400 mt-1">
                {enterpriseNeeds[selectedIndustry].requirements}
              </p>
            )}
          </div>


          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Enterprise Use Case
            </label>
            <select
              value={selectedEnterpriseScenario}
              onChange={(e) => setSelectedEnterpriseScenario(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              {getFilteredEnterpriseScenarios().map(scenario => (
                <option key={scenario} value={scenario}>{scenario}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              {enterpriseScenarios[selectedEnterpriseScenario].description}
            </p>
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

        {/* Enterprise Scenario Details */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur rounded-lg p-4 border border-purple-700/50 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-purple-300">Enterprise Use Case: {selectedEnterpriseScenario}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Requirements:</span>
              <p className="text-white mt-1">{enterpriseScenarios[selectedEnterpriseScenario].requirements}</p>
            </div>
            <div>
              <span className="text-slate-400">Data Volume:</span>
              <p className="text-white mt-1">{enterpriseScenarios[selectedEnterpriseScenario].dataVolume}</p>
            </div>
            <div>
              <span className="text-slate-400">Latency SLA:</span>
              <p className="text-white mt-1">{enterpriseScenarios[selectedEnterpriseScenario].latency}</p>
            </div>
            <div>
              <span className="text-slate-400">Description:</span>
              <p className="text-white mt-1">{enterpriseScenarios[selectedEnterpriseScenario].description}</p>
            </div>
          </div>
        </div>

        {/* Technology Selector */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Select Technologies to Compare ({selectedTechs.length} selected)</h3>
            {selectedIndustry !== 'all' && (
              <span className="text-xs bg-blue-600 px-3 py-1 rounded-full">
                {selectedIndustry} Stack
              </span>
            )}
          </div>
          
          {Object.entries(technologyCategories).map(([category, techs]) => (
            <div key={category} className="mb-4 last:mb-0">
              <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {techs.map(tech => (
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
          ))}
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
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">Best for Enterprise</span>
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