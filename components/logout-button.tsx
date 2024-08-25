import { Button } from "@/components/ui/button"; // Adjust the import based on your setup
import Cookies from "js-cookie";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the access token from cookies
    Cookies.remove("access_token");

    // Redirect the user to the homepage
    router.push("/");
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center w-full text-center text-lg font-normal"
      onClick={handleLogout}
    >
      <LogOutIcon className="mr-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
