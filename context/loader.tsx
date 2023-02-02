import Loader, { useLoader } from "components/loader";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect } from "react";

export const LoaderContext = createContext<[() => void, () => void]>([
  () => {},
  () => {},
]);

export default function LoaderContextComponent({
  children,
}: {
  children: ReactNode;
}) {
  const { loader, startLoader, stopLoader } = useLoader();
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", startLoader);
    router.events.on("routeChangeError", stopLoader);
    router.events.on("routeChangeComplete", stopLoader);

    () => {
      router.events.off("routeChangeStart", startLoader);
      router.events.off("routeChangeError", stopLoader);
      router.events.off("routeChangeComplete", stopLoader);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoaderContext.Provider value={[startLoader, stopLoader]}>
      <Loader loader={loader} />
      {children}
    </LoaderContext.Provider>
  );
}
