
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Department = () => {
  const { id } = useParams<{ id: string }>();

  // Department data based on ID
  const departments = {
    water: {
      name: "Water Supply Department",
      description: "Responsible for water supply, treatment, and distribution",
      services: [
        "Drinking water supply",
        "Water quality testing",
        "New water connection",
        "Repair of water pipelines",
        "Water tanker supply in shortage areas"
      ],
      officials: [
        { name: "Mr. Rajesh Kumar", designation: "Water Supply Officer" },
        { name: "Ms. Priya Singh", designation: "Assistant Engineer" }
      ],
      contactInfo: {
        phone: "+91 123 456 7890",
        email: "water@municipalcorp.gov.in",
        office: "2nd Floor, Municipal Corporation Building"
      }
    },
    sanitation: {
      name: "Sanitation Department",
      description: "Responsible for maintaining cleanliness and hygiene in the city",
      services: [
        "Waste collection and disposal",
        "Public toilet maintenance",
        "Drainage cleaning",
        "Street cleaning",
        "Pest control"
      ],
      officials: [
        { name: "Dr. Anand Verma", designation: "Chief Sanitation Officer" },
        { name: "Mr. Prakash Jha", designation: "Sanitation Inspector" }
      ],
      contactInfo: {
        phone: "+91 123 456 7891",
        email: "sanitation@municipalcorp.gov.in",
        office: "3rd Floor, Municipal Corporation Building"
      }
    },
    roads: {
      name: "Road Maintenance Department",
      description: "Responsible for construction and maintenance of roads",
      services: [
        "Road construction",
        "Road repairs and maintenance",
        "Footpath maintenance",
        "Traffic signage installation",
        "Street lighting"
      ],
      officials: [
        { name: "Mr. Suresh Patil", designation: "Chief Engineer (Roads)" },
        { name: "Ms. Kavita Sharma", designation: "Deputy Engineer" }
      ],
      contactInfo: {
        phone: "+91 123 456 7892",
        email: "roads@municipalcorp.gov.in",
        office: "4th Floor, Municipal Corporation Building"
      }
    },
    property: {
      name: "Property Tax Department",
      description: "Responsible for assessment and collection of property tax",
      services: [
        "Property tax assessment",
        "Tax collection",
        "Property mutation",
        "Tax exemption processing",
        "Building plan approval"
      ],
      officials: [
        { name: "Mr. Deepak Desai", designation: "Property Tax Officer" },
        { name: "Ms. Nisha Patel", designation: "Assessment Officer" }
      ],
      contactInfo: {
        phone: "+91 123 456 7893",
        email: "property@municipalcorp.gov.in",
        office: "1st Floor, Municipal Corporation Building"
      }
    },
    health: {
      name: "Health Department",
      description: "Responsible for public health services and medical facilities",
      services: [
        "Public health programs",
        "Medical facilities management",
        "Vaccination drives",
        "Health awareness campaigns",
        "Disease control measures"
      ],
      officials: [
        { name: "Dr. Meera Joshi", designation: "Chief Medical Officer" },
        { name: "Dr. Ashok Gupta", designation: "Deputy Health Officer" }
      ],
      contactInfo: {
        phone: "+91 123 456 7894",
        email: "health@municipalcorp.gov.in",
        office: "5th Floor, Municipal Corporation Building"
      }
    }
  };

  const deptInfo = departments[id as keyof typeof departments] || {
    name: "Department Information",
    description: "Department details not found",
    services: [],
    officials: [],
    contactInfo: { phone: "", email: "", office: "" }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">{deptInfo.name}</h1>
        <p className="text-center text-gray-600 mb-8">{deptInfo.description}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
              <CardDescription>List of services provided by this department</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {deptInfo.services.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-municipal-orange mr-2">•</span>
                    {service}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Department Officials</CardTitle>
              <CardDescription>Key officials in charge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptInfo.officials.map((official, index) => (
                  <div key={index} className="border-b pb-3 border-gray-200 last:border-0">
                    <h3 className="font-semibold">{official.name}</h3>
                    <p className="text-sm text-gray-600">{official.designation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How to reach this department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Phone: </span>
                  <span>{deptInfo.contactInfo.phone}</span>
                </div>
                <div>
                  <span className="font-semibold">Email: </span>
                  <span>{deptInfo.contactInfo.email}</span>
                </div>
                <div>
                  <span className="font-semibold">Office: </span>
                  <span>{deptInfo.contactInfo.office}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Report an Issue</CardTitle>
              <CardDescription>File a complaint related to this department</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you want to report an issue related to {deptInfo.name}, please use our grievance redressal system.
              </p>
              <a href="/grievances" className="text-municipal-orange hover:underline">
                Go to Grievance Portal →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Department;
