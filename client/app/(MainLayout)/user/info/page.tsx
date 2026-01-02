"use client";

import React, { useEffect, useState, useCallback } from "react";
import ViewDetail from "./ViewDetail";
import PrimaryButton from "@/components/PrimaryButton";
import { EditIcon } from "lucide-react";
import SecondaryButton from "@/components/SecondaryButton";
import { LogoutIcon } from "@/components/icons";
import EditDetail from "./EditDetail";
import UserHook from "@/hooks/useUser";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import ShortUserSidebar from "@/components/ShortUserSidebar";

const InfoPage = () => {
  const { signOut } = useAuthStore();
  const router = useRouter();

  // --- Define state ---
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [submitProfileForm, setSubmitProfileForm] = useState<
    (() => void) | null
  >(null);

  // --- Custom hook ---
  const { data: userProfile, isLoading, error } = UserHook.useGetProfile();

  // --- Handler ---

  const handleEditButton = () => setInEditMode(true);
  const handleCancelEditButton = () => setInEditMode(false);
  const queryClient = useQueryClient();
  const handleLogout = async () => {
    queryClient.cancelQueries();
    queryClient.clear();

    router.replace("/login");

    try {
      await signOut();
    } catch (err) {
      console.warn("Signout failed (ignored):", err);
    }
  };

  const handleSaveButton = useCallback(() => {
    if (submitProfileForm) submitProfileForm();
  }, [submitProfileForm]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Lỗi tải dữ liệu</p>;
  if (!userProfile) return <p>Không tìm thấy thông tin người dùng</p>;

  return (
    <>
      <ShortUserSidebar />
      <div className="bg-white w-full h-full border-2 border-gray-200 shadow-md rounded-lg p-7">
        <p className="text-2xl font-medium">Thông tin tài khoản</p>
        <div>
          {inEditMode ? (
            <div>
              <EditDetail
                user={userProfile}
                onProfileSubmit={setSubmitProfileForm}
                setIsSaving={setIsSaving}
                onSaveSuccess={() => setInEditMode(false)}
                setIsDirty={setIsFormDirty}
              />
            </div>
          ) : (
            <div>
              <ViewDetail user={userProfile} />
            </div>
          )}

          {inEditMode ? (
            <div>
              <section className="flex flex-row gap-5 mt-10 max-w-80">
                <PrimaryButton
                  text={isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  onClick={handleSaveButton}
                />
                <SecondaryButton
                  text="Hủy"
                  textColor="#FF0505"
                  hoverTextColor="#FFFFFF"
                  hoverBackgroundColor="#FF5555"
                  onClick={handleCancelEditButton}
                />
              </section>
            </div>
          ) : (
            <div>
              <section className="flex flex-row gap-5 mt-10 max-w-80">
                <PrimaryButton
                  text="Chỉnh sửa"
                  icon={() => <EditIcon className="text-white" />}
                  onClick={handleEditButton}
                />
                <SecondaryButton
                  text="Đăng xuất"
                  icon={() => <LogoutIcon className="text-red-[#FF0505]" />}
                  textColor="#FF0505"
                  hoverTextColor="#FFFFFF"
                  hoverBackgroundColor="#FF5555"
                  onClick={handleLogout}
                />
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InfoPage;
