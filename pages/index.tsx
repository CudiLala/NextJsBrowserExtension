import Image from "next/image";
import molaLogo from "@/public/images/mola-logo.png";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (typeof chrome != "undefined")
      chrome.storage.local.get("registered").then((result) => {
        if (result.registered) {
          chrome.storage.session.get("password").then((result) => {
            if (result.password) router.push("/wallet");
            else router.push("/unlock");
          });
        } else router.push("/on-board");
      });
  });

  return <></>;
}
