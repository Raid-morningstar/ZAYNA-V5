import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

const menuFont = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-menu",
  display: "swap",
});

const RootLayout = ({ children }: { children: import("react").ReactNode }) => {
  return (
    <html lang="fr">
      <body className={`font-poppins antialiased ${menuFont.variable}`}>
        <ClerkProvider>
          {children}
          <Toaster
            position="bottom-right"
            gutter={8}
            toastOptions={{
              duration: 2800,
              style: {
                background: "#ffffff",
                color: "#162E6E",
                fontSize: "13px",
                fontWeight: "500",
                borderRadius: "16px",
                border: "1px solid rgba(77,182,198,0.25)",
                boxShadow: "0 8px 32px -8px rgba(22,46,110,0.18), 0 2px 8px -2px rgba(22,46,110,0.08)",
                padding: "10px 14px",
                maxWidth: "320px",
              },
              success: {
                iconTheme: {
                  primary: "#4DB6C6",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#e11d48",
                  secondary: "#ffffff",
                },
                style: {
                  background: "#fff1f2",
                  color: "#9f1239",
                  border: "1px solid rgba(225,29,72,0.15)",
                },
              },
            }}
          />
        </ClerkProvider>
      </body>
    </html>
  );
};

export default RootLayout;
