
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Search } from "lucide-react";
import ComplaintCategories from "@/components/ComplaintCategories";

const Index = () => {
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
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center my-8">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Register your complaint"
              className="pl-10 py-6 rounded-full border-gray-300"
            />
          </div>
          <Button 
            onClick={handleGetLocation}
            className="bg-municipal-orange hover:bg-orange-600 text-white flex items-center gap-2 py-6 px-6 rounded-full"
          >
            <MapPin className="h-5 w-5" />
            Get My Location
          </Button>
        </div>

        <ComplaintCategories />
      </div>
    </Layout>
  );
};

export default Index;
