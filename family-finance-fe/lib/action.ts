"use server";

import { cookies } from "next/headers";
import { sendRequestServer } from "./api";

const BE = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:8081/api/";

//  Helper lấy token phía server
const getToken = async () => (await cookies()).get("token")?.value ?? "";

//  Helper set cookie
const setTokenCookie = async (token: string) => {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    path: "/",
  });
};

//  Đăng nhập
export const loginAction = async (
  email: string,
  password: string,
): Promise<IBackendRes> => {
  const res = await sendRequestServer<IBackendRes>({
    url: `${BE}/auths/login`,
    method: "POST",
    body: { email, password },
  });
  if (res?.access_token) {
    await setTokenCookie(res.access_token);
  }
  return res;
};

//  Đăng ký
export const registerAction = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/auths/register`,
    method: "POST",
    body: data,
  });
};

//  Xác thực email
export const verifyAccountAction = async (
  email: string,
  code: string,
): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/auths/verify-account`,
    method: "POST",
    body: { email, code },
  });
};

//  Gửi lại mã xác thực
export const resendCodeAction = async (email: string): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/auths/resend-code`,
    method: "POST",
    body: { email },
  });
};

//  Đổi mật khẩu
export const changePasswordAction = async (
  currentPassword: string,
  newPassword: string,
): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/users/me/password`,
    method: "PATCH",
    token: await getToken(),
    body: { currentPassword, newPassword },
  });
};

// Cập nhập thông tin cá nhân
export const updateProfileAction = async (data: {
  name: string;
  avatar: string;
}): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/users/me`,
    method: "PATCH",
    token: await getToken(),
    body: data,
  });
};

//  Đăng xuất
export const logoutAction = async (): Promise<void> => {
  (await cookies()).delete("token");
};
//  Tạo phòng 
// BE trả access_token mới có spaceId+role=parent
// Set cookie ngay → FE không cần login lại
export const createSpaceAction = async (name: string): Promise<IBackendRes> => {
  const res = await sendRequestServer<IBackendRes>({
    url: `${BE}/space/create`,
    method: "POST",
    token: await getToken(),
    body: { name },
  });
  // Set cookie mới ngay — JWT mới có spaceId + role=parent
  if (res?.access_token) setTokenCookie(res.access_token);
  return res;
};

//  Vào phòng bằng mã mời 
// BE trả access_token mới có spaceId+role=member
export const joinSpaceAction = async (
  invitedCode: string,
): Promise<IBackendRes> => {
  const res = await sendRequestServer<IBackendRes>({
    url: `${BE}/space/join`,
    method: "POST",
    token: await getToken(),
    body: { invitedCode },
  });
  // Set cookie mới ngay — JWT mới có spaceId + role=member
  if (res?.access_token) setTokenCookie(res.access_token);
  return res;
};

//  Lấy thông tin phòng 
export const getMySpaceAction = async (): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/space/me`,
    method: "GET",
    token: await getToken(),
  });
};

// Lấy danh sách người dùng (Admin)
export const getUsersAdminAction = async (): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/users`, 
    method: "GET",
    token: await getToken(),
  });
};

// Lấy danh mục hệ thống (Admin)
export const getSystemCategoriesAction = async (): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/categoris/system`,
    method: "GET",
    token: await getToken(),
  });
};

// Tạo danh mục hệ thống (Admin)
export const createSystemCategoryAction = async (data: any): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/categoris/system`,
    method: "POST",
    token: await getToken(),
    body: data,
  });
};

// Xóa danh mục hệ thống (Admin)
export const deleteSystemCategoryAction = async (id: string): Promise<IBackendRes> => {
  return sendRequestServer<IBackendRes>({
    url: `${BE}/categoris/system/${id}`,
    method: "DELETE",
    token: await getToken(),
  });
};

