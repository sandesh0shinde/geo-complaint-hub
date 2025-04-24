
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [zonalOfficesOpen, setZonalOfficesOpen] = useState(false);

  const departments = [
    { id: 'water', name: 'Water Supply' },
    { id: 'sanitation', name: 'Sanitation' },
    { id: 'roads', name: 'Road Maintenance' },
    { id: 'property', name: 'Property Tax' },
    { id: 'health', name: 'Health' },
  ];

  const zonalOffices = [
    { id: 'north', name: 'North Zone' },
    { id: 'south', name: 'South Zone' },
    { id: 'east', name: 'East Zone' },
    { id: 'west', name: 'West Zone' },
    { id: 'central', name: 'Central Zone' },
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast({
            title: "Location detected",
            description: `Lat: ${latitude}, Long: ${longitude}`,
          });
        },
        (error) => {
          toast({
            title: "Error getting location",
            description: error.message,
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-municipal-orange">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/placeholder.svg" 
                alt="MNC Logo" 
                className="h-10 w-10 mr-3" 
              />
              <div>
                <h1 className="text-2xl font-bold text-municipal-text">MUNICIPAL CORPORATION</h1>
                <p className="text-sm text-municipal-text">Government of Maharashtra</p>
              </div>
            </div>

            <div className="flex space-x-10">
              <Link to="/" className="flex flex-col items-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Home" 
                  className="h-6 w-6" 
                />
                <span className="text-sm">Home</span>
              </Link>

              <Link to="/services" className="flex flex-col items-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Ticket" 
                  className="h-6 w-6" 
                />
                <span className="text-sm">Ticket</span>
              </Link>

              {isLoggedIn ? (
                <Link to="/profile" className="flex flex-col items-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Profile" 
                    className="h-6 w-6" 
                  />
                  <span className="text-sm">Profile</span>
                </Link>
              ) : (
                <Link to="/login" className="flex flex-col items-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="User" 
                    className="h-6 w-6" 
                  />
                  <span className="text-sm">Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex justify-between">
            <Link to="/about" className="px-6 py-4 border-r border-gray-200 hover:bg-gray-100">
              About MNC
            </Link>
            
            <div 
              className="px-6 py-4 border-r border-gray-200 hover:bg-gray-100 cursor-pointer relative group"
              onMouseEnter={() => setZonalOfficesOpen(true)}
              onMouseLeave={() => setZonalOfficesOpen(false)}
            >
              <div className="flex items-center">
                Zonal offices
                <ChevronDown className="ml-1 h-4 w-4" />
              </div>
              
              {zonalOfficesOpen && (
                <div className="absolute left-0 mt-4 w-48 bg-white shadow-lg z-10 border border-gray-200">
                  {zonalOffices.map((office) => (
                    <Link 
                      key={office.id}
                      to={`/zonal-office/${office.id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {office.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div 
              className="px-6 py-4 border-r border-gray-200 hover:bg-gray-100 cursor-pointer relative"
              onMouseEnter={() => setDepartmentsOpen(true)}
              onMouseLeave={() => setDepartmentsOpen(false)}
            >
              <div className="flex items-center">
                Departments
                <ChevronDown className="ml-1 h-4 w-4" />
              </div>
              
              {departmentsOpen && (
                <div className="absolute left-0 mt-4 w-48 bg-white shadow-lg z-10 border border-gray-200">
                  {departments.map((dept) => (
                    <Link 
                      key={dept.id}
                      to={`/department/${dept.id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {dept.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/services" className="px-6 py-4 border-r border-gray-200 hover:bg-gray-100">
              Services
            </Link>
            
            <Link to="/grievances" className="px-6 py-4 border-r border-gray-200 hover:bg-gray-100">
              Grievances
            </Link>
            
            <Link to="/contact" className="px-6 py-4 border-r border-gray-200 hover:bg-gray-100">
              Contact us
            </Link>
          </div>
        </div>
      </nav>

      {/* Alert Banner */}
      <div className="bg-municipal-green py-3 px-4 flex justify-between items-center">
        <p className="text-municipal-text">
          Welcome to Real-Time Public Service Management System! You can register your complaints here.
        </p>
        <button className="text-municipal-text focus:outline-none">×</button>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-municipal-footer text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Municipal Corporation</h3>
              <p className="text-sm">
                Municipal Corporation is responsible for delivering essential services to citizens
                and maintaining infrastructure to ensure quality of life in urban areas.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm hover:underline">Home</Link></li>
                <li><Link to="/about" className="text-sm hover:underline">About Us</Link></li>
                <li><Link to="/services" className="text-sm hover:underline">Services</Link></li>
                <li><Link to="/grievances" className="text-sm hover:underline">Grievances</Link></li>
                <li><Link to="/contact" className="text-sm hover:underline">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <address className="text-sm not-italic">
                Municipal Corporation Building<br />
                Main Street, Maharashtra<br />
                India<br />
                <br />
                Phone: +91 123 456 7890<br />
                Email: info@municipalcorp.gov.in
              </address>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-6 pt-6 flex justify-between items-center">
            <p className="text-sm">© 2023 Municipal Corporation. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-municipal-orange">
                <img src="/placeholder.svg" alt="Facebook" className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-municipal-orange">
                <img src="/placeholder.svg" alt="Twitter" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
