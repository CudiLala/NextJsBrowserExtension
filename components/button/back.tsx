import { ArrowBack } from "@/components/icons/arrows";
import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="absolute w-6 h-6 flex"
      onClick={() => router.back()}
    >
      <ArrowBack />
    </button>
  );
}
