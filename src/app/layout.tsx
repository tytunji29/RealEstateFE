import "@/styles/global.css";
import { Providers } from "@/app/providers";

export const metadata = {
  title: "Pinancle Real Estate",
  description: "Pinancle Real Estate",
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
