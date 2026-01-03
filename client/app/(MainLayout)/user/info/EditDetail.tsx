"use client";

import React, { useState, useEffect, useCallback } from "react";
import Avatar from "./Avatar";
import SecondaryButton from "@/components/SecondaryButton";
import UserHook from "@/hooks/useUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { EditProfileInputs, EditProfileSchema } from "./validation";
import { ChangePasswordInputs, ChangePasswordSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordRequest, User } from "../../../../../shared/src/types";
import { formatDate } from "../../product/[product_slug]/components/Question";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "next/navigation";
import { LockIcon, UserIcon } from "lucide-react"; // Thêm icon cho sinh động
import { formatDateISO } from "@/utils";

interface EditDetailProps {
  user: User;
  onProfileSubmit: (submitFn: () => void) => void;
  setIsSaving: (isSaving: boolean) => void;
  onSaveSuccess: () => void;
  setIsDirty: (isDirty: boolean) => void;
}

export default function EditDetail({
  user,
  onProfileSubmit,
  setIsSaving,
  onSaveSuccess,
  setIsDirty,
}: EditDetailProps) {
  // --- State ---
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(user.profile_img);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // --- Custom Hook ---
  const { mutate: updateProfile, isPending: isLoading } =
    UserHook.useUpdateProfile();
  const { mutate: changePassword, isPending: isLoadingChangePassword } =
    UserHook.useChangePassword();

  const router = useRouter();

  // --- Form 1: Profile ---
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty: isFormDirty },
  } = useForm<EditProfileInputs>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
      day_of_birth: user.day_of_birth ? formatDate(user.day_of_birth) : "",
    },
    mode: "onChange",
  });

  // --- Form 2: Password ---
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  // --- Handlers ---
  const onSubmit: SubmitHandler<EditProfileInputs> = useCallback(
    (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("address", data.address);
      if (data.day_of_birth) {
        formData.append("day_of_birth", data.day_of_birth);
      }
      if (avatarFile) {
        formData.append("profile_img", avatarFile);
      }

      updateProfile(formData, {
        onSuccess: () => {
          onSaveSuccess();
        },
        onError: (error) => {
          console.error("Lỗi cập nhật:", error);
        },
      });
    },
    [updateProfile, onSaveSuccess, avatarFile]
  );

  const onSubmitPassword: SubmitHandler<ChangePasswordInputs> = async (
    data
  ) => {
    try {
      const userReq: ChangePasswordRequest = data;
      changePassword(userReq, {
        onSuccess: () => {
          // Reset form và tắt chế độ edit khi thành công
          setIsEditingPassword(false);
          resetPasswordForm();
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeAvatar = useCallback(
    (data: { file: File; url: string }) => {
      setAvatar(data.url);
      setAvatarFile(data.file);
      // Khi đổi avatar, coi như form đã dirty để nút Save ở cha sáng lên (nếu logic cha cần)
      setIsDirty(true);
    },
    [setIsDirty]
  );

  // --- Effects ---
  useEffect(() => {
    setIsSaving(isLoading);
  }, [isLoading, setIsSaving]);

  useEffect(() => {
    // Nếu có avatar file mới thì cũng coi là dirty
    setIsDirty(isFormDirty || !!avatarFile);
  }, [isFormDirty, avatarFile, setIsDirty]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("address", user.address || "");
      setValue(
        "day_of_birth",
        user.day_of_birth ? formatDateISO(user.day_of_birth) : ""
      );
    }
  }, [user, setValue]);

  useEffect(() => {
    onProfileSubmit(() => handleSubmit(onSubmit));
  }, [handleSubmit, onSubmit, onProfileSubmit]);

  // --- Common Input Styles ---
  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800 text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const errorClass = "text-red-500 text-xs mt-1 ml-1";

  return (
    <div className="flex flex-col gap-8 mt-5 pb-10">
      {/* 1. SECTION AVATAR */}
      <div className="flex flex-col items-start justify-center gap-4 bg-white pl-10 py-4 rounded-3xl border border-gray-100 shadow-sm w-[48%]">
        <label className="font-semibold text-gray-500 uppercase tracking-wider text-xs">
          Ảnh đại diện
        </label>
        <Avatar
          allowEdit={true}
          imageProps={{
            src: avatar as string,
            className: "w-32 h-32 border-4 border-white shadow-md",
          }}
          onSubmit={handleChangeAvatar}
        />
        <p className="text-xs text-gray-400">Nhấn vào ảnh để thay đổi</p>
      </div>

      {/* 2. SECTION FORMS (GRID LAYOUT) */}
      {/* BREAKPOINT: 1 cột ở mobile, 2 cột ở desktop (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* --- LEFT: EDIT PROFILE --- */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-lg flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-gray-100">
            <UserIcon className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800 text-lg">
              Thông tin cá nhân
            </h3>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="name" className={labelClass}>
                Tên đầy đủ <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Nhập tên hiển thị"
                className={inputClass}
              />
              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className={inputClass}
              />
              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                {...register("address")}
                id="address"
                type="text"
                placeholder="Nhập địa chỉ của bạn"
                className={inputClass}
              />
              {errors.address && (
                <p className={errorClass}>{errors.address.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="day_of_birth" className={labelClass}>
                Ngày sinh
              </label>
              <input
                {...register("day_of_birth")}
                id="day_of_birth"
                type="date"
                className={inputClass}
              />
              {errors.day_of_birth && (
                <p className={errorClass}>{errors.day_of_birth.message}</p>
              )}
            </div>

            {/* Hidden button triggered by parent */}
            <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
          </form>
        </div>

        {/* --- RIGHT: CHANGE PASSWORD --- */}
        <div
          className={`
            bg-white p-6 sm:p-8 rounded-3xl border shadow-lg flex flex-col gap-4 h-full transition-colors duration-300
            ${
              isEditingPassword
                ? "border-blue-200 shadow-blue-100"
                : "border-gray-100"
            }
        `}
        >
          <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <LockIcon
                className={`w-5 h-5 ${
                  isEditingPassword ? "text-blue-600" : "text-gray-400"
                }`}
              />
              <h3 className="font-bold text-gray-800 text-lg">Bảo mật</h3>
            </div>

            {/* Switch Toggle nhỏ gọn */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="edit-password-toggle"
                className="text-sm text-gray-500 cursor-pointer select-none"
              >
                {isEditingPassword ? "Đang sửa" : "Thay đổi"}
              </label>
              <input
                id="edit-password-toggle"
                type="checkbox"
                checked={isEditingPassword}
                onChange={(e) => setIsEditingPassword(e.target.checked)}
                className="toggle toggle-primary toggle-sm border border-slate-400" // Nếu dùng DaisyUI, hoặc checkbox thường
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmitPassword(onSubmitPassword)}
            className={`flex flex-col gap-4 relative transition-opacity duration-200 ${
              !isEditingPassword ? "opacity-50 select-none" : "opacity-100"
            }`}
          >
            {/* Overlay chặn click khi không edit */}
            {!isEditingPassword && (
              <div className="absolute inset-0 z-10 cursor-not-allowed" />
            )}

            <div>
              <label htmlFor="old-password" className={labelClass}>
                Mật khẩu cũ
              </label>
              <div className="flex gap-2">
                <input
                  id="old-password"
                  type="password"
                  disabled={!isEditingPassword}
                  placeholder="••••••••"
                  className={`${inputClass} flex-1`}
                  {...registerPassword("oldPassword")}
                />
              </div>
              {/* Nút quên mật khẩu đặt ở dưới input để đỡ rối */}
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => router.replace("/forget-password")}
                  disabled={!isEditingPassword}
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              {passwordErrors.oldPassword && (
                <p className={errorClass}>
                  {passwordErrors.oldPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-password" className={labelClass}>
                Mật khẩu mới
              </label>
              <input
                id="new-password"
                type="password"
                disabled={!isEditingPassword}
                placeholder="••••••••"
                className={inputClass}
                {...registerPassword("newPassword")}
              />
              {passwordErrors.newPassword && (
                <p className={errorClass}>
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className={labelClass}>
                Xác nhận mật khẩu
              </label>
              <input
                id="confirm-password"
                type="password"
                disabled={!isEditingPassword}
                placeholder="••••••••"
                className={inputClass}
                {...registerPassword("confirmPassword")}
              />
              {passwordErrors.confirmPassword && (
                <p className={errorClass}>
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2 mt-auto">
              <PrimaryButton
                disabled={!isEditingPassword || isLoadingChangePassword}
                text={
                  isLoadingChangePassword
                    ? "Đang xử lý..."
                    : "Cập nhật mật khẩu"
                }
                className="w-full"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
