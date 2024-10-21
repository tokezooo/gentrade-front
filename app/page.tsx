import Chat from "@/components/prebuilt/chat";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center  px-24">
      <div className="w-full min-w-[600px] flex flex-col">
        <Chat />
      </div>
    </main>
  );
}
