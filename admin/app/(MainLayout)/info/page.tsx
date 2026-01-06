"use client";

import React, { useState, useCallback, useEffect } from "react";
import ViewDetail from "./ViewDetail";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import SecondaryButton from "@/components/SecondaryButton";
import EditDetail from "./EditDetail";
import UserHook from "@/hooks/useUser";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";

import { LogoutIcon } from "@/components/icons";
const InfoPage = () => {
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- Define state ---
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [submitProfileForm, setSubmitProfileForm] = useState<
    (() => void) | null
  >(null);

  // --- Custom hook ---
  const { data: userProfile, isLoading, error } = UserHook.useGetProfile();

  // --- React hook ---
  useEffect(() => {
    if (!user || user.role === "guest") router.replace("/login");
    else return;
  }, [user, router]);
  // --- Handler ---

  const handleEditButton = () => setInEditMode(true);
  const handleCancelEditButton = () => {
    if (isFormDirty) {
      const confirmed = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?"
      );
      if (!confirmed) return;
    }
    setInEditMode(false);
  };
  const handleLogout = async () => {
    // theem alert o day
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

 if (isLoading)
    return (
      <div className="inset-0 h-screen">
        <LoadingSpinner />
      </div>
    );
  if (error) return <p>Lỗi tải dữ liệu</p>;
  if (!userProfile) return <p>Không tìm thấy thông tin người dùng</p>;
  return (
    <>
      <div className="px-[24px]">
        <div className="bg-white w-full h-full border-2 border-gray-200 shadow-md rounded-lg p-7 ">
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
              <div className="w-full flex justify-center">
                <div className="w-full flex justify-center gap-5 mt-10 max-w-80">
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;
