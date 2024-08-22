"use client";

import { Crisp } from "crisp-sdk-web";
import React, { useEffect } from "react";

export default function CrispChat() {
  useEffect(() => {
    Crisp.configure("1d452e28-90dc-4d27-8cb8-814cff341f7c");
  }, []);

  return null;
}
