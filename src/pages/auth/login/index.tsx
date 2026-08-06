import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TruckFast, Sms, Lock1 } from "iconsax-reactjs";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

export default function LoginPage() {
  useMeta(META_DATA.login);

  const { login, isLoggingIn } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormData) => {
    login(values);
  };

  return (
    <div className="h-screen overflow-hidden flex">
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 lg:px-12 bg-[rgba(243,245,245,1)]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div
              className="p-1.5 rounded-lg"
              style={{ background: "rgba(20,54,50,1)" }}
            >
              <TruckFast className="text-white" variant="Bulk" size={22} />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "rgba(20,54,50,1)" }}
            >
              SendoExpress
            </span>
          </div>

          {/* Welcome Text */}
          <div className="mb-6">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: "rgba(20,54,50,1)" }}
            >
              Selamat Datang!
            </h1>
            <p className="text-gray-500 text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Sms
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
                            size={16}
                            variant="Linear"
                          />
                          <Input
                            type="email"
                            placeholder="nama@gmail.com"
                            className="h-10 pl-9 pr-4 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Kata Sandi
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock1
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
                            size={16}
                            variant="Linear"
                          />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-10 pl-9 pr-4 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <div className="pt-1">
                  <Button
                    type="submit"
                    loading={isLoggingIn}
                    className="w-full h-10 text-sm font-semibold rounded-xl cursor-pointer"
                    style={{ background: "rgba(20,54,50,1)", color: "#fff" }}
                  >
                    Masuk
                  </Button>
                </div>

                {/* Footer link */}
                <p className="text-center text-sm text-gray-500">
                  Belum punya akun?{" "}
                  <Link
                    to="/auth/register"
                    className="font-semibold hover:underline cursor-pointer"
                    style={{ color: "rgba(20,54,50,1)" }}
                  >
                    Daftar di sini
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-[50%] relative overflow-hidden">
        <img
          src="/images/login.png"
          alt="SendoExpress Dashboard Preview"
          className="w-full h-full object-cover object-left-top"
        />
      </div>
    </div>
  );
}
