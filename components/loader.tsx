import React from "react";
import Image from "next/image";

export function Loader() {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Loading"
          fill
          src="/logo1.png"
          sizes="40px"
        />
      </div>
      <p className="text-sm text-muted-foreground">Stellar Is Thinking...</p>
    </div>
  );
}
