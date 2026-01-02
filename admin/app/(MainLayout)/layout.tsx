import "../globals.css";
import { NavigationBar } from "@/components/NavigationBar";
import Header from "@/components/Header";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-white z-50 shadow">
        <Header />
      </header>

      <div className="flex pl-72">
        <div className="fixed top-[70px] left-0 w-60 h-screen bg-white shadow z-40">
          <NavigationBar />
        </div>
        <div className="mt-[70px] w-full p-4 container">{children}</div>
      </div>
    </div>
  );
}
