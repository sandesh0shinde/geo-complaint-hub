
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { MapPin, FileText, Ticket } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ComplaintCategories from "@/components/ComplaintCategories";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().optional(),
});

interface Complaint {
  id: string;
  created_at: string;
  status: string;
  category: string;
  subject: string;
  description: string;
  location?: string;
}

const Grievances = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || "";

  const [locationText, setLocationText] = useState("");
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [complaintTicket, setComplaintTicket] = useState<Complaint | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: categoryParam,
      subject: "",
      description: "",
      location: "",
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name;
              setLocationText(address);
              form.setValue("location", address);
              
              toast({
                title: "Location detected",
                description: `Address captured successfully`,
              });
            })
            .catch(error => {
              console.error("Error fetching location details:", error);
              const locText = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
              setLocationText(locText);
              form.setValue("location", locText);
              
              toast({
                title: "Location detected",
                description: `Coordinates captured successfully`,
              });
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a complaint",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: complaint, error } = await supabase
        .from('complaints')
        .insert({
          user_id: user.id,
          category: data.category,
          subject: data.subject,
          description: data.description,
          location: data.location || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setComplaintTicket(complaint);
      setShowTicket(true);
      
      toast({
        title: "Complaint Registered",
        description: `Your complaint has been registered successfully. Complaint ID: ${complaint.id.slice(0, 8)}`,
      });
      
      form.reset();
      setLocationText("");
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAllComplaints = () => {
    navigate('/track-complaints');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Grievance Redressal System</h1>

        <div className="flex justify-end mb-4">
          <Button 
            onClick={handleViewAllComplaints}
            className="flex items-center gap-2 bg-municipal-orange hover:bg-orange-600"
          >
            <Ticket className="h-4 w-4" />
            Track Your Complaints
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>File a New Complaint</CardTitle>
            <CardDescription>
              Register your complaint regarding municipal services and infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="water">Water Supply</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                          <SelectItem value="streetlights">Street Lights</SelectItem>
                          <SelectItem value="roads">Roads</SelectItem>
                          <SelectItem value="garbage">Garbage Collection</SelectItem>
                          <SelectItem value="drainage">Drainage</SelectItem>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="parks">Parks & Recreation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief subject of your complaint" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide detailed information about your complaint"
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="Add location" 
                            {...field} 
                            value={locationText || field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              setLocationText(e.target.value);
                            }}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          onClick={handleGetLocation}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          Get Location
                        </Button>
                      </div>
                      <FormDescription>
                        Click "Get Location" to automatically capture your current location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-municipal-orange hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {complaintTicket && (
          <Dialog open={showTicket} onOpenChange={setShowTicket}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Ticket className="w-6 h-6 mr-2" /> Complaint Ticket Generated
                </DialogTitle>
                <DialogDescription>
                  Your complaint has been registered successfully
                </DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Complaint ID</p>
                      <p className="font-medium">{complaintTicket.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Date</p>
                      <p className="font-medium">{new Date(complaintTicket.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Status</p>
                      <p className="bg-amber-100 text-amber-800 inline-block px-2 py-1 rounded text-xs font-semibold">
                        {complaintTicket.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Category</p>
                      <p className="font-medium capitalize">{complaintTicket.category}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Subject</p>
                    <p className="font-medium">{complaintTicket.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-500">
                  Please save this complaint ID for future reference.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      setShowTicket(false);
                      navigate('/track-complaints');
                    }}
                    className="bg-municipal-orange hover:bg-orange-600"
                  >
                    View All Complaints
                  </Button>
                  <Button
                    onClick={() => setShowTicket(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Common Complaint Categories</h2>
          <ComplaintCategories />
        </div>
      </div>
    </Layout>
  );
};

export default Grievances;
