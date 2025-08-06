
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

const marriageRegistrationFormSchema = z.object({
  husbandName: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  husbandAge: z.string().min(1, {
    message: "Age is required.",
  }),
  husbandAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  wifeName: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  wifeAge: z.string().min(1, {
    message: "Age is required.",
  }),
  wifeAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  marriageDate: z.string({
    required_error: "Marriage date is required",
  }),
  marriagePlace: z.string().min(5, {
    message: "Marriage place must be specified.",
  }),
  marriageType: z.string({
    required_error: "Please select marriage type",
  }),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be valid.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  witnessDetails: z.string().min(10, {
    message: "Witness details must be provided.",
  }),
});

export default function MarriageRegistrationForm() {
  const form = useForm<z.infer<typeof marriageRegistrationFormSchema>>({
    resolver: zodResolver(marriageRegistrationFormSchema),
    defaultValues: {
      husbandName: "",
      husbandAge: "",
      husbandAddress: "",
      wifeName: "",
      wifeAge: "",
      wifeAddress: "",
      marriageDate: "",
      marriagePlace: "",
      marriageType: "",
      mobileNumber: "",
      email: "",
      witnessDetails: "",
    },
  });

  function onSubmit(data: z.infer<typeof marriageRegistrationFormSchema>) {
    const applicationId = "MR" + Math.floor(100000 + Math.random() * 900000);
    
    toast({
      title: "Marriage Registration Application Submitted",
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
            <CardTitle>Marriage Registration</CardTitle>
            <CardDescription>
              Register marriages and get certificates
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Husband's Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="husbandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="husbandAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter age" min="18" max="120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="husbandAddress"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter complete address" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Wife's Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="wifeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wifeAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter age" min="18" max="120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="wifeAddress"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter complete address" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Marriage Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="marriageDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Marriage</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="marriageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marriage Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marriage type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hindu">Hindu Marriage Act</SelectItem>
                          <SelectItem value="special">Special Marriage Act</SelectItem>
                          <SelectItem value="christian">Christian Marriage Act</SelectItem>
                          <SelectItem value="muslim">Muslim Marriage</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="marriagePlace"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Place of Marriage</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter place where marriage took place" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="witnessDetails"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Witness Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter names and addresses of two witnesses" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Contact Details</h3>
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
            </div>

            <Button type="submit" className="w-full bg-municipal-orange hover:bg-orange-600">
              Submit Registration
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
