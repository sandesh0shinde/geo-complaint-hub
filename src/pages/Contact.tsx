
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully. We will get back to you soon.",
    });
    // Reset the form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill the form below to get in touch with us</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email address" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Subject of your message" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message" className="min-h-[150px]" required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-municipal-orange hover:bg-orange-600">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Different ways to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Municipal Corporation Office</h3>
                  <address className="not-italic">
                    Municipal Corporation Building<br />
                    Main Street, Maharashtra<br />
                    India
                  </address>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone Numbers</h3>
                  <p>Main Office: +91 123 456 7890</p>
                  <p>Helpdesk: +91 123 456 7891</p>
                  <p>Emergency: +91 123 456 7892</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Addresses</h3>
                  <p>General Inquiries: info@municipalcorp.gov.in</p>
                  <p>Complaints: complaints@municipalcorp.gov.in</p>
                  <p>Technical Support: support@municipalcorp.gov.in</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-1">Office Hours</h3>
                  <p>Monday to Friday: 9:00 AM to 5:00 PM</p>
                  <p>Saturday: 9:00 AM to 1:00 PM</p>
                  <p>Sunday & Public Holidays: Closed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <span>Fire Emergency</span>
                    <span className="font-bold">101</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                    <span>Police</span>
                    <span className="font-bold">100</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                    <span>Ambulance</span>
                    <span className="font-bold">102</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md">
                    <span>Disaster Management</span>
                    <span className="font-bold">108</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
