
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">About Municipal Corporation</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Serving the community effectively</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our mission is to provide effective and efficient municipal services that enhance the quality of life for all citizens. We strive to create sustainable urban development, maintain essential infrastructure, and ensure public health and safety.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
              <CardDescription>Building a better tomorrow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We envision a city that is clean, green, and well-maintained, where citizens enjoy high-quality municipal services and actively participate in governance. We aim to become a model municipal corporation known for transparency, accountability, and citizen satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>History & Background</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                The Municipal Corporation was established in 1980 under the Municipal Corporation Act to administer the urban local governance. Since its inception, the corporation has played a crucial role in urban development, providing essential services, and implementing various welfare schemes.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we have grown to serve a population of over 2 million citizens across 5 zones and 50 wards. Our dedicated team of municipal employees works tirelessly to address the needs and concerns of citizens and improve the quality of urban life.
              </p>
              <p className="text-gray-700">
                Today, we continue to embrace technology and innovation to enhance our service delivery and make governance more accessible to citizens through initiatives like this online platform.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Core Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Transparency</h3>
                  <p className="text-gray-600">We believe in open governance and transparent operations to build trust with citizens.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Accountability</h3>
                  <p className="text-gray-600">We take responsibility for our actions and are accountable to the citizens we serve.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Efficiency</h3>
                  <p className="text-gray-600">We strive to optimize resources and deliver services efficiently and effectively.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Inclusivity</h3>
                  <p className="text-gray-600">We ensure our services reach all sections of society without discrimination.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                  <p className="text-gray-600">We embrace new technologies and innovative solutions to urban challenges.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Sustainability</h3>
                  <p className="text-gray-600">We are committed to environmentally sustainable practices in urban development.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;
