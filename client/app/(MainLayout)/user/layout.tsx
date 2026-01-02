"use client";

import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserCategoryTable from "@/components/UserCategoryTable";
import { userCategories } from "@/app/const";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/auth.store";
export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = CategoryHook.useCategories();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const visibleCategories = userCategories.filter((c) =>
    c.roles.includes(role)
  );
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <div>Error...</div>}
      {data && (
        <>
          <ProtectedRoute>
            <aside></aside>
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <UserCategoryTable userCategories={visibleCategories} />
              </div>
            </aside>
            <main className="w-full">{children}</main>
          </ProtectedRoute>
        </>
      )}
    </>
  );
}
