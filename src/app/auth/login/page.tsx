"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLogin } from "@/queries/authQuery";
import { ErrorResponse } from "@/services/authService";
import { toast } from "react-toastify";

export default function LogIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message on each attempt
    login(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Login successful");
          router.push("/dashboard");
        },
        onError: (error: unknown) => {
          const errorResponse = error as ErrorResponse;
          setErrorMessage(
            errorResponse.response?.data?.message || "Invalid email or password"
          );
        },
      }
    );
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray">
      <div className="w-full h-full bg-gray-100 flex py-2 px-6 md:py-6 md:px-6 rounded-lg shadow-lg">
        <div className="w-full md:w-1/2 flex flex-col md:justify-center md:px-16 relative">
          <div className="absolute top-6 md:left-6 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">B</span>
              </div>
              <span className="text-lg font-semibold text-black">
                Braidzworld
              </span>
            </Link>
          </div>

          <div className="mt-[6rem] md:mt-0">
            <h2 className="text-3xl text-[#0C1421] font-bold">
              Welcome Back
            </h2>
            <p className="text-[#313957] mt-2">
              Today is a new day. It&apos;s your day. Sign in to manage your
              Schedule.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-[#0C1421]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-none"
                />
              </div>

              <div className="relative">
                <label className="block text-[#0C1421] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition flex items-center justify-center"
              >
                {isLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-[#313957] mt-6 text-center text-sm">
              <span className="text-gray-500">Admin credentials:</span> admin@braidzworld.com / admin123
            </p>

            <p className="text-gray-400 text-xs text-center mt-6">
              ©️ 2025 All Rights Reserved
            </p>
          </div>
        </div>

        <div className="w-1/2 hidden md:block items-center justify-center p-4">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/img/login.png"
              alt="Barber shop"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
