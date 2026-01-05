"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Sử dụng Label chuẩn của Shadcn hoặc FieldLabel của bạn
import Link from "next/link";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignRequest } from "../../../shared/src/types";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Cần cài lucide-react nếu chưa có
import { useState } from "react";

const signInSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 8 kí tự"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const user: SignRequest = data;
      await signIn(user);

      // Kiểm tra lại state an toàn hơn
      if (useAuthStore.getState().user) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Login failed", error);
      // Có thể thêm toast error ở đây
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Đăng nhập
          </CardTitle>
          <CardDescription>
            Nhập thông tin tài khoản của bạn để truy cập hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                placeholder="mtri123"
                disabled={isSubmitting}
                {...register("username")}
                className={cn(
                  errors.username &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.username && (
                <p className="text-destructive text-xs font-medium animate-in fade-in-0 slide-in-from-top-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isSubmitting}
                  {...register("password")}
                  className={cn(
                    errors.password &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/forget-password"
                  className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                  tabIndex={-1}
                >
                  Quên mật khẩu?
                </Link>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs font-medium animate-in fade-in-0 slide-in-from-top-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </CardContent>

        {/* Footer / Sign Up Link */}
        <CardFooter className="flex flex-col gap-1 border-t pt-6 bg-muted/20">
          <div className=" flex items-center justify-center">
            <button
              onClick={() => router.replace("/")}
              className="px-6 py-2  text-black/50  hover:text-blue-700 cursor-pointer active:scale-95"
            >
              Tiếp tục với tư cách là khách
            </button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
