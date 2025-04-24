
import { Link } from 'react-router-dom';

const ComplaintCategories = () => {
  const complaints = [
    { id: 'water', name: 'No Water Supply', icon: '💧' },
    { id: 'sanitation', name: 'Sanitation Problem', icon: '🧹' },
    { id: 'streetlights', name: 'No Street Lights', icon: '💡' },
    { id: 'roads', name: 'Road Issues', icon: '🛣️' },
    { id: 'garbage', name: 'Garbage Collection', icon: '♻️' },
    { id: 'drainage', name: 'Drainage Problem', icon: '🚿' },
    { id: 'electricity', name: 'Electricity Issues', icon: '⚡' },
    { id: 'parks', name: 'Parks & Recreation', icon: '🌳' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {complaints.map((complaint) => (
        <Link 
          key={complaint.id} 
          to={`/grievances?category=${complaint.id}`}
          className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center"
        >
          <span className="text-3xl mr-3">{complaint.icon}</span>
          <span>{complaint.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default ComplaintCategories;
