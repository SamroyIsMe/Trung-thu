import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Trung Thu của bạn",
  description:
    "Câu hỏi Trung Thu gợi mở: chọn đáp án và đọc lời nhắn dịu dàng dưới ánh trăng.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
