
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const birthDeathFormSchema = z.object({
  certificateType: z.string({
    required_error: "Please select certificate type",
  }),
  applicantName: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  applicantRelation: z.string().min(2, {
    message: "Relation must be specified.",
  }),
  personName: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  date: z.string({
    required_error: "Date is required",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be valid.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  purpose: z.string().optional(),
});

export default function BirthDeathForm() {
  const form = useForm<z.infer<typeof birthDeathFormSchema>>({
    resolver: zodResolver(birthDeathFormSchema),
    defaultValues: {
      certificateType: "",
      applicantName: "",
      applicantRelation: "",
      personName: "",
      date: "",
      address: "",
      mobileNumber: "",
      email: "",
      purpose: "",
    },
  });

  function onSubmit(data: z.infer<typeof birthDeathFormSchema>) {
    const applicationId = "BD" + Math.floor(100000 + Math.random() * 900000);
    
    toast({
      title: "Application Submitted",
      description: `Your application ID is: ${applicationId}. Please save this for future reference.`,
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
            <CardTitle>Birth & Death Certificate Application</CardTitle>
            <CardDescription>
              Apply for birth or death certificates
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="certificateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select certificate type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="birth">Birth Certificate</SelectItem>
                      <SelectItem value="death">Death Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="applicantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applicant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="applicantRelation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relation to Person</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Self, Parent, Child" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="personName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Certificate</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name as it should appear on certificate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth/Death</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
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
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Reason for application" 
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
