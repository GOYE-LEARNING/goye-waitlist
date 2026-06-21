import Image from "next/image";
import WaitlistComponent from "./component/waitlist_field";
import image from "@/public/images/perfect_screen.png";
export default function Home() {
  return (
    <div className="fixed inset-0 h-full w-full flex justify-center items-center flex-col overflow-auto scroll">
      <WaitlistComponent />
    </div>
  );
}
