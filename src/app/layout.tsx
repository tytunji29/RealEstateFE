import "@/styles/global.css";
import { Providers } from "@/app/providers";

export const metadata = {
  title: "OWNERS DOORMORT",
  description: "OWNERS DOORMORT - Real Estate Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
