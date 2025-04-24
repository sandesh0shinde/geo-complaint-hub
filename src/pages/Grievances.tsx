
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ComplaintCategories from "@/components/ComplaintCategories";

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().optional(),
});

const Grievances = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || "";

  const [locationText, setLocationText] = useState("");
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: categoryParam,
      subject: "",
      description: "",
      location: "",
    },
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setLocationText(`Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`);
          
          // You would normally use a reverse geocoding service here
          // For now, we'll just use the coordinates
          form.setValue("location", `${latitude.toFixed(6)},${longitude.toFixed(6)}`);
          
          toast({
            title: "Location detected",
            description: `Coordinates captured successfully`,
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: "Complaint Registered",
      description: "Your complaint has been registered successfully. Complaint ID: MNC" + Math.floor(100000 + Math.random() * 900000),
    });
    form.reset();
    setLocationText("");
    setCoordinates(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Grievance Redressal System</h1>

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
                
                <Button type="submit" className="w-full bg-municipal-orange hover:bg-orange-600">
                  Submit Complaint
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Common Complaint Categories</h2>
          <ComplaintCategories />
        </div>
      </div>
    </Layout>
  );
};

export default Grievances;
