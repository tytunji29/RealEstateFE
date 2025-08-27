import "@/styles/global.css";
import { Providers } from "@/app/providers";

export const metadata = {
  title: "My App",
  description: "Next.js application with providers setup",
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
