import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Shield, Users, UserPlus, UserMinus, Activity, TrendingUp } from "lucide-react";
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

interface AdminPanelProps {
  allComplaints: Complaint[];
  adminStats: AdminStats | null;
  onRefreshStats: () => void;
}

export const AdminPanel = ({ allComplaints, adminStats, onRefreshStats }: AdminPanelProps) => {
  const [promoteEmail, setPromoteEmail] = useState("");
  const [revokeEmail, setRevokeEmail] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const handlePromoteUser = async () => {
    if (!promoteEmail.trim()) return;

    // Validate government email domain
    const governmentDomains = ['@municipal.gov', '@gov.in', '@city.gov'];
    const hasValidDomain = governmentDomains.some(domain => 
      promoteEmail.toLowerCase().includes(domain)
    );

    if (!hasValidDomain) {
      toast({
        title: "Invalid Email Domain",
        description: "Admin users must have a government domain email (@municipal.gov, @gov.in, @city.gov)",
        variant: "destructive",
      });
      return;
    }

    setIsPromoting(true);
    try {
      const { error } = await supabase.rpc('promote_user_to_admin_secure', {
        user_email: promoteEmail.trim(),
        justification: `Admin promotion via dashboard for ${promoteEmail}`,
        ip_address: null,
        user_agent: navigator.userAgent
      });

      if (error) {
        throw error;
      }

      toast({
        title: "User promoted",
        description: `${promoteEmail} has been promoted to admin.`,
      });
      setPromoteEmail("");
      onRefreshStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user. Please check the email and try again.",
        variant: "destructive",
      });
    } finally {
      setIsPromoting(false);
    }
  };

  const handleRevokeAdmin = async () => {
    if (!revokeEmail.trim()) return;

    setIsRevoking(true);
    try {
      const { error } = await supabase.rpc('revoke_admin_privileges', {
        user_email: revokeEmail.trim()
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Admin privileges revoked",
        description: `Admin privileges for ${revokeEmail} have been revoked.`,
      });
      setRevokeEmail("");
      onRefreshStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke admin privileges. Please check the email and try again.",
        variant: "destructive",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminStats?.total_users ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminStats?.total_complaints ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminStats?.pending_complaints ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminStats?.resolved_complaints ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Statistics
            </CardTitle>
            <CardDescription>
              Overview of system usage and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adminStats ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Users:</span>
                  <span className="font-semibold">{adminStats.total_users}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Admins:</span>
                  <span className="font-semibold">{adminStats.total_admins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Complaints:</span>
                  <span className="font-semibold">{adminStats.total_complaints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-semibold">{adminStats.pending_complaints}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress:</span>
                  <span className="font-semibold">{adminStats.in_progress_complaints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolved:</span>
                  <span className="font-semibold">{adminStats.resolved_complaints}</span>
                </div>
                <div className="flex justify-between">
                  <span>New Users (30 days):</span>
                  <span className="font-semibold">{adminStats.new_users_last_30_days}</span>
                </div>
                <div className="flex justify-between">
                  <span>Complaints (30 days):</span>
                  <span className="font-semibold">{adminStats.complaints_last_30_days}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Loading statistics...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Promote users to admin or revoke admin privileges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promote-email">Promote User to Admin</Label>
              <div className="flex gap-2">
                <Input
                  id="promote-email"
                  type="email"
                  placeholder="user@example.com"
                  value={promoteEmail}
                  onChange={(e) => setPromoteEmail(e.target.value)}
                />
                <Button 
                  onClick={handlePromoteUser} 
                  disabled={isPromoting || !promoteEmail.trim()}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  {isPromoting ? "Promoting..." : "Promote"}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="revoke-email">Revoke Admin Privileges</Label>
              <div className="flex gap-2">
                <Input
                  id="revoke-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={revokeEmail}
                  onChange={(e) => setRevokeEmail(e.target.value)}
                />
                <Button 
                  onClick={handleRevokeAdmin} 
                  disabled={isRevoking || !revokeEmail.trim()}
                  variant="destructive"
                  size="sm"
                >
                  <UserMinus className="h-4 w-4 mr-1" />
                  {isRevoking ? "Revoking..." : "Revoke"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
          <CardDescription>
            Manage all complaints in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {allComplaints.length > 0 ? (
              allComplaints.map((complaint) => (
                <div key={complaint.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{complaint.subject}</h4>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Category: {complaint.category}</span>
                    <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No complaints found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};