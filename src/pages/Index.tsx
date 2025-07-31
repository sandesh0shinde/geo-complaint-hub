
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Search } from "lucide-react";
import ComplaintCategories from "@/components/ComplaintCategories";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name;
              const city = data.address.city || data.address.town || data.address.village || 'Unknown location';
              const state = data.address.state || '';
              
              toast({
                title: "Location detected",
                description: `${city}, ${state}`,
              });
            })
            .catch(error => {
              console.error("Error fetching location details:", error);
              toast({
                title: "Location detected",
                description: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              });
            })
            .finally(() => {
              setIsLoading(false);
            });
        },
        (error) => {
          setIsLoading(false);
          toast({
            title: "Error getting location",
            description: error.message,
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    if (!isLoggedIn) {
      toast({
        title: "Please log in",
        description: "You need to log in to submit a complaint",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (searchQuery.trim()) {
      navigate(`/grievances?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/grievances');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Municipal Grievance Portal
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Register your complaint and track its progress
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center my-8">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Describe your complaint..."
              className="pl-10 py-6 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 py-6 px-6 rounded-full"
          >
            <Search className="h-5 w-5" />
            Submit Complaint
          </Button>
        </div>

        <div className="flex justify-center mb-8">
          <Button 
            onClick={handleGetLocation}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MapPin className="h-5 w-5" />
            {isLoading ? 'Detecting...' : 'Get My Location'}
          </Button>
        </div>

        {!isLoggedIn && (
          <div className="bg-accent border border-border rounded-lg p-4 mb-8 text-center">
            <p className="text-accent-foreground mb-2">
              To submit and track complaints, please log in to your account.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary/90"
            >
              Login / Register
            </Button>
          </div>
        )}

        <ComplaintCategories />
      </div>
    </Layout>
  );
};

export default Index;
