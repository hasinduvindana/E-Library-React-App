import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
      });
      navigate("/login");
    },
    onError: (error) => {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        description: "Logout failed. Please try again.",
      });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <Button onClick={handleLogout} variant="ghost" className="flex items-center">
      <LogOut className="h-6 w-6 mr-2" />
      Logout
    </Button>
  );
};

export default Logout;