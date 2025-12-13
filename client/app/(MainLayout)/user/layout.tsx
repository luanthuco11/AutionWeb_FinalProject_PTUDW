"use client";

import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserCategoryTable from "@/components/UserCategoryTable";
import { userCategories } from "@/app/const";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = CategoryHook.useCategories();
  // const pathname = usePathname();
  // const isUserRoute = pathname.startsWith("/user");

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <div>Error...</div>}
      {data && (
        <>
          <ProtectedRoute>
            <aside>
              <UserCategoryTable userCategories={userCategories} />
            </aside>
            <main className="w-full">{children}</main>
          </ProtectedRoute>
        </>
      )}
    </>
  );
}
