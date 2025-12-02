"use client"

import React, { useState, useEffect, useCallback } from "react"
import Avatar from "./Avatar"
import SecondaryButton from "@/components/SecondaryButton";
import UserHook from "@/hooks/useUser";
import { useForm, SubmitHandler } from "react-hook-form"
import { EditProfileInputs, EditProfileSchema } from "./validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "../../../../shared/src/types";
import { url } from "inspector";

interface EditDetailProps {
    user: User;
    onProfileSubmit: (submitFn: () => void) => void;
    setIsSaving: (isSaving: boolean) => void;
    onSaveSuccess: () => void;
    setIsDirty: (isDirty: boolean) => void;
}

export default function EditDetail({ user, onProfileSubmit, setIsSaving, onSaveSuccess, setIsDirty }: EditDetailProps) {

    // --- State ---
    const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<String>(user.profile_img);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    // --- Custom Hook ---
    const { mutate: updateProfile, isPending: isLoading } = UserHook.useUpdateProfile();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isDirty: isFormDirty },
    } = useForm<EditProfileInputs>({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
            name: user.name || '',
            email: user.email || '',
            address: user.address || '',
        },
        mode: 'onChange'
    });

    // --- Define handler ---
    const onSubmit: SubmitHandler<EditProfileInputs> = useCallback((data) => {
        
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("address", data.address);

        if (avatarFile) {
            formData.append("profile_img", avatarFile); // file object
        }

        updateProfile(formData, {
            onSuccess: () => {
                alert("Cập nhật profile thành công!");
                onSaveSuccess();
            },
            onError: (error) => {
                console.error("Lỗi cập nhật:", error);
                alert("Cập nhật profile thất bại. Vui lòng kiểm tra console.");
            }
        })
    }, [updateProfile, onSaveSuccess, avatarFile]);

    const handleChangeAvatar = useCallback((data: { file: File, url: String }) => {
        setAvatar(data.url);
        setAvatarFile(data.file);
    }, [])

    // --- React Hooks  ---
    useEffect(() => {
        setIsSaving(isLoading);
    }, [isLoading, setIsSaving]);

    useEffect(() => {
        setIsDirty(isFormDirty);
    }, [isFormDirty, setIsDirty]);

    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('email', user.email || '');
            setValue('address', user.address || '');
        }
    }, [user, setValue]);

    useEffect(() => {
        onProfileSubmit(() => handleSubmit(onSubmit))
    }, [handleSubmit, onSubmit, onProfileSubmit])


    return (
        <div className="flex flex-col gap-5 mt-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="avatar" className="font-medium text-sm">Ảnh đại diện</label>
                <Avatar
                    allowEdit={true}
                    imageProps={{
                        src: avatar as string// Thêm URL placeholder
                    }}
                    onSubmit={handleChangeAvatar}
                />
            </div>
            <div className="grid grid-cols-2">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-medium text-sm">Tên đầy đủ<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                        {...register("name")}
                        id="name"
                        type="text"
                        className="text-black rounded-lg mr-10"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

                    <label htmlFor="email" className="mt-3 font-medium text-sm">Email<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        className="text-black rounded-lg mr-10"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

                    <label htmlFor="address" className="mt-3 font-medium text-sm">Địa chỉ<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                        {...register("address")}
                        id="address"
                        type="text"
                        className="text-black rounded-lg mr-10"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}

                    <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
                </form>

                {/* Phần Thay đổi Mật khẩu */}
                <div className="flex flex-col gap-2">
                    <div className="ml-2 flex flex-row gap-2 items-center">
                        <input name="edit-password" id="edit-password" type="checkbox" onChange={(e) => setIsEditingPassword(e.target.checked)} className="checkbox-primary" />
                        <label htmlFor="edit-password">Thay đổi mật khẩu</label>
                    </div>
                    <form aria-disabled={!isEditingPassword} className="relative flex flex-col gap-2 p-6 border border-gray-500 rounded-sm aria-disabled:pointer-events-none">
                        {/* Overlay */}
                        {!isEditingPassword && (
                            <div className="absolute -inset-1 bg-white/70 pointer-events-none rounded-sm" />
                        )}
                        <label htmlFor="old-password" className="font-medium text-sm">Mật khẩu cũ</label>
                        <div className="grid grid-cols-[4fr_2.5fr] gap-2.5">
                            <input name="old-password" id="old-password" type="password" disabled={!isEditingPassword} className="text-black rounded-lg basis-4/5 flex-1" />
                            <SecondaryButton
                                text="Quên mật khẩu"
                                type="button"
                                onClick={() => console.log("Clicked on 'Quên mật khẩu'")}
                            />
                        </div>
                        <label htmlFor="old-password" className="mt-3 font-medium text-sm">Mật khẩu mới</label>
                        <input name="old-password" id="old-password" type="password" disabled={!isEditingPassword} className="text-black rounded-lg" />

                        <label htmlFor="old-password" className="mt-3 font-medium text-sm">Xác nhận mật khẩu mới</label>
                        <input name="old-password" id="old-password" type="password" disabled={!isEditingPassword} className="text-black rounded-lg" />
                    </form>
                </div>
            </div>
        </div>
    );
}