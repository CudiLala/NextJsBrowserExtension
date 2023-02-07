import BackButton from "@/components/button/back";

export default function NotificationPage() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Notifications
        </h1>
      </div>
    </div>
  );
}
