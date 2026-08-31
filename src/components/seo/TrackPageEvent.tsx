"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type TrackPageEventProps = {
  name: AnalyticsEventName;
  payload?: Record<string, string | number | boolean>;
};

export function TrackPageEvent({ name, payload }: TrackPageEventProps) {
  useEffect(() => {
    trackEvent(name, payload);
    // Fire once per mount for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- page-view once
  }, [name]);

  return null;
}
