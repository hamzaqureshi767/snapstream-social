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
        } else {
          navigate("/");
        }
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
        } else {
          toast({
            title: "Account created!",
            description: "You can now sign in with your credentials.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="flex items-center gap-8 max-w-[935px]">
          {/* Phone Mockup - Hidden on mobile */}
          <div className="hidden lg:block relative">
            <div className="relative w-[380px] h-[580px]">
              {/* Phone frame */}
              <img
                src="https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones.png?__makehaste_cache_breaker=HOgRclNOosk"
                alt="Phone"
                className="w-full h-full object-contain"
              />
              {/* Sliding screenshots would go here */}
            </div>
          </div>

          {/* Auth Forms */}
          <div className="w-full max-w-[350px] space-y-3">
            {/* Main Card */}
            <div className="bg-white border border-[#dbdbdb] rounded-sm px-10 py-10">
              {/* Instagram Logo */}
              <div className="flex justify-center mb-8">
                <svg
                  aria-label="Instagram"
                  className="h-[51px]"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 175 51"
                >
                  <path
                    d="M19.0001 25.5C19.0001 21.9096 21.9096 19 25.5001 19C29.0905 19 32.0001 21.9096 32.0001 25.5C32.0001 29.0904 29.0905 32 25.5001 32C21.9096 32 19.0001 29.0904 19.0001 25.5ZM15.5726 25.5C15.5726 30.9846 20.0155 35.4274 25.5001 35.4274C30.9846 35.4274 35.4275 30.9846 35.4275 25.5C35.4275 20.0154 30.9846 15.5726 25.5001 15.5726C20.0155 15.5726 15.5726 20.0154 15.5726 25.5ZM33.4919 15.1822C33.4918 15.6336 33.6256 16.0748 33.8767 16.4499C34.1279 16.825 34.4849 17.1173 34.9017 17.2896C35.3185 17.4619 35.7766 17.5065 36.2185 17.4177C36.6604 17.329 37.0663 17.111 37.3857 16.7919C37.7051 16.4728 37.9235 16.067 38.0126 15.6252C38.1017 15.1834 38.0575 14.7253 37.8855 14.3083C37.7136 13.8914 37.4216 13.5342 37.0467 13.2827C36.6719 13.0313 36.2308 12.8972 35.7794 12.897H35.7786C35.1731 12.8973 34.5925 13.138 34.1646 13.5658C33.7368 13.9935 33.4958 14.5741 33.4919 15.1822ZM17.8174 46.1249C15.7999 46.0333 14.704 45.7094 13.9693 45.4369C12.9968 45.0756 12.2975 44.6438 11.5629 43.9106C10.8284 43.1774 10.3959 42.4789 10.036 41.5064C9.76345 40.772 9.43955 39.6758 9.34805 37.6583C9.24795 35.4689 9.22825 34.8248 9.22825 29.5007C9.22825 24.1766 9.24935 23.5342 9.34805 21.3431C9.43965 19.3256 9.76565 18.2314 10.036 17.4951C10.3973 16.5226 10.8293 15.8233 11.5629 15.0887C12.2965 14.3542 12.9954 13.9217 13.9693 13.5618C14.7037 13.2892 15.7999 12.9654 17.8174 12.8739C20.0068 12.7738 20.6509 12.7541 25.9751 12.7541C31.2993 12.7541 31.9439 12.7752 34.1349 12.8739C36.1524 12.9655 37.2468 13.2915 37.983 13.5618C38.9555 13.9217 39.6548 14.3549 40.3894 15.0887C41.1239 15.8226 41.555 16.5226 41.9163 17.4951C42.1889 18.2295 42.5128 19.3256 42.6043 21.3431C42.7044 23.5342 42.7241 24.1766 42.7241 29.5007C42.7241 34.8248 42.7044 35.4675 42.6043 37.6583C42.5127 39.6758 42.1874 40.7706 41.9163 41.5064C41.555 42.4789 41.1232 43.1782 40.3894 43.9106C39.6555 44.643 38.9555 45.0756 37.983 45.4369C37.2486 45.7095 36.1524 46.0334 34.1349 46.1249C31.9455 46.225 31.3014 46.2447 25.9751 46.2447C20.6488 46.2447 20.0061 46.225 17.8174 46.1249ZM17.6418 9.45025C15.4319 9.55035 13.9083 9.88355 12.5703 10.3727C11.1851 10.8772 10.0128 11.5476 8.84105 12.7179C7.66935 13.8882 7.00035 15.062 6.49585 16.4473C6.00665 17.7867 5.67345 19.3089 5.57335 21.5188C5.47185 23.7322 5.44995 24.4247 5.44995 29.5007C5.44995 34.5767 5.47185 35.2692 5.57335 37.4826C5.67345 39.6927 6.00665 41.2149 6.49585 42.5541C7.00035 43.9387 7.66945 45.1138 8.84105 46.2835C10.0127 47.4533 11.1851 48.1222 12.5703 48.6287C13.9111 49.1179 15.4319 49.4511 17.6418 49.5512C19.8566 49.6513 20.5477 49.6746 25.9751 49.6746C31.4025 49.6746 32.0949 49.6527 34.3083 49.5512C36.5184 49.4511 38.0405 49.1179 39.3798 48.6287C40.7644 48.1222 41.9374 47.454 43.1091 46.2835C44.2808 45.113 44.9491 43.9387 45.4543 42.5541C45.9435 41.2149 46.2781 39.6926 46.3768 37.4826C46.4769 35.2678 46.4988 34.5767 46.4988 29.5007C46.4988 24.4247 46.4769 23.7322 46.3768 21.5188C46.2767 19.3087 45.9435 17.7859 45.4543 16.4473C44.9491 15.0627 44.2794 13.8896 43.1091 12.7179C41.9388 11.5462 40.7644 10.8772 39.3812 10.3727C38.0405 9.88355 36.5183 9.54895 34.3097 9.45025C32.0963 9.35015 31.4039 9.32685 25.9765 9.32685C20.5491 9.32685 19.8566 9.34875 17.6418 9.45025Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M69.0167 14.7854C63.9146 14.7854 60.7158 18.6068 60.7158 24.5182C60.7158 30.3975 63.8825 34.251 69.0167 34.251C74.1509 34.251 77.3496 30.3975 77.3496 24.5182C77.3496 18.6068 74.1509 14.7854 69.0167 14.7854ZM69.0167 31.1759C66.1415 31.1759 64.2697 28.6561 64.2697 24.5182C64.2697 20.3803 66.1415 17.8606 69.0167 17.8606C71.8919 17.8606 73.7637 20.3803 73.7637 24.5182C73.7637 28.6561 71.8919 31.1759 69.0167 31.1759Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M89.8654 14.7854C86.247 14.7854 83.7272 16.9169 82.8874 19.8883H82.7912L82.9515 15.1414H79.5579C79.6221 17.3049 79.6541 19.5965 79.6541 22.0842V40.2428H83.1118V30.9177H83.208C84.1439 33.537 86.5034 34.251 89.1233 34.251C93.7741 34.251 97.0369 30.6888 97.0369 24.4221C97.037 18.1554 93.8383 14.7854 89.8654 14.7854ZM88.4163 31.1759C85.4129 31.1759 83.0534 28.6561 83.0534 24.6464V24.2617C83.0534 20.2519 85.2811 17.8606 88.2845 17.8606C91.3519 17.8606 93.4513 20.2519 93.4513 24.4861C93.4513 28.7201 91.3841 31.1759 88.4163 31.1759Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M104.761 22.3728C104.857 19.5647 106.536 17.6929 109.251 17.6929C112.158 17.6929 113.517 19.6608 113.517 22.7924V33.8951H117.007V22.2766C117.007 17.6929 114.712 14.7854 110.45 14.7854C107.479 14.7854 105.217 16.3627 104.281 18.8183H104.185L104.377 15.1414H100.951C101.015 17.1735 101.047 19.4009 101.047 21.8887V33.8951H104.537V22.3728H104.761Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M119.892 29.2655C119.892 32.4642 122.188 34.251 126.257 34.251C131.199 34.251 134.11 31.3437 134.11 26.6C134.11 22.9495 132.11 21.0454 128.136 20.3013L125.676 19.8186C123.319 19.3999 122.316 18.5601 122.316 17.0791C122.316 15.2431 123.867 14.0856 126.162 14.0856C128.489 14.0856 129.944 15.3072 130.008 17.3394H133.338C133.21 14.0856 130.722 11.7581 126.193 11.7581C121.731 11.7581 118.956 14.117 118.956 17.4036C118.956 20.8821 121.22 22.6585 124.966 23.3387L127.49 23.8214C130.045 24.2763 131.078 25.148 131.078 26.8923C131.078 28.8281 129.367 30.2448 126.644 30.2448C123.92 30.2448 122.316 29.0914 122.252 26.7639L119.892 29.2655Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M142.229 15.1414H138.739V10.5582H135.249V15.1414H132.441V18.1165H135.249V29.8155C135.249 32.9463 137.129 34.0905 140.421 34.0905C141.517 34.0905 142.582 33.9261 143.261 33.7295V30.8223C142.806 30.9188 142.165 30.9829 141.55 30.9829C139.798 30.9829 138.739 30.3669 138.739 28.327V18.1165H142.229V15.1414Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M155.054 14.7854C151.5 14.7854 149.044 16.7847 148.332 19.8562H148.236L148.396 15.1414H144.97C145.034 17.3049 145.066 19.5965 145.066 22.0842V33.8951H148.556V23.4348C148.556 19.9241 150.588 17.8285 153.847 17.8285C154.52 17.8285 155.182 17.9249 155.822 18.0532V14.8817C155.566 14.8177 155.31 14.7854 155.054 14.7854Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M166.829 14.7854C161.695 14.7854 158.336 18.6068 158.336 24.5182C158.336 30.3975 161.535 34.251 166.829 34.251C171.256 34.251 174.391 31.5029 174.839 27.6172H171.445C171.093 29.7808 169.349 31.1759 166.829 31.1759C163.794 31.1759 161.854 28.8802 161.854 25.0909V25.0268H175.063V23.9467C175.063 18.3467 172.127 14.7854 166.829 14.7854ZM161.886 22.2766C162.078 19.4968 163.954 17.6929 166.797 17.6929C169.736 17.6929 171.512 19.5647 171.576 22.2766H161.886Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>

              {!isLogin && (
                <p className="text-[#737373] text-center font-semibold mb-4 text-[17px]">
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
                  className="bg-[#fafafa] border-[#dbdbdb] h-[38px] text-xs rounded-[3px] focus-visible:ring-0 focus-visible:border-[#a8a8a8]"
                />
                {!isLogin && (
                  <>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-[#fafafa] border-[#dbdbdb] h-[38px] text-xs rounded-[3px] focus-visible:ring-0 focus-visible:border-[#a8a8a8]"
                    />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-[#fafafa] border-[#dbdbdb] h-[38px] text-xs rounded-[3px] focus-visible:ring-0 focus-visible:border-[#a8a8a8]"
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
                  className="bg-[#fafafa] border-[#dbdbdb] h-[38px] text-xs rounded-[3px] focus-visible:ring-0 focus-visible:border-[#a8a8a8]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold h-8 rounded-lg text-sm mt-2"
                  disabled={loading || !email || !password}
                >
                  {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-[#dbdbdb]" />
                <span className="px-4 text-[13px] font-semibold text-[#737373]">OR</span>
                <div className="flex-1 h-px bg-[#dbdbdb]" />
              </div>

              {/* Facebook Login */}
              <button className="w-full flex items-center justify-center gap-2 text-[#385185] font-semibold text-sm mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Log in with Facebook
              </button>

              {isLogin && (
                <button className="w-full text-center text-xs text-[#00376b]">
                  Forgot password?
                </button>
              )}

              {!isLogin && (
                <p className="text-xs text-[#737373] text-center mt-4">
                  People who use our service may have uploaded your contact information to Instagram.{" "}
                  <a href="#" className="text-[#00376b]">Learn More</a>
                </p>
              )}
            </div>

            {/* Toggle Card */}
            <div className="bg-white border border-[#dbdbdb] rounded-sm p-5 text-center">
              <p className="text-sm">
                {isLogin ? "Don't have an account?" : "Have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#0095f6] font-semibold"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>

            {/* App Download */}
            <div className="text-center py-3">
              <p className="text-sm mb-4">Get the app.</p>
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
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#737373] mb-4">
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
          <div className="flex justify-center gap-4 text-xs text-[#737373]">
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
