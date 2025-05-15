
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { FileText, Home, Droplet, Store, Building, Heart } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: 'birth-death',
      title: 'Birth & Death Certificates',
      description: 'Apply for birth or death certificates',
      icon: <FileText className="h-6 w-6" />,
      path: '/services/birth-death-certificate'
    },
    {
      id: 'property-tax',
      title: 'Property Tax',
      description: 'Pay your property tax online',
      icon: <Home className="h-6 w-6" />,
      path: '/services/property-tax'
    },
    {
      id: 'water-bill',
      title: 'Water Bill Payment',
      description: 'Pay your water bills online',
      icon: <Droplet className="h-6 w-6" />,
      path: '/services/water-bill'
    },
    {
      id: 'trade-license',
      title: 'Trade License',
      description: 'Apply for new trade license or renewal',
      icon: <Store className="h-6 w-6" />,
      path: '/services/trade-license'
    },
    {
      id: 'building-permit',
      title: 'Building Permits',
      description: 'Apply for construction permits and approvals',
      icon: <Building className="h-6 w-6" />,
      path: '/services/building-permit'
    },
    {
      id: 'marriage-registration',
      title: 'Marriage Registration',
      description: 'Register marriages and get certificates',
      icon: <Heart className="h-6 w-6" />,
      path: '/services/marriage-registration'
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>

        <Tabs defaultValue="online-services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="online-services">Online Services</TabsTrigger>
            <TabsTrigger value="complaints">File Complaints</TabsTrigger>
          </TabsList>
          
          <TabsContent value="online-services">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center mb-2">
                      <span className="text-3xl mr-2">{service.icon}</span>
                      <CardTitle>{service.title}</CardTitle>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={service.path}>
                      <Button className="w-full bg-municipal-orange hover:bg-orange-600">
                        Access Service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="complaints">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Register Your Complaints</CardTitle>
                <CardDescription>
                  File a complaint regarding municipal services and infrastructural issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  You can register complaints related to various municipal services and infrastructure issues. Our team will address your concerns promptly.
                </p>
                <Link to="/grievances">
                  <Button className="bg-municipal-orange hover:bg-orange-600">
                    Go to Complaints Section
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>How to Access Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Step 1: Register/Login</h3>
                  <p className="text-gray-600">Create an account or login to your existing account to access our services.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Step 2: Select Service</h3>
                  <p className="text-gray-600">Choose the service you want to access from our list of online services.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Step 3: Submit Application</h3>
                  <p className="text-gray-600">Fill the required details and submit your application online.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
