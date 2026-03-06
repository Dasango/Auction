import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import placeholderImg from "@/assets/placeholder.png";

import { login } from "@/services/auth.service"; 
import { useAuthStore } from "@/store/auth-store"; 

const Login = () => {
    const setToken = useAuthStore((state) => state.setToken);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData);
        
        try {
            const jwt = await login({
                username: rawData.email as string, 
                password: rawData.password as string
            });

            setToken(jwt);
            console.log("Token guardado exitosamente en LocalStorage y Zustand");

        } catch (error) {
            console.error("Error épico atrapado:", error);
        }
    }

    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Auction Pro
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <img
            src={placeholderImg}
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    );
};

export default Login;