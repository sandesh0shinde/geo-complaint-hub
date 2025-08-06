import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { User, Settings, FileText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminPanel } from "@/components/AdminPanel";
import { UserComplaints } from "@/components/UserComplaints";
import { Loading } from "@/components/ui/loading";

interface Complaint {
  id: string;
  created_at: string;
  status: string;
  category: string;
  subject: string;
  description: string;
  location?: string;
}

interface AdminStats {
  total_users: number;
  total_admins: number;
  total_complaints: number;
  pending_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  complaints_last_30_days: number;
  new_users_last_30_days: number;
}

const Profile = () => {
  const { user, userProfile, logout, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
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

  const fetchUserComplaints = useCallback(async () => {
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
  }, [user]);

  const fetchAllComplaints = useCallback(async () => {
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
  }, []);

  const fetchAdminStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_admin_dashboard_stats');

      if (error) {
        console.error('Error fetching admin stats:', error);
        return;
      }

      setAdminStats(data[0] || null); // Function returns an array with one result
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserComplaints();
      if (isAdmin) {
        fetchAllComplaints();
        fetchAdminStats();
      }
    }
  }, [user, isAdmin, fetchUserComplaints, fetchAllComplaints, fetchAdminStats]);

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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 flex justify-center">
          <Loading size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Complaints
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Personal Information
                </CardTitle>
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
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone_number}
                      onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleUpdateProfile} 
                  className="bg-primary hover:bg-primary/90"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <UserComplaints userComplaints={userComplaints} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <AdminPanel 
                allComplaints={allComplaints}
                adminStats={adminStats}
                onRefreshStats={fetchAdminStats}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;