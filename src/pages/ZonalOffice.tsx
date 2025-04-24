
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ZonalOffice = () => {
  const { id } = useParams<{ id: string }>();

  // Zonal office data based on ID
  const zonalOffices = {
    north: {
      name: "North Zone Office",
      description: "Serves the northern areas of the city",
      address: "123 North Avenue, Northern District",
      timings: "9:00 AM to 5:00 PM (Mon-Sat)",
      phone: "+91 123 456 7801",
      email: "north@municipalcorp.gov.in",
      officials: [
        { name: "Mr. Ajay Malik", designation: "Zonal Officer" },
        { name: "Ms. Deepika Rao", designation: "Deputy Zonal Officer" }
      ],
      areas: [
        "Northville",
        "Uptown",
        "Highland Park",
        "Northern Suburbs",
        "North Industrial Area"
      ]
    },
    south: {
      name: "South Zone Office",
      description: "Serves the southern areas of the city",
      address: "456 South Street, Southern District",
      timings: "9:00 AM to 5:00 PM (Mon-Sat)",
      phone: "+91 123 456 7802",
      email: "south@municipalcorp.gov.in",
      officials: [
        { name: "Ms. Sunita Sharma", designation: "Zonal Officer" },
        { name: "Mr. Rahul Kapoor", designation: "Deputy Zonal Officer" }
      ],
      areas: [
        "Southside",
        "Downtown",
        "South Extension",
        "Marina Bay",
        "Southern Heights"
      ]
    },
    east: {
      name: "East Zone Office",
      description: "Serves the eastern areas of the city",
      address: "789 East Road, Eastern District",
      timings: "9:00 AM to 5:00 PM (Mon-Sat)",
      phone: "+91 123 456 7803",
      email: "east@municipalcorp.gov.in",
      officials: [
        { name: "Mr. Vikram Singh", designation: "Zonal Officer" },
        { name: "Ms. Pooja Mehta", designation: "Deputy Zonal Officer" }
      ],
      areas: [
        "Eastwood",
        "Sunrise Colony",
        "Eastern Suburbs",
        "New East Extension",
        "East Industrial Zone"
      ]
    },
    west: {
      name: "West Zone Office",
      description: "Serves the western areas of the city",
      address: "321 West Boulevard, Western District",
      timings: "9:00 AM to 5:00 PM (Mon-Sat)",
      phone: "+91 123 456 7804",
      email: "west@municipalcorp.gov.in",
      officials: [
        { name: "Ms. Anita Desai", designation: "Zonal Officer" },
        { name: "Mr. Karan Malhotra", designation: "Deputy Zonal Officer" }
      ],
      areas: [
        "Westside",
        "Sunset Valley",
        "Western Heights",
        "West End",
        "Western Business District"
      ]
    },
    central: {
      name: "Central Zone Office",
      description: "Serves the central areas of the city",
      address: "555 Central Plaza, City Center",
      timings: "9:00 AM to 5:00 PM (Mon-Sat)",
      phone: "+91 123 456 7805",
      email: "central@municipalcorp.gov.in",
      officials: [
        { name: "Mr. Sanjay Gupta", designation: "Zonal Officer" },
        { name: "Ms. Priyanka Joshi", designation: "Deputy Zonal Officer" }
      ],
      areas: [
        "City Center",
        "Old Town",
        "Central Market",
        "Civic Quarter",
        "Municipal Colony"
      ]
    }
  };

  const zoneInfo = zonalOffices[id as keyof typeof zonalOffices] || {
    name: "Zonal Office",
    description: "Zone information not found",
    address: "",
    timings: "",
    phone: "",
    email: "",
    officials: [],
    areas: []
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">{zoneInfo.name}</h1>
        <p className="text-center text-gray-600 mb-8">{zoneInfo.description}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Office Information</CardTitle>
              <CardDescription>Details about this zonal office</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Address:</h3>
                <p className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-municipal-orange flex-shrink-0 mt-0.5" />
                  <span>{zoneInfo.address}</span>
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Office Timings:</h3>
                <p>{zoneInfo.timings}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Contact:</h3>
                <p>Phone: {zoneInfo.phone}</p>
                <p>Email: {zoneInfo.email}</p>
              </div>
              
              <Button className="bg-municipal-orange hover:bg-orange-600 mt-2">
                Get Directions
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Officials</CardTitle>
              <CardDescription>Officials in charge of this zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneInfo.officials.map((official, index) => (
                  <div key={index} className="flex items-center p-3 border-b border-gray-100 last:border-0">
                    <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center text-municipal-orange font-bold mr-4">
                      {official.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{official.name}</h3>
                      <p className="text-sm text-gray-600">{official.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Areas Covered</CardTitle>
              <CardDescription>This zonal office serves the following areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {zoneInfo.areas.map((area, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    {area}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Services & Complaints</CardTitle>
              <CardDescription>Access services or register complaints for this zone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/services" className="block">
                  <Button variant="outline" className="w-full">Access Services</Button>
                </Link>
                <Link to="/grievances" className="block">
                  <Button className="w-full bg-municipal-orange hover:bg-orange-600">
                    Register a Complaint
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ZonalOffice;
