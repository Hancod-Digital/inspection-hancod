import { Button } from "@/components/ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="your@example.com" type="email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button className="p-0 text-primary" variant="link">
              Forgot Password
            </Button>
          </div>
          <Input id="password" type="password" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </label>
        </div>
        <Button className="w-full bg-primary hover:border hover:border-primary hover:bg-secondary hover:text-primary" type="submit">
          Login
        </Button>
         
      </form>
    );
  }