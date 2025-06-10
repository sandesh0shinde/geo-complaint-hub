
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
import { supabase } from "@/integrations/supabase/client";

interface Complaint {
  id: string;
  created_at: string;
  status: string;
  category: string;
  subject: string;
  description: string;
  location?: string;
}

const Profile = () => {
  const { user, userProfile, logout, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [userInfo, setUserInfo] = useState({
    full_name: userProfile?.full_name || "",
    phone_number: userProfile?.phone_number || "",
    address: userProfile?.address || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (userProfile) {
      setUserInfo({
        full_name: userProfile.full_name || "",
        phone_number: userProfile.phone_number || "",
        address: userProfile.address || "",
      });
    }
  }, [user, userProfile, navigate, loading]);

  useEffect(() => {
    if (user) {
      fetchUserComplaints();
      if (isAdmin) {
        fetchAllComplaints();
      }
    }
  }, [user, isAdmin]);

  const fetchUserComplaints = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching complaints:', error);
        return;
      }

      setUserComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchAllComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all complaints:', error);
        return;
      }

      setAllComplaints(data || []);
    } catch (error) {
      console.error('Error fetching all complaints:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: userInfo.full_name,
          phone_number: userInfo.phone_number || null,
          address: userInfo.address || null,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 flex justify-center">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const complaintsToShow = isAdmin ? allComplaints : userComplaints;

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
              {isAdmin ? "All Complaints" : "My Complaints"}
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
                      value={userInfo.full_name}
                      onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone_number}
                      onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
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
                <Button 
                  onClick={handleUpdateProfile} 
                  className="bg-municipal-orange hover:bg-orange-600"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>{isAdmin ? "All Complaints" : "My Complaints"}</CardTitle>
                <CardDescription>
                  {isAdmin ? "View and manage all user complaints" : "Track the status of your submitted complaints"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complaintsToShow.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No complaints {isAdmin ? "in the system" : "submitted"} yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {complaintsToShow.map((complaint) => (
                      <div key={complaint.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{complaint.subject}</h3>
                            <p className="text-sm text-gray-600">ID: {complaint.id.slice(0, 8)}</p>
                          </div>
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{complaint.description}</p>
                        {complaint.location && (
                          <p className="text-sm text-gray-600 mb-2">Location: {complaint.location}</p>
                        )}
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Category: {complaint.category}</span>
                          <span>Date: {new Date(complaint.created_at).toLocaleDateString()}</span>
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
                        <span className="font-semibold">{allComplaints.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-semibold">
                          {allComplaints.filter(c => c.status === "Submitted").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress:</span>
                        <span className="font-semibold">
                          {allComplaints.filter(c => c.status === "In Progress").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolved:</span>
                        <span className="font-semibold">
                          {allComplaints.filter(c => c.status === "Resolved").length}
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
                      Generate Reports
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      System Settings
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
