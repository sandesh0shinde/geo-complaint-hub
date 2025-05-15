
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ComplaintTicket {
  id: string;
  date: string;
  status: string;
  category: string;
  subject: string;
  description: string;
}

const TrackComplaints = () => {
  const [ticketId, setTicketId] = useState("");
  const [searchedTicket, setSearchedTicket] = useState<ComplaintTicket | null>(null);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(() => {
    // Try to load complaints from localStorage
    const savedComplaints = localStorage.getItem("userComplaints");
    return savedComplaints ? JSON.parse(savedComplaints) : [];
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid ticket ID",
        variant: "destructive",
      });
      return;
    }

    const foundTicket = complaints.find(complaint => complaint.id === ticketId);
    
    if (foundTicket) {
      setSearchedTicket(foundTicket);
    } else {
      toast({
        title: "Ticket Not Found",
        description: "No complaint found with the provided ticket ID.",
        variant: "destructive",
      });
      setSearchedTicket(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Complaints</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-6 w-6" />
              Search Complaint Status
            </CardTitle>
            <CardDescription>
              Enter your complaint ticket ID to check its status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="Enter Ticket ID (e.g., MNC123456)"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-municipal-orange hover:bg-orange-600">
                Track Complaint
              </Button>
            </form>
            
            {searchedTicket && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Complaint Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Ticket ID</p>
                        <p className="font-medium">{searchedTicket.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Date Filed</p>
                        <p className="font-medium">{searchedTicket.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Status</p>
                        <p className={`inline-block px-2 py-1 rounded text-xs font-semibold
                          ${searchedTicket.status === "Submitted" ? "bg-amber-100 text-amber-800" : 
                          searchedTicket.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                          searchedTicket.status === "Resolved" ? "bg-green-100 text-green-800" : 
                          "bg-gray-100 text-gray-800"}`}>
                          {searchedTicket.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Category</p>
                        <p className="font-medium capitalize">{searchedTicket.category}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Subject</p>
                      <p className="font-medium">{searchedTicket.subject}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Description</p>
                      <p className="font-medium">{searchedTicket.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {complaints.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Complaints</CardTitle>
              <CardDescription>
                A list of all the complaints you've filed recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id} className="cursor-pointer hover:bg-slate-50" 
                        onClick={() => {
                          setTicketId(complaint.id);
                          setSearchedTicket(complaint);
                        }}>
                        <TableCell className="font-medium">{complaint.id}</TableCell>
                        <TableCell>{complaint.date}</TableCell>
                        <TableCell className="capitalize">{complaint.category}</TableCell>
                        <TableCell>{complaint.subject}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                            ${complaint.status === "Submitted" ? "bg-amber-100 text-amber-800" : 
                            complaint.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                            complaint.status === "Resolved" ? "bg-green-100 text-green-800" : 
                            "bg-gray-100 text-gray-800"}`}>
                            {complaint.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TrackComplaints;
