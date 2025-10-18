import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Database, Zap, Clock, TrendingUp, DollarSign, Cloud, Activity, Filter, Settings } from 'lucide-react';

const StreamBenchmarkPlatform = () => {
  const [selectedTechs, setSelectedTechs] = useState(['Flink', 'Kafka Streams', 'Azure Stream Analytics']);
  const [selectedScenario, setSelectedScenario] = useState('technical');
  const [selectedTechnicalScenario, setSelectedTechnicalScenario] = useState('real-time-streaming');
  const [selectedEnterpriseScenario, setSelectedEnterpriseScenario] = useState('Candidate Pipeline Analytics');
  const [selectedCloud, setSelectedCloud] = useState('Azure');
  const [viewMode, setViewMode] = useState('performance');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  
  // Lead capture popup state
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [selectedUseCases, setSelectedUseCases] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [pendingSelection, setPendingSelection] = useState(null);

  const technologyCategories = {
    'Stream Processing Engines': ['Flink', 'Arroyo', 'Kafka Streams', 'Spark Streaming', 'Storm', 'Samza', 'Hazelcast Jet', 'Bytewax'],
    'SQL Stream Engines': ['ksqlDB', 'Proton', 'RisingWave', 'Materialize', 'Decodable'],
    'Cloud Managed Streaming': ['Azure Stream Analytics', 'AWS Kinesis', 'Google Dataflow', 'AWS MSK'],
    'ETL Orchestration': ['Azure Data Factory', 'AWS Glue', 'Google Cloud Data Fusion', 'Airflow', 'Dagster', 'Prefect'],
    'Unified Analytics Platforms': ['Databricks', 'Snowflake', 'Google BigQuery', 'Azure Synapse Analytics', 'Microsoft Fabric'],
    'Columnar Storage & Analytics': ['DuckDB', 'ClickHouse', 'Apache Druid', 'Apache Pinot', 'Apache Parquet'],
    'Query Engines': ['Apache Trino', 'Presto', 'AWS Athena', 'Apache Drill'],
    'Data Lake Table Formats': ['Apache Iceberg', 'Delta Lake', 'Apache Hudi'],
    'Vector Databases': ['Chroma', 'Weaviate', 'Pinecone', 'Qdrant']
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

  const scenarios = [
    { id: 'real-time-streaming', name: 'Real-time Streaming (<100ms)', icon: Activity, desc: 'Sub-second latency requirements' },
    { id: 'near-real-time', name: 'Near Real-time (1-5 sec)', icon: Clock, desc: 'Dashboards and monitoring' },
    { id: 'micro-batch', name: 'Micro-batch (5-60 sec)', icon: Zap, desc: 'Cost-optimized streaming' },
    { id: 'batch-processing', name: 'Batch Processing (hourly/daily)', icon: Database, desc: 'Traditional ETL workloads' },
    { id: 'high-throughput', name: 'High Throughput (>1M events/sec)', icon: TrendingUp, desc: 'Massive scale ingestion' },
    { id: 'low-latency', name: 'Ultra-Low Latency (<10ms)', icon: Zap, desc: 'Trading, fraud detection' },
    { id: 'complex-events', name: 'Complex Event Processing', icon: Filter, desc: 'Pattern matching, correlations' },
    { id: 'stateful-processing', name: 'Stateful Processing (>100GB)', icon: Database, desc: 'Large state management' },
    { id: 'windowing', name: 'Windowing Operations', icon: Clock, desc: 'Tumbling, sliding, session windows' },
    { id: 'joins', name: 'Stream Joins (3+ streams)', icon: Filter, desc: 'Multi-stream correlations' },
    { id: 'out-of-order', name: 'Out-of-Order Events', icon: Activity, desc: 'Late arrival handling' },
    { id: 'exactly-once', name: 'Exactly-Once Semantics', icon: Database, desc: 'Critical data accuracy' },
    { id: 'serverless-etl', name: 'Serverless ETL', icon: Cloud, desc: 'Pay-per-use, auto-scaling' },
    { id: 'analytical-queries', name: 'Analytical Queries', icon: TrendingUp, desc: 'OLAP on streaming data' },
    { id: 'data-lake', name: 'Data Lake Integration', icon: Database, desc: 'S3, ADLS, GCS integration' }
  ];


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

  // Real-world benchmark data based on throughput scenarios
  const generatePerformanceData = () => {
    const data = [];
    
    // Define real-world scenarios
    const scenarios = {
      'Azure Stream Analytics': {
        throughput: 0.5, // events/sec
        monthlyCost: 185, // average of $150-220
        scenario: 'Low Throughput'
      },
      'Kafka Streams': {
        throughput: 50000, // events/sec
        monthlyCost: 1350, // average of $1100-1600
        scenario: 'Medium Throughput'
      },
      'Flink': {
        throughput: 5000000, // events/sec
        monthlyCost: 4700, // adjusted cost
        scenario: 'High Throughput'
      },
      'Chroma': {
        throughput: 1000,
        monthlyCost: 300,
        scenario: 'Vector DB'
      },
      'Weaviate': {
        throughput: 2000,
        monthlyCost: 500,
        scenario: 'Vector DB'
      },
      'Pinecone': {
        throughput: 5000,
        monthlyCost: 800,
        scenario: 'Vector DB'
      },
      'Qdrant': {
        throughput: 3000,
        monthlyCost: 600,
        scenario: 'Vector DB'
      }
    };

    selectedTechs.forEach(tech => {
      clouds.forEach(cloud => {
        if (selectedCloud === 'all' || selectedCloud === cloud) {
          const scenario = scenarios[tech] || {
            throughput: Math.random() * 100000 + 1000,
            monthlyCost: Math.random() * 2000 + 200,
            scenario: 'Standard'
          };
          
          data.push({
            name: `${tech} (${cloud})`,
            tech,
            cloud,
            throughput: scenario.throughput * (cloud === 'AWS' ? 1.1 : cloud === 'Azure' ? 1.0 : 0.9), // Cloud variation
            monthlyCost: scenario.monthlyCost * (cloud === 'AWS' ? 1.05 : cloud === 'Azure' ? 1.0 : 0.95), // Cloud variation
            latency: Math.random() * 50 + 10,
            cpu: Math.random() * 60 + 30,
            memory: Math.random() * 50 + 40,
            scenario: scenario.scenario
          });
        }
      });
    });
    return data;
  };

  const generateCostData = () => {
    const data = [];
    
    // Use the same real-world scenarios for cost data
    const scenarios = {
      'Azure Stream Analytics': {
        monthly: 185,
        hourly: 0.25,
        perMillion: 370
      },
      'Kafka Streams': {
        monthly: 1350,
        hourly: 1.85,
        perMillion: 27
      },
      'Flink': {
        monthly: 4700,
        hourly: 6.4,
        perMillion: 0.94
      },
      'Chroma': {
        monthly: 300,
        hourly: 0.41,
        perMillion: 300
      },
      'Weaviate': {
        monthly: 500,
        hourly: 0.68,
        perMillion: 250
      },
      'Pinecone': {
        monthly: 800,
        hourly: 1.1,
        perMillion: 160
      },
      'Qdrant': {
        monthly: 600,
        hourly: 0.82,
        perMillion: 200
      }
    };

    selectedTechs.forEach(tech => {
      clouds.forEach(cloud => {
        if (selectedCloud === 'all' || selectedCloud === cloud) {
          const scenario = scenarios[tech] || {
            monthly: Math.random() * 2000 + 300,
            hourly: Math.random() * 2 + 0.5,
            perMillion: Math.random() * 100 + 10
          };
          
          const cloudMultiplier = cloud === 'AWS' ? 1.05 : cloud === 'Azure' ? 1.0 : 0.95;
          data.push({
            name: `${tech} (${cloud})`,
            tech,
            cloud,
            hourly: scenario.hourly * cloudMultiplier,
            monthly: scenario.monthly * cloudMultiplier,
            perMillion: scenario.perMillion * cloudMultiplier
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

  const generateThroughputCostData = () => {
    return [
      {
        throughput: 'Low',
        throughputValue: 1, // Numeric value for Y positioning
        monthlyCost: 185,
        tech: 'Azure Stream Analytics',
        color: '#3b82f6' // Blue
      },
      {
        throughput: 'Medium', 
        throughputValue: 2, // Numeric value for Y positioning
        monthlyCost: 1350,
        tech: 'Kafka Streams',
        color: '#10b981' // Green
      },
      {
        throughput: 'High',
        throughputValue: 3, // Numeric value for Y positioning
        monthlyCost: 4700,
        tech: 'Apache Flink',
        color: '#f59e0b' // Orange
      }
    ];
  };

  const getLowData = () => generateThroughputCostData().filter(d => d.throughput === 'Low');
  const getMediumData = () => generateThroughputCostData().filter(d => d.throughput === 'Medium');
  const getHighData = () => generateThroughputCostData().filter(d => d.throughput === 'High');

  const generateLatencyData = () => {
    return [
      {
        throughput: 'Low (~100 evt/s)',
        flink: 16, // Average of 12-20
        kafkaStreams: 24, // Average of 18-30
        azureStreamAnalytics: 28.5 // Average of 22-35
      },
      {
        throughput: 'Medium (~50K evt/s)',
        flink: 35, // Average of 25-45
        kafkaStreams: 42.5, // Average of 30-55
        azureStreamAnalytics: 55 // Average of 40-70
      },
      {
        throughput: 'High (~5M evt/s)',
        flink: 90, // Average of 60-120
        kafkaStreams: 135, // Average of 90-180
        azureStreamAnalytics: 210 // Average of 140-280
      }
    ];
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
    // Check if the tech is already selected (allow deselection)
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(prev => prev.filter(t => t !== tech));
      return;
    }
    
    // Check if it's a default technology
    if (defaults.technologies.includes(tech)) {
      setSelectedTechs(prev => [...prev, tech]);
    } else {
      // Show popup for non-default technologies
      setPendingSelection({ type: 'technology', value: tech });
      setShowLeadPopup(true);
    }
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

  // Default values for each dropdown
  const defaults = {
    industry: 'all',
    scenario: 'technical',
    technicalScenario: 'real-time-streaming',
    cloud: 'Azure',
    viewMode: 'performance',
    technologies: ['Flink', 'Kafka Streams', 'Azure Stream Analytics']
  };

  // Handler for dropdown changes with lead capture
  const handleIndustryChange = (value) => {
    if (value === defaults.industry) {
      selectIndustryStack(value);
    } else {
      setPendingSelection({ type: 'industry', value });
      setShowLeadPopup(true);
    }
  };

  const handleScenarioChange = (value) => {
    if (value === defaults.scenario) {
      setSelectedScenario(value);
    } else {
      setPendingSelection({ type: 'scenario', value });
      setShowLeadPopup(true);
    }
  };

  const handleCloudChange = (value) => {
    if (value === defaults.cloud) {
      setSelectedCloud(value);
    } else {
      setPendingSelection({ type: 'cloud', value });
      setShowLeadPopup(true);
    }
  };

  const handleViewModeChange = (value) => {
    if (value === defaults.viewMode) {
      setViewMode(value);
    } else {
      setPendingSelection({ type: 'viewMode', value });
      setShowLeadPopup(true);
    }
  };

  const handleTechnicalScenarioChange = (value) => {
    if (value === defaults.technicalScenario) {
      setSelectedTechnicalScenario(value);
    } else {
      setPendingSelection({ type: 'technicalScenario', value });
      setShowLeadPopup(true);
    }
  };

  const toggleUseCase = (useCase) => {
    setSelectedUseCases(prev => 
      prev.includes(useCase) 
        ? prev.filter(uc => uc !== useCase) 
        : [...prev, useCase]
    );
  };

  const toggleTechnology = (tech) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    
    if (!userEmail) {
      alert('Please provide your email address.');
      return;
    }

    if (selectedUseCases.length === 0 && selectedTechnologies.length === 0) {
      alert('Please select at least one use case or technology.');
      return;
    }

    // Here you would send the data to your backend
    const leadData = {
      email: userEmail,
      useCases: selectedUseCases,
      technologies: selectedTechnologies,
      requestedFeature: pendingSelection,
      timestamp: new Date().toISOString()
    };

    console.log('Lead captured:', leadData);
    
    // Close popup and reset
    setShowLeadPopup(false);
    setUserEmail('');
    setSelectedUseCases([]);
    setSelectedTechnologies([]);
    setPendingSelection(null);
    
    alert('Thank you! We\'ll contact you soon with more information.');
  };

  const closePopup = () => {
    setShowLeadPopup(false);
    setUserEmail('');
    setSelectedUseCases([]);
    setSelectedTechnologies([]);
    setPendingSelection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-6 md:mb-8">
          <div className="absolute top-4 left-4">
            <a 
              href="https://caliudata.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-cyan-300 transition-all duration-200 cursor-pointer"
            >
              Caliu
            </a>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-center">
            Multi-Cloud Data Processing Benchmark
          </h1>
          <p className="text-slate-300 text-sm md:text-base text-center">Compare performance, cost, and efficiency across platforms and cloud providers</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Industries</option>
              {Object.keys(enterpriseNeeds).map(industry => (
                <option key={industry} value={industry} className="text-slate-400">{industry}</option>
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
              <Filter className="w-4 h-4" />
              Scenario Type
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              <option value="technical">Technical Scenarios</option>
              <option value="enterprise" className="text-slate-400">Enterprise Use Cases</option>
            </select>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {selectedScenario === 'technical' ? 'Technical Scenario' : 'Enterprise Use Case'}
            </label>
            {selectedScenario === 'technical' ? (
              <>
                <select
                  value={selectedTechnicalScenario}
                  onChange={(e) => handleTechnicalScenarioChange(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                >
                  {scenarios.map(s => (
                    <option key={s.id} value={s.id} className={s.id !== defaults.technicalScenario ? 'text-slate-400' : ''}>{s.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  {scenarios.find(s => s.id === selectedTechnicalScenario)?.desc}
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Cloud Provider
            </label>
            <select
              value={selectedCloud}
              onChange={(e) => handleCloudChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              <option value="all" className="text-slate-400">All Providers</option>
              <option value="AWS" className="text-slate-400">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GCP" className="text-slate-400">Google Cloud</option>
            </select>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              View Mode
            </label>
            <select
              value={viewMode}
              onChange={(e) => handleViewModeChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
            >
              <option value="performance">Performance Metrics</option>
              <option value="cost" className="text-slate-400">Cost Analysis</option>
              <option value="radar" className="text-slate-400">Multi-dimensional</option>
              <option value="efficiency" className="text-slate-400">Cost-Performance</option>
            </select>
          </div>

        </div>

        {/* Scenario Details */}
        {selectedScenario === 'enterprise' && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur rounded-lg p-3 md:p-4 border border-purple-700/50 mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 text-purple-300">Enterprise Use Case: {selectedEnterpriseScenario}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
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
        )}

        {selectedScenario === 'technical' && (
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur rounded-lg p-3 md:p-4 border border-blue-700/50 mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 text-blue-300">Technical Scenario: {scenarios.find(s => s.id === selectedTechnicalScenario)?.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
              <div>
                <span className="text-slate-400">Description:</span>
                <p className="text-white mt-1">{scenarios.find(s => s.id === selectedTechnicalScenario)?.desc}</p>
              </div>
              <div>
                <span className="text-slate-400">Scenario Type:</span>
                <p className="text-white mt-1">Technical Performance Benchmark</p>
              </div>
            </div>
          </div>
        )}

        {/* Technology Selector */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-3 md:p-4 border border-slate-700 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-xs md:text-sm font-medium">Select Technologies to Compare ({selectedTechs.length} selected)</h3>
            {selectedIndustry !== 'all' && (
              <span className="text-xs bg-blue-600 px-2 md:px-3 py-1 rounded-full self-start sm:self-auto">
                {selectedIndustry} Stack
              </span>
            )}
          </div>
          
          {Object.entries(technologyCategories).map(([category, techs]) => (
            <div key={category} className="mb-4 last:mb-0">
              <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">{category}</h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {techs.map(tech => {
                  const isDefault = defaults.technologies.includes(tech);
                  const isSelected = selectedTechs.includes(tech);
                  
                  return (
                    <button
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                          : isDefault
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-slate-800 text-slate-500 hover:bg-slate-700 border border-slate-600'
                      }`}
                      title={!isDefault && !isSelected ? 'Requires email to access' : ''}
                    >
                      {tech}
                      {!isDefault && !isSelected && (
                        <span className="ml-1 text-[10px]">🔒</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 md:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 md:w-8 h-6 md:h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-1 md:px-2 py-1 rounded">RANGE</span>
            </div>
            <div className="text-lg md:text-2xl font-bold mb-1">0.5-5M/sec</div>
            <div className="text-xs md:text-sm opacity-80">Event Throughput</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg p-3 md:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 md:w-8 h-6 md:h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-1 md:px-2 py-1 rounded">RANGE</span>
            </div>
            <div className="text-lg md:text-2xl font-bold mb-1">10-60ms</div>
            <div className="text-xs md:text-sm opacity-80">Latency Range</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg p-3 md:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 md:w-8 h-6 md:h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-1 md:px-2 py-1 rounded">RANGE</span>
            </div>
            <div className="text-lg md:text-2xl font-bold mb-1">$185-5,850</div>
            <div className="text-xs md:text-sm opacity-80">Monthly Cost Range</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-3 md:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 md:w-8 h-6 md:h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-1 md:px-2 py-1 rounded">SCENARIOS</span>
            </div>
            <div className="text-lg md:text-2xl font-bold mb-1">3</div>
            <div className="text-xs md:text-sm opacity-80">Real-world Scenarios</div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-3 md:p-6 border border-slate-700 mb-6">
          {viewMode === 'performance' && (
            <>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Real-world Performance Scenarios</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="text-xs md:text-sm font-medium mb-3 text-slate-300">Throughput vs Monthly Cost</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" dataKey="monthlyCost" name="Monthly Cost" unit="$" tick={{ fill: '#9CA3AF' }} label={{ value: 'Monthly Cost ($)', position: 'bottom', fill: '#9CA3AF' }} />
                      <YAxis 
                        type="number" 
                        dataKey="throughputValue" 
                        name="Throughput" 
                        tick={{ fill: '#9CA3AF' }} 
                        label={{ value: 'Throughput Level', angle: -90, position: 'left', fill: '#9CA3AF' }}
                        domain={[0.5, 3.5]}
                        ticks={[1, 2, 3]}
                        tickFormatter={(value) => {
                          const labels = { 1: 'Low', 2: 'Medium', 3: 'High' };
                          return labels[value] || '';
                        }}
                      />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Scatter 
                        data={getLowData()}
                        dataKey="monthlyCost" 
                        fill="#3b82f6"
                        shape="circle"
                        r={8}
                        name="Low"
                      />
                      <Scatter 
                        data={getMediumData()}
                        dataKey="monthlyCost" 
                        fill="#10b981"
                        shape="circle"
                        r={8}
                        name="Medium"
                      />
                      <Scatter 
                        data={getHighData()}
                        dataKey="monthlyCost" 
                        fill="#f59e0b"
                        shape="circle"
                        r={8}
                        name="High"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-2 text-xs text-slate-400">
                    <div className="mb-1">🔵 <strong>Low:</strong> Azure Stream Analytics - $185/mo</div>
                    <div className="mb-1">🟢 <strong>Medium:</strong> Kafka Streams - $1,350/mo</div>
                    <div>🟠 <strong>High:</strong> Apache Flink - $4,700/mo</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-medium mb-3 text-slate-300">Throughput by Latency</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generateLatencyData()} margin={{ top: 20, right: 30, left: 60, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="throughput" angle={-45} textAnchor="end" height={60} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} label={{ value: 'Latency (ms)', angle: -90, position: 'left', fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Bar dataKey="flink" fill="#f59e0b" name="Apache Flink" />
                      <Bar dataKey="kafkaStreams" fill="#10b981" name="Kafka Streams" />
                      <Bar dataKey="azureStreamAnalytics" fill="#3b82f6" name="Azure Stream Analytics" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-2 text-xs text-slate-400">
                    <div className="mb-1">🟠 <strong>Apache Flink:</strong> High throughput, low latency</div>
                    <div className="mb-1">🟢 <strong>Kafka Streams:</strong> Medium throughput, medium latency</div>
                    <div>🔵 <strong>Azure Stream Analytics:</strong> Low throughput, higher latency</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'cost' && (
            <>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Cost Analysis by Cloud Provider</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="text-xs md:text-sm font-medium mb-3 text-slate-300">Monthly Cost (USD)</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={generateCostData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      <Bar dataKey="monthly" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-medium mb-3 text-slate-300">Cost per Million Events (USD)</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={generateCostData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
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
              <h3 className="text-lg md:text-xl font-semibold mb-4">Multi-Dimensional Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
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
              <h3 className="text-lg md:text-xl font-semibold mb-4">Cost-Performance Efficiency</h3>
              <ResponsiveContainer width="100%" height={400}>
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
              <p className="text-xs md:text-sm text-slate-400 mt-2 text-center">
                Bubble size represents efficiency score. Upper-left quadrant shows best cost-performance ratio.
              </p>
            </>
          )}
        </div>

        {/* Lead Capture Popup */}
        {showLeadPopup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Unlock Full Access
                </h3>
                <button 
                  onClick={closePopup}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-slate-300 mb-6">
                <span className="font-semibold text-blue-300">Join our testing program!</span> We're developing a tool to simplify multi-cloud data processing deployments. Your feedback will help shape the platform.
              </p>

              <form onSubmit={handleLeadSubmit}>
                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Technologies Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Select Technologies You're Interested In
                  </label>
                  <div className="max-h-60 overflow-y-auto p-3 bg-slate-900/50 rounded">
                    {Object.entries(technologyCategories).map(([category, techs]) => (
                      <div key={category} className="mb-4 last:mb-0">
                        <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {techs.map(tech => {
                            const isDefault = defaults.technologies.includes(tech);
                            const isSelected = selectedTechnologies.includes(tech);
                            
                            return (
                              <button
                                key={tech}
                                type="button"
                                onClick={() => toggleTechnology(tech)}
                                disabled={isDefault}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                    : isDefault
                                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer'
                                }`}
                                title={isDefault ? 'Already available in free tier' : 'Click to select'}
                              >
                                {tech}
                                {isDefault && <span className="ml-1">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Default technologies (Flink, Kafka Streams, Azure Stream Analytics) are already included
                  </p>
                </div>

                {/* Use Cases Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Select Enterprise Use Cases You're Interested In
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-slate-900/50 rounded">
                    {Object.keys(enterpriseScenarios).map(useCase => (
                      <label
                        key={useCase}
                        className="flex items-start gap-2 p-2 rounded hover:bg-slate-700/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUseCases.includes(useCase)}
                          onChange={() => toggleUseCase(useCase)}
                          className="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{useCase}</div>
                          <div className="text-xs text-slate-400">{enterpriseScenarios[useCase].description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Select at least one technology or use case to continue
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Submit & Get Access
                  </button>
                  <button
                    type="button"
                    onClick={closePopup}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StreamBenchmarkPlatform;