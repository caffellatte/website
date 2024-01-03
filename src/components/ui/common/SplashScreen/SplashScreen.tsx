"use client";
import { FC, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import anime from "animejs";
import { Loader } from "@/components/icons";

interface SplashScreenProps {
  finishLoading: () => void;
}

const SplashScreen: FC<SplashScreenProps> = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const animate = useCallback(() => {
    const layer = anime.timeline();
    layer
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1,
        duration: 230,
        easing: "easeInOutBounce",
      })
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1.16,
        duration: 230,
        easing: "easeInOutBounce",
      })
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1,
        duration: 230,
        easing: "easeInOutBounce",
      })
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1.16,
        duration: 230,
        easing: "easeInOutBounce",
      });

    const loader = anime.timeline({
      complete: () => finishLoading(),
    });
    loader
      .add({
        targets: "#loader-path",
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInSine",
        duration: 800,
        direction: "normal",
        loop: true,
      })
      .add({
        targets: "#loader-path",
        strokeDashoffset: [0, anime.setDashoffset],
        easing: "easeInExpo",
        duration: 800,
        direction: "reverse",
        loop: true,
      });
  }, [finishLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div id="logo" className="flex h-screen items-center justify-center">
      <Loader className=" text-black" />
    </div>
  );
};

export default SplashScreen;
