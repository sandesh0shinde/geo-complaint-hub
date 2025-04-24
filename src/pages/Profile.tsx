
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
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
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              <CardDescription>Manage your account and view your complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="bg-municipal-orange text-white h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Your Recent Complaints</h4>
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
                </div>
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

export default Profile;
