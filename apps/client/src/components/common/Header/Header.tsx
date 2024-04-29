"use client";

import { Button, buttonVariants } from "@client/components/ui/button";
import { typographyVariants } from "@client/components/ui/typography";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@client/components/ui/avatar";

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
      <Link href="/" className={cn(typographyVariants({ variant: "large" }))}>
        website
      </Link>
      {user.username ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            className={cn(
              buttonVariants({ size: "default", variant: "outline" }),
            )}
            href="/login"
          >
            Login
          </Link>
          <Link
            className={cn(
              buttonVariants({ size: "default", variant: "outline" }),
            )}
            href="/register"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
