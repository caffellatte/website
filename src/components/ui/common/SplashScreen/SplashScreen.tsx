"use client";

import anime from "animejs";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/icons";
import { Typography } from "@/components/ui/base/Typography";
import { FC, useEffect, useState, useCallback } from "react";

interface SplashScreenProps {
  finishLoading: () => void;
}

const SplashScreen: FC<SplashScreenProps> = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const animate = useCallback(() => {
    anime({
      targets: "#loader",
      rotate: {
        value: 360,
        duration: 1600,
        easing: "easeInOutSine",
      },
      scale: {
        value: 1.62,
        duration: 2000,
        delay: 800,
        easing: "easeInOutQuart",
      },
    });

    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: "#loader-path",
        duration: 200,
        opacity: 0,
      })
      .add({
        targets: "#loader-path",
        strokeDashoffset: [0, anime.setDashoffset],
        easing: "easeOutSine",
        duration: 800,
        opacity: 1,
        direction: "reverse",
        loop: true,
      })
      .add({
        targets: "#loader-path",
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInSine",
        duration: 800,
        opacity: 1,
        direction: "normal",
        loop: true,
      })
      .add({
        targets: "#loader-path",
        duration: 400,
        opacity: 1,
      })
      .add({
        targets: "#loader-path",
        duration: 600,
        opacity: 0,
      });
  }, [finishLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader
        id="loader"
        className={cn(isMounted ? "text-black" : "text-white")}
      />
      <Typography
        className={cn("absolute", isMounted && "hidden")}
        variant="body1"
      >
        Loading...
      </Typography>
    </div>
  );
};

export default SplashScreen;
