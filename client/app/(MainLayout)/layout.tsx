// app/layout.tsx
import { Footer } from "@/components/Footer/Footer";
import "../globals.css";
import Header from "@/components/Header";
import AuthRoute from "@/components/auth/AuthRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthRoute>
        <Header />
        <div className="mt-[100px] flex flex-col lg:flex-row container-layout gap-8 mb-[50px] w-full">
          {children}
        </div>
        <Footer />
      </AuthRoute>
    </>
  );
}
