"use client";
import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Coffee,
  ShoppingCart,
  GraduationCap,
  TrendUp,
  Users,
  User,
  Gear,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  // Tránh lỗi hydration mismatch do Zustand persist store lưu ở client
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Lời chào trên màn hình Desktop */}
      <div className="hidden md:block mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Chào buổi sáng, {mounted && user?.name ? user.name : "Bạn"}!
            </h2>
            <p className="text-slate-500 mt-1">
              Hôm nay tình hình tài chính của gia đình bạn thế nào?
            </p>
          </div>
          
          {/* NÚT QUẢN LÝ DÀNH RIÊNG CHO CHỦ PHÒNG (PARENT) */}
          {mounted && user?.role === 'parent' && (
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-emerald-500/20 active:scale-95">
              <Gear size={20} weight="bold" />
              <span>Quản lý phòng</span>
            </button>
          )}
        </div>
      </div>

      {/* HÀNG CÁC THẺ (TOP SUMMARY CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Số dư tổng (To nhất) */}
        <div className="md:col-span-2 bg-linear-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Wallet size={120} weight="duotone" />
          </div>
          <div>
            <p className="text-green-100 font-medium text-sm md:text-base">
              Số dư hiện tại
            </p>
            <h3 className="text-3xl md:text-5xl font-bold mt-2 tracking-tight">
              15.000.000 đ
            </h3>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="bg-white/20 rounded-lg px-3 py-2 flex-1 max-w-[200px]">
              <p className="text-xs text-green-100">Thu nhập tháng</p>
              <div className="flex items-center gap-1 mt-1 font-semibold text-sm">
                <ArrowUpRight size={16} /> +12.500.000 đ
              </div>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-2 flex-1 max-w-[200px]">
              <p className="text-xs text-green-100">Chi tiêu tháng</p>
              <div className="flex items-center gap-1 mt-1 font-semibold text-sm text-red-100">
                <ArrowDownRight size={16} /> -4.000.000 đ
              </div>
            </div>
          </div>
        </div>

        {/* Ví chung Gia đình */}
        <div className="bg-white dark:bg-[#122017] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={24} weight="fill" />
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-md">
              An tâm
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-6">
            Ví chung Gia đình
          </p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
            10.000.000 đ
          </h3>
        </div>
      </div>

      {/* CỘT NỘI DUNG DƯỚI (CHART & LỊCH SỬ GIAO DỊCH) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* BIỂU ĐỒ - CHART PLACEHOLDER */}
        <div className="bg-white dark:bg-[#122017] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">
            Phân bổ chi tiêu
          </h3>

          {/* Vẽ thủ công Pie Chart thông qua CSS Gradient */}
          <div className="aspect-square max-w-[280px] mx-auto relative flex items-center justify-center mt-6">
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "conic-gradient(#3b82f6 0% 35%, #8b5cf6 35% 60%, #f59e0b 60% 85%, #10b981 85% 100%)",
              }}
            ></div>

            {/* Lỗ Khoét Ở Giữa thành Biểu đồ Donut */}
            <div className="absolute inset-0 m-auto w-[65%] h-[65%] bg-white dark:bg-[#122017] rounded-full flex flex-col items-center justify-center shadow-inner">
              <p className="text-xs text-slate-500">Tổng chi</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">
                4.000.000 đ
              </p>
            </div>
          </div>

          {/* Chú thích màu sắc */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>Ăn uống
              (35%)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>Giáo dục
              (25%)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>Siêu thị
              (25%)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>Khác
              (15%)
            </div>
          </div>
        </div>

        {/* LỊCH SỬ GIAO DỊCH (TRANSACTIONS) */}
        <div className="bg-white dark:bg-[#122017] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
              Giao dịch gần đây
            </h3>
            <button className="text-sm font-semibold text-green-600 dark:text-green-500 hover:underline">
              Xem kết quả
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Trans 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl">
                  <Coffee weight="duotone" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Ăn uống tại Phở Lý
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Hôm nay, 08:30 • Ví chung
                  </p>
                </div>
              </div>
              <p className="font-bold text-red-500">- 45.000 đ</p>
            </div>

            {/* Trans 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center text-xl">
                  <TrendUp weight="duotone" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Lương tháng 10
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Hôm qua, 17:00 • Ví cá nhân
                  </p>
                </div>
              </div>
              <p className="font-bold text-green-600 dark:text-green-400">
                + 8.000.000 đ
              </p>
            </div>

            {/* Trans 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
                  <GraduationCap weight="duotone" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Học phí con
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    20 Th10, 2023 • Ví chung
                  </p>
                </div>
              </div>
              <p className="font-bold text-red-500">- 2.500.000 đ</p>
            </div>

            {/* Trans 4 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
                  <ShoppingCart weight="duotone" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Siêu thị WinMart
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    18 Th10, 2023 • Ví chung
                  </p>
                </div>
              </div>
              <p className="font-bold text-red-500">- 450.000 đ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
