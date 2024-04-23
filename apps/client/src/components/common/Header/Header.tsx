"use client";

import { Button, buttonVariants } from "@client/components/ui/base/Button";
import { typographyVariants } from "@client/components/ui/base/Typography";
import { cn } from "@client/lib/utils";
import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom, userAtomInitial } from "@client/services/atoms";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@client/components/ui/dropdown-menu";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  function logout() {
    setUser(userAtomInitial);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_id");
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between py-4 w-full">
      <Link href="/" className={cn(typographyVariants({ variant: "h5" }))}>
        website
      </Link>
      {user.username ? (
        <DropdownMenu>
          <DropdownMenuTrigger>{user.username}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-6">
          <Link
            className={cn(buttonVariants({ size: "none", variant: "link" }))}
            href="/login"
          >
            login
          </Link>
          <Link
            className={cn(buttonVariants({ size: "none", variant: "link" }))}
            href="/register"
          >
            register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
