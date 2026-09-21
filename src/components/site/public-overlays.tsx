"use client";

import { useCallback, useState } from "react";
import { CheckupPopup } from "@/components/checkup/checkup-popup";
import { LegalDisclaimer } from "@/components/site/legal-disclaimer";

export function PublicOverlays({
  checkupEnabled,
  checkupDelayMs,
  checkupTitle,
  checkupBody,
  checkupCta,
}: {
  checkupEnabled: boolean;
  checkupDelayMs: number;
  checkupTitle: string;
  checkupBody: string;
  checkupCta: string;
}) {
  const [disclaimerDone, setDisclaimerDone] = useState(false);
  const onDisclaimerDone = useCallback(() => setDisclaimerDone(true), []);

  return (
    <>
      <LegalDisclaimer onDone={onDisclaimerDone} />
      {disclaimerDone ? (
        <CheckupPopup
          enabled={checkupEnabled}
          delayMs={checkupDelayMs}
          title={checkupTitle}
          body={checkupBody}
          cta={checkupCta}
        />
      ) : null}
    </>
  );
}
