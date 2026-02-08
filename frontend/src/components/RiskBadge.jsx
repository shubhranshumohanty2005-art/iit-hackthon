import './RiskBadge.css';

const RiskBadge = ({ level }) => {
  const getBadgeClass = () => {
    switch (level) {
      case 'CRITICAL':
        return 'badge badge-critical';
      case 'HIGH':
        return 'badge badge-high';
      case 'MEDIUM':
        return 'badge badge-medium';
      case 'LOW':
        return 'badge badge-low';
      default:
        return 'badge badge-low';
    }
  };

  return (
    <span className={getBadgeClass()}>
      {level}
    </span>
  );
};

export default RiskBadge;
