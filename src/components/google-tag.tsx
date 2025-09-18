import Script from "next/script";
import React from "react";

export default function GoogleTag() {
  return (
    <>
      <Script src="" />
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
        `,
        }}
      />
    </>
  );
}
