
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const buildingPermitFormSchema = z.object({
  ownerName: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  permitType: z.string({
    required_error: "Please select permit type",
  }),
  propertyAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  landArea: z.string().min(1, {
    message: "Land area is required.",
  }),
  buildingArea: z.string().min(1, {
    message: "Building area is required.",
  }),
  projectDescription: z.string().min(20, {
    message: "Project description must be at least 20 characters.",
  }),
  startDate: z.string({
    required_error: "Start date is required",
  }),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be valid.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function BuildingPermitForm() {
  const form = useForm<z.infer<typeof buildingPermitFormSchema>>({
    resolver: zodResolver(buildingPermitFormSchema),
    defaultValues: {
      ownerName: "",
      permitType: "",
      propertyAddress: "",
      landArea: "",
      buildingArea: "",
      projectDescription: "",
      startDate: "",
      mobileNumber: "",
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof buildingPermitFormSchema>) {
    const applicationId = "BP" + Math.floor(100000 + Math.random() * 900000);
    
    toast({
      title: "Building Permit Application Submitted",
      description: `Your application ID is: ${applicationId}. You will receive updates on your email.`,
    });
    
    console.log(data);
    form.reset();
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Link to="/services" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <CardTitle>Building Permit Application</CardTitle>
            <CardDescription>
              Apply for construction permits and approvals
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="permitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permit Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select permit type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New Construction</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="demolition">Demolition</SelectItem>
                        <SelectItem value="addition">Addition</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="propertyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter complete property address" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="landArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Land Area (sq. ft/sq. m)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2400 sq. ft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="buildingArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building Area (sq. ft/sq. m)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1800 sq. ft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your construction project" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 10-digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-municipal-orange hover:bg-orange-600">
              Submit Application
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
