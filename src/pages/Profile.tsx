
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { User, Settings, FileText, Shield, Users, Cog } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Complaint {
  id: string;
  date: string;
  status: string;
  category: string;
  subject: string;
  description: string;
}

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user complaints from localStorage
    const savedComplaints = localStorage.getItem("userComplaints");
    if (savedComplaints) {
      setUserComplaints(JSON.parse(savedComplaints));
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handleUpdateProfile = () => {
    // Update user info logic would go here
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleDepartmentSettings = () => {
    navigate('/admin/departments');
  };

  const handleSystemConfiguration = () => {
    navigate('/admin/system-config');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Complaints
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Panel
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} className="bg-municipal-orange hover:bg-orange-600">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>My Complaints</CardTitle>
                <CardDescription>
                  Track the status of your submitted complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userComplaints.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No complaints submitted yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userComplaints.map((complaint) => (
                      <div key={complaint.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{complaint.subject}</h3>
                            <p className="text-sm text-gray-600">ID: {complaint.id}</p>
                          </div>
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{complaint.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Category: {complaint.category}</span>
                          <span>Date: {complaint.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Department Management
                    </CardTitle>
                    <CardDescription>
                      Manage department settings and configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleDepartmentSettings}
                      className="w-full bg-municipal-orange hover:bg-orange-600"
                    >
                      Department Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cog className="h-5 w-5" />
                      System Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure system-wide settings and parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleSystemConfiguration}
                      className="w-full bg-municipal-orange hover:bg-orange-600"
                    >
                      System Configuration
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Complaint Overview
                    </CardTitle>
                    <CardDescription>
                      View and manage all user complaints
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Complaints:</span>
                        <span className="font-semibold">{userComplaints.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-semibold">
                          {userComplaints.filter(c => c.status === "Submitted").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress:</span>
                        <span className="font-semibold">
                          {userComplaints.filter(c => c.status === "In Progress").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolved:</span>
                        <span className="font-semibold">
                          {userComplaints.filter(c => c.status === "Resolved").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full">
                      View All Users
                    </Button>
                    <Button variant="outline" className="w-full">
                      Generate Reports
                    </Button>
                    <Button variant="outline" className="w-full">
                      System Logs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
