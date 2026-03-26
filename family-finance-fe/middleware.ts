import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const AUTH_ROUTES = ["/login", "/register", "/verify", "/change-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const SPACE_SETUP_ROUTES = ["/space"];

  // 1. Phân loại các route
  const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isLandingPage = pathname === "/" || pathname === "/onboarding";

  // 2. Chuyển hướng người dùng mới vào trang chủ => onboarding
  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  // 3. Nếu đang vào trang Auth (Login, Register...)
  if (isAuthPage) {
    if (token) {
      try {
        const payload = jwtDecode<any>(token);
        if (payload.exp * 1000 > Date.now()) {
          // Đã đăng nhập -> Dashboard (nếu có space), hoặc Onboarding (nếu chưa)
          if (payload.spaceId) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
          } else {
            return NextResponse.redirect(new URL("/space", req.url));
          }
        }
      } catch {}
    }
    return NextResponse.next();
  }

  // 4. Nếu đang vào Landing Page (/onboarding)
  if (isLandingPage) {
    if (token) {
      try {
        const payload = jwtDecode<any>(token);
        if (payload.exp * 1000 > Date.now() && payload.spaceId) {
          // Đã có token + spaceId -> không cần xem onboarding nữa
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      } catch {}
    }
    return NextResponse.next();
  }

  // 5. ── Nhóm Route Protected (Dashboard, Profile...) ─────────
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = jwtDecode<any>(token);

    // Hết hạn token
    if (payload.exp * 1000 < Date.now()) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }

    const isAdminRoute = pathname.startsWith('/admin');

    // NẾU LÀ ADMIN, ÉP VÀO TRANG ADMIN VÀ THOÁT RA
    if (payload.sysRole === 'admin') {
      if (!isAdminRoute) {
         return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    
    // NẾU LÀ USER BÌNH THƯỜNG NHƯNG VÀO TRANG ADMIN => ĐẨY RA NGOÀI
    if (isAdminRoute && payload.sysRole !== 'admin') {
      if (payload.spaceId) return NextResponse.redirect(new URL("/dashboard", req.url));
      return NextResponse.redirect(new URL("/space", req.url));
    }

    const isSpaceSetup = SPACE_SETUP_ROUTES.some((r) => pathname.startsWith(r));

    // Đã có spaceId mà vào space-setup → dashboard
    if (payload.spaceId && isSpaceSetup)
      return NextResponse.redirect(new URL("/dashboard", req.url));

    // Chưa có spaceId mà vào trang khác → space-setup
    if (!payload.spaceId && !isSpaceSetup)
      return NextResponse.redirect(new URL("/space", req.url));

  } catch {
    // Lỗi token (bị sửa bậy, v.v...)
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
