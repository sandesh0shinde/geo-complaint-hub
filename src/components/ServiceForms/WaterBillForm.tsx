
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const waterBillFormSchema = z.object({
  consumerName: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  consumerNumber: z.string().min(5, {
    message: "Consumer number must be valid.",
  }),
  connectionAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  billMonth: z.string({
    required_error: "Please select billing month",
  }),
  billYear: z.string({
    required_error: "Please select billing year",
  }),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be valid.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function WaterBillForm() {
  const form = useForm<z.infer<typeof waterBillFormSchema>>({
    resolver: zodResolver(waterBillFormSchema),
    defaultValues: {
      consumerName: "",
      consumerNumber: "",
      connectionAddress: "",
      billMonth: "",
      billYear: "",
      mobileNumber: "",
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof waterBillFormSchema>) {
    const applicationId = "WB" + Math.floor(100000 + Math.random() * 900000);
    
    toast({
      title: "Water Bill Payment Initiated",
      description: `Your transaction ID is: ${applicationId}. You will receive payment confirmation on your email.`,
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
            <CardTitle>Water Bill Payment</CardTitle>
            <CardDescription>
              Pay your water bill online
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
                name="consumerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consumer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="consumerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consumer Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter water connection consumer number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="connectionAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter complete address of water connection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="billMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Month</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="billYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter year" min="2020" max="2030" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              Pay Water Bill
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
