import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export function useStep(): [number] {
  const [step, setStep] = useState(1);
  const router = useRouter();

  function setStepByQuery() {
    let step = Number(new URLSearchParams(window.location.search).get("step"));

    if (typeof !isNaN(step) && step >= 1) setStep(step);
    else setStep(1);
  }

  useEffect(setStepByQuery);

  useEffect(() => {
    router.events.on("routeChangeComplete", setStepByQuery);
    return () => router.events.off("routeChangeComplete", setStepByQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [step];
}
