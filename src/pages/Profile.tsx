
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Define complaint type
interface Complaint {
  id: string;
  date: string;
  status: string;
  category: string;
  subject: string;
  description: string;
}

const Profile = () => {
  const { user, isLoggedIn, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Access Denied",
        description: "Please login to view your profile",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Load complaints from localStorage
    if (isLoggedIn) {
      const savedComplaints = localStorage.getItem("userComplaints");
      if (savedComplaints) {
        setComplaints(JSON.parse(savedComplaints));
      }
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const getFilteredComplaints = () => {
    if (activeTab === "all") return complaints;
    return complaints.filter(complaint => complaint.status.toLowerCase() === activeTab);
  };

  const updateComplaintStatus = (complaintId: string, newStatus: string) => {
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return { ...complaint, status: newStatus };
      }
      return complaint;
    });
    
    setComplaints(updatedComplaints);
    localStorage.setItem("userComplaints", JSON.stringify(updatedComplaints));
    
    toast({
      title: "Status Updated",
      description: `Complaint ${complaintId} status changed to ${newStatus}`,
    });
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Your Profile</CardTitle>
                  <CardDescription>Manage your account and view your complaints</CardDescription>
                </div>
                {isAdmin && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    Administrator
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className={`${isAdmin ? "bg-blue-600" : "bg-municipal-orange"} text-white h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    {isAdmin && (
                      <p className="text-sm text-blue-600 mt-1">Municipal Administrator</p>
                    )}
                  </div>
                </div>

                {isAdmin ? (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Administration Panel</h4>
                    
                    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                      <div className="mb-4">
                        <h5 className="text-md font-semibold mb-2">Manage Grievances</h5>
                        <TabsList className="w-full grid grid-cols-4">
                          <TabsTrigger value="all">All Complaints</TabsTrigger>
                          <TabsTrigger value="submitted">New</TabsTrigger>
                          <TabsTrigger value="in progress">In Progress</TabsTrigger>
                          <TabsTrigger value="resolved">Resolved</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="all" className="border rounded-md p-4">
                        {complaints.length > 0 ? (
                          <ComplaintTable 
                            complaints={getFilteredComplaints()} 
                            isAdmin={true} 
                            onUpdateStatus={updateComplaintStatus} 
                          />
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            No complaints registered in the system yet.
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="submitted" className="border rounded-md p-4">
                        {getFilteredComplaints().length > 0 ? (
                          <ComplaintTable 
                            complaints={getFilteredComplaints()} 
                            isAdmin={true} 
                            onUpdateStatus={updateComplaintStatus} 
                          />
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            No new complaints.
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="in progress" className="border rounded-md p-4">
                        {getFilteredComplaints().length > 0 ? (
                          <ComplaintTable 
                            complaints={getFilteredComplaints()} 
                            isAdmin={true} 
                            onUpdateStatus={updateComplaintStatus} 
                          />
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            No complaints in progress.
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="resolved" className="border rounded-md p-4">
                        {getFilteredComplaints().length > 0 ? (
                          <ComplaintTable 
                            complaints={getFilteredComplaints()} 
                            isAdmin={true} 
                            onUpdateStatus={updateComplaintStatus} 
                          />
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            No resolved complaints.
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        Department Settings
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        System Configuration
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Your Recent Complaints</h4>
                    {complaints.length > 0 ? (
                      <ComplaintTable 
                        complaints={complaints} 
                        isAdmin={false} 
                      />
                    ) : (
                      <div className="bg-gray-100 p-6 rounded-md text-center">
                        <p className="text-muted-foreground">You haven't filed any complaints yet.</p>
                        <Button 
                          variant="link" 
                          onClick={() => navigate("/grievances")}
                          className="text-municipal-orange"
                        >
                          File a new complaint
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// Complaint Table component
interface ComplaintTableProps {
  complaints: Complaint[];
  isAdmin: boolean;
  onUpdateStatus?: (complaintId: string, status: string) => void;
}

const ComplaintTable = ({ complaints, isAdmin, onUpdateStatus }: ComplaintTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map(complaint => (
            <TableRow key={complaint.id}>
              <TableCell className="font-medium">{complaint.id}</TableCell>
              <TableCell>{complaint.date}</TableCell>
              <TableCell className="capitalize">{complaint.category}</TableCell>
              <TableCell>{complaint.subject}</TableCell>
              <TableCell>
                <StatusBadge status={complaint.status} />
              </TableCell>
              {isAdmin && onUpdateStatus && (
                <TableCell>
                  <div className="flex gap-2">
                    {complaint.status === "Submitted" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onUpdateStatus(complaint.id, "In Progress")}
                      >
                        Start Progress
                      </Button>
                    )}
                    {complaint.status === "In Progress" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onUpdateStatus(complaint.id, "Resolved")}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {complaint.status === "Resolved" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onUpdateStatus(complaint.id, "Closed")}
                        disabled={complaint.status === "Closed"}
                      >
                        Close Case
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let className = "bg-gray-100 text-gray-800";
  
  switch (status) {
    case "Submitted":
      className = "bg-amber-100 text-amber-800";
      break;
    case "In Progress":
      className = "bg-blue-100 text-blue-800";
      break;
    case "Resolved":
      className = "bg-green-100 text-green-800";
      break;
    case "Closed":
      className = "bg-gray-100 text-gray-800";
      break;
  }
  
  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  );
};

export default Profile;
