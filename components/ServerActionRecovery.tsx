"use client";

import { useEffect } from "react";
import { unstable_isUnrecognizedActionError } from "next/navigation";

const RELOAD_FLAG_PREFIX = "__server_action_recovery_reload__";

const isStaleServerActionError = (reason: unknown) => {
  if (unstable_isUnrecognizedActionError(reason)) {
    return true;
  }

  if (reason instanceof Error) {
    return (
      reason.name === "UnrecognizedActionError" ||
      (reason.message.includes("Server Action") && reason.message.includes("was not found"))
    );
  }

  return false;
};

const ServerActionRecovery = () => {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isStaleServerActionError(event.reason)) {
        return;
      }

      const reloadFlag = `${RELOAD_FLAG_PREFIX}:${window.location.pathname}`;

      // Avoid reload loops if the browser keeps replaying the same stale payload.
      if (sessionStorage.getItem(reloadFlag) === "1") {
        return;
      }

      sessionStorage.setItem(reloadFlag, "1");
      window.location.reload();
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
};

export default ServerActionRecovery;
