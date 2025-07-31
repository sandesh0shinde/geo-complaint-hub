import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface Complaint {
  id: string;
  created_at: string;
  status: string;
  category: string;
  subject: string;
  description: string;
  location?: string;
}

interface UserComplaintsProps {
  userComplaints: Complaint[];
}

export const UserComplaints = ({ userComplaints }: UserComplaintsProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Complaints
        </CardTitle>
        <CardDescription>
          Track the status of your submitted complaints
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {userComplaints.length > 0 ? (
            userComplaints.map((complaint) => (
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
                {complaint.location && (
                  <p className="text-xs text-muted-foreground mt-1">Location: {complaint.location}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No complaints submitted yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};