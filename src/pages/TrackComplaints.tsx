
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText, AlertCircle } from "lucide-react";

interface Complaint {
  id: string;
  created_at: string;
  status: string;
  category: string;
  subject: string;
  description: string;
  location?: string;
}

const TrackComplaints = () => {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchComplaints();
    }
  }, [user, isLoggedIn, loading, navigate]);

  const fetchComplaints = async () => {
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

      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <FileText className="h-4 w-4" />;
      case "In Progress":
        return <AlertCircle className="h-4 w-4" />;
      case "Resolved":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Track Your Complaints</h1>
          <p className="text-gray-600">Monitor the status and progress of your submitted complaints</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by complaint ID, subject, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Complaints List */}
        {isLoading ? (
          <div className="text-center py-8">Loading complaints...</div>
        ) : filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No matching complaints found" : "No complaints submitted yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Submit your first complaint to get started"
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => navigate('/grievances')}
                  className="bg-municipal-orange hover:bg-orange-600"
                >
                  Submit a Complaint
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                      <CardDescription>
                        Complaint ID: {complaint.id.slice(0, 8)} • 
                        Category: {complaint.category} • 
                        Submitted: {new Date(complaint.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Description:</h4>
                      <p className="text-sm text-gray-600">{complaint.description}</p>
                    </div>
                    
                    {complaint.location && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Location:</h4>
                        <p className="text-sm text-gray-600">{complaint.location}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Last updated: {new Date(complaint.created_at).toLocaleDateString()}</span>
                        <span>Status: {complaint.status}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {complaints.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Complaint Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{complaints.length}</div>
                  <div className="text-sm text-gray-500">Total Complaints</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {complaints.filter(c => c.status === "Submitted").length}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {complaints.filter(c => c.status === "In Progress").length}
                  </div>
                  <div className="text-sm text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {complaints.filter(c => c.status === "Resolved").length}
                  </div>
                  <div className="text-sm text-gray-500">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TrackComplaints;
