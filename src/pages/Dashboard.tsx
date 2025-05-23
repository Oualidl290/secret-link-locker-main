
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LinkForm from "@/components/LinkForm";
import LinkList from "@/components/LinkList";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setLinks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching links",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">SecretLinkLocker Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="create">Create Link</TabsTrigger>
            <TabsTrigger value="manage">Manage Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create a Secure Link</CardTitle>
                <CardDescription>
                  Upload a file and set protection options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LinkForm onSuccess={fetchLinks} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Your Secure Links</CardTitle>
                <CardDescription>
                  Manage and monitor all your secure links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LinkList links={links} loading={loading} onDelete={fetchLinks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
