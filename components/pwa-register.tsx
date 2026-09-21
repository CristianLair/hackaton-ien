"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let active = true;
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        if (active) await reg.update();
      } catch (err) {
        if (active) console.debug("Service worker registration failed:", err);
      }
    };

    if (document.readyState === "complete") {
      void register();
    } else {
      const onLoad = () => void register();
      window.addEventListener("load", onLoad, { once: true });
      return () => {
        active = false;
        window.removeEventListener("load", onLoad);
      };
    }
    return () => {
      active = false;
    };
  }, []);

  return null;
}