"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SplashScreen from "@client/components/common/SplashScreen";
import Header from "@client/components/common/Header";
import Footer from "@client/components/common/Footer";
import { useUsersMe } from "@client/services/hooks/useUsersMe";
import Cookies from "js-cookie";
import { useSetAtom } from "jotai";
import { userAtom } from "@client/services/atoms";

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const access_token = Cookies.get("access_token");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState<boolean>(isHome);
  const me = useUsersMe({}, { enabled: !!access_token });
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    if (me.data) {
      setUser(me.data);
    }
  }, [me.data, setUser, me.isFetching]);

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
