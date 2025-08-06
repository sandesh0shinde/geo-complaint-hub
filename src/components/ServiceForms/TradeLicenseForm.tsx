
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

const tradeLicenseFormSchema = z.object({
  applicationType: z.string({
    required_error: "Please select application type",
  }),
  businessName: z.string().min(3, {
    message: "Business name must be at least 3 characters.",
  }),
  ownerName: z.string().min(3, {
    message: "Owner name must be at least 3 characters.",
  }),
  businessType: z.string({
    required_error: "Please select business type",
  }),
  businessAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
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
  additionalInfo: z.string().optional(),
});

export default function TradeLicenseForm() {
  const form = useForm<z.infer<typeof tradeLicenseFormSchema>>({
    resolver: zodResolver(tradeLicenseFormSchema),
    defaultValues: {
      applicationType: "",
      businessName: "",
      ownerName: "",
      businessType: "",
      businessAddress: "",
      startDate: "",
      mobileNumber: "",
      email: "",
      additionalInfo: "",
    },
  });

  function onSubmit(data: z.infer<typeof tradeLicenseFormSchema>) {
    const applicationId = "TL" + Math.floor(100000 + Math.random() * 900000);
    
    toast({
      title: "Trade License Application Submitted",
      description: `Your application ID is: ${applicationId}. You will receive updates on your email.`,
    });
    
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
            <CardTitle>Trade License Application</CardTitle>
            <CardDescription>
              Apply for new trade license or renewal
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="applicationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select application type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New License</SelectItem>
                      <SelectItem value="renewal">License Renewal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter owner's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="retail">Retail Shop</SelectItem>
                      <SelectItem value="restaurant">Restaurant/Food</SelectItem>
                      <SelectItem value="service">Service Provider</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter complete business address" 
                      className="min-h-[80px]"
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
                  <FormLabel>Business Start Date</FormLabel>
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

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide any additional details about your business" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-municipal-orange hover:bg-orange-600">
              Submit Application
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
