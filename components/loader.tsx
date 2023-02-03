import { useState } from "react";

export default function Loader({ loader }: { loader: boolean }) {
  if (loader)
    return (
      <div className="absolute top-0 left-0 z-50">
        <span>Loading...</span>
      </div>
    );
  return <></>;
}

export function useLoader() {
  const [active, setActive] = useState(false);

  function startLoader() {
    setActive(true);
  }

  function stopLoader() {
    setActive(false);
  }

  return { loader: active, startLoader, stopLoader };
}
