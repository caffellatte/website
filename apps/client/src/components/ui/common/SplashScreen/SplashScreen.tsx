"use client";

import { cn } from "@client/lib/utils";
import { Loader } from "@client/components/icons";
import { FC, useEffect, useState, useRef } from "react";
import { Typography } from "@client/components/ui/base/Typography";
import anime, { AnimeTimelineInstance, AnimeInstance } from "animejs";

interface SplashScreenProps {
  finishLoading: () => void;
}

const SplashScreen: FC<SplashScreenProps> = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const loaderAnimationRef = useRef<AnimeInstance>();
  const loaderPathAnimationRef = useRef<AnimeTimelineInstance>();

  useEffect(() => {
    loaderAnimationRef.current = anime({
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

    loaderPathAnimationRef.current = anime.timeline({
      complete: () => finishLoading(),
    });

    loaderPathAnimationRef.current
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

    setIsMounted(true);
  }, [finishLoading]);

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
