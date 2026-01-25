import { redirect } from "next/navigation";

// M6-8: Default landing page is War Room for recruiters
// /boot is still accessible for the cinematic experience
export default function Home() {
  redirect('/war-room');
}
