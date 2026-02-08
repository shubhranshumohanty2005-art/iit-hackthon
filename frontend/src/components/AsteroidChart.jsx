import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './AsteroidChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AsteroidChart = ({ asteroids, type = 'risk' }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e8eaf6',
          font: {
            family: 'Inter',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 36, 66, 0.95)',
        titleColor: '#e8eaf6',
        bodyColor: '#b0b7d4',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#b0b7d4' },
        grid: { color: 'rgba(99, 102, 241, 0.1)' },
      },
      y: {
        ticks: { color: '#b0b7d4' },
        grid: { color: 'rgba(99, 102, 241, 0.1)' },
      },
    },
  };

  // Risk Distribution Chart
  if (type === 'risk-distribution') {
    const riskCounts = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    asteroids.forEach(asteroid => {
      const level = asteroid.risk_analysis?.level || 'LOW';
      riskCounts[level]++;
    });

    const data = {
      labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
      datasets: [
        {
          data: [riskCounts.LOW, riskCounts.MEDIUM, riskCounts.HIGH, riskCounts.CRITICAL],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            '#10b981',
            '#f59e0b',
            '#f97316',
            '#ef4444',
          ],
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="chart-container">
        <h3>Risk Distribution</h3>
        <div className="chart-wrapper">
          <Doughnut data={data} options={{ ...chartOptions, scales: undefined }} />
        </div>
      </div>
    );
  }

  // Velocity Comparison Chart
  if (type === 'velocity') {
    const sortedAsteroids = [...asteroids]
      .filter(a => a.close_approach_data?.[0])
      .sort((a, b) => {
        const velA = parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_second);
        const velB = parseFloat(b.close_approach_data[0].relative_velocity.kilometers_per_second);
        return velB - velA;
      })
      .slice(0, 10);

    const data = {
      labels: sortedAsteroids.map(a => a.name.substring(0, 20)),
      datasets: [
        {
          label: 'Velocity (km/s)',
          data: sortedAsteroids.map(a => 
            parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_second)
          ),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: '#6366f1',
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="chart-container">
        <h3>Top 10 Fastest Asteroids</h3>
        <div className="chart-wrapper">
          <Bar data={data} options={chartOptions} />
        </div>
      </div>
    );
  }

  // Size Comparison Chart
  if (type === 'size') {
    const sortedAsteroids = [...asteroids]
      .filter(a => a.estimated_diameter?.meters)
      .sort((a, b) => {
        const avgA = (a.estimated_diameter.meters.estimated_diameter_min + 
                     a.estimated_diameter.meters.estimated_diameter_max) / 2;
        const avgB = (b.estimated_diameter.meters.estimated_diameter_min + 
                     b.estimated_diameter.meters.estimated_diameter_max) / 2;
        return avgB - avgA;
      })
      .slice(0, 10);

    const data = {
      labels: sortedAsteroids.map(a => a.name.substring(0, 20)),
      datasets: [
        {
          label: 'Diameter (m)',
          data: sortedAsteroids.map(a => {
            const d = a.estimated_diameter.meters;
            return (d.estimated_diameter_min + d.estimated_diameter_max) / 2;
          }),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="chart-container">
        <h3>Top 10 Largest Asteroids</h3>
        <div className="chart-wrapper">
          <Bar data={data} options={chartOptions} />
        </div>
      </div>
    );
  }

  // Risk Score Trend
  const sortedByRisk = [...asteroids]
    .filter(a => a.risk_analysis?.score)
    .sort((a, b) => (b.risk_analysis?.score || 0) - (a.risk_analysis?.score || 0))
    .slice(0, 15);

  const data = {
    labels: sortedByRisk.map(a => a.name.substring(0, 20)),
    datasets: [
      {
        label: 'Risk Score',
        data: sortedByRisk.map(a => a.risk_analysis?.score || 0),
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ec4899',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Risk Score Trend</h3>
      <div className="chart-wrapper">
        <Line data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default AsteroidChart;
