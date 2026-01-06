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
        <div className="sticky top-0 w-full z-50">
          <Header />
        </div>
        <div className="mt-7.5 flex flex-col lg:flex-row container-layout gap-8 mb-[50px] w-full min-h-screen">
          {children}
        </div>
        <Footer />
      </AuthRoute>
    </>
  );
}
