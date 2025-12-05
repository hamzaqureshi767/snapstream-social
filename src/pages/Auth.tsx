import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error signing in",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
        }
        // Don't navigate manually - let PublicRoute handle redirect when auth state updates
      } else {
        if (!username.trim()) {
          toast({
            title: "Username required",
            description: "Please enter a username",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, username, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error signing up",
              description: error.message,
              variant: "destructive",
            });
          }
          setLoading(false);
        } else {
          toast({
            title: "Account created!",
            description: "You can now sign in with your credentials.",
          });
          // Don't navigate manually - let PublicRoute handle redirect when auth state updates
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="flex items-center justify-center">
          {/* Auth Forms */}
          <div className="w-full max-w-[350px] space-y-3">
            {/* Main Card */}
            <div className="bg-card border border-border rounded-sm px-10 py-10">
              {/* Instagram Logo */}
              <div className="flex justify-center mb-8">
                <h1 
                  className="text-[52px] bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent tracking-tight"
                  style={{ fontFamily: "'Satisfy', cursive" }}
                >
                  Instagram
                </h1>
              </div>

              {!isLogin && (
                <p className="text-muted-foreground text-center font-semibold mb-4 text-[17px]">
                  Sign up to see photos and videos from your friends.
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Phone number, username, or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary border-border h-[38px] text-sm rounded-[3px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary"
                />
                {!isLogin && (
                  <>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-secondary border-border h-[38px] text-sm rounded-[3px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary"
                    />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-secondary border-border h-[38px] text-sm rounded-[3px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary"
                    />
                  </>
                )}
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-secondary border-border h-[38px] text-sm rounded-[3px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-8 rounded-lg text-sm mt-2"
                  disabled={loading || !email || !password}
                >
                  {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="px-4 text-[13px] font-semibold text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Facebook Login */}
              <button className="w-full flex items-center justify-center gap-2 text-primary font-semibold text-sm mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Log in with Facebook
              </button>

              {isLogin && (
                <button className="w-full text-center text-xs text-primary">
                  Forgot password?
                </button>
              )}

              {!isLogin && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  People who use our service may have uploaded your contact information to Instagram.{" "}
                  <a href="#" className="text-primary">Learn More</a>
                </p>
              )}
            </div>

            {/* Toggle Card */}
            <div className="bg-card border border-border rounded-sm p-5 text-center">
              <p className="text-sm text-foreground">
                {isLogin ? "Don't have an account?" : "Have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-semibold"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>

            {/* App Download */}
            <div className="text-center py-3">
              <p className="text-sm text-foreground mb-4">Get the app.</p>
              <div className="flex justify-center gap-2">
                <a href="#">
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
                    alt="Download on the App Store"
                    className="h-10"
                  />
                </a>
                <a href="#">
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
                    alt="Get it on Google Play"
                    className="h-10"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4">
        <div className="max-w-[1024px] mx-auto">
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
            <a href="#">Meta</a>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Jobs</a>
            <a href="#">Help</a>
            <a href="#">API</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Locations</a>
            <a href="#">Instagram Lite</a>
            <a href="#">Threads</a>
            <a href="#">Contact Uploading & Non-Users</a>
            <a href="#">Meta Verified</a>
          </nav>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <select className="bg-transparent border-none outline-none cursor-pointer">
              <option>English</option>
            </select>
            <span>© 2024 Instagram from Meta</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
