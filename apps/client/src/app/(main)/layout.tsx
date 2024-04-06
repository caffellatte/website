"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SplashScreen from "@client/components/ui/common/SplashScreen";
import Header from "@client/components/ui/common/Header";
import Footer from "@client/components/ui/common/Footer";

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState<boolean>(isHome);

  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  return (
    <>
      {isLoading && isHome ? (
        <SplashScreen finishLoading={() => setIsLoading(false)} />
      ) : (
        <div className="container flex min-h-screen flex-col items-center justify-between">
          <Header />
          {children}
          <Footer />
        </div>
      )}
    </>
  );
}
