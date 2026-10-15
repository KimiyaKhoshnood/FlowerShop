import { redirect } from "next/navigation";

// The middleware normally picks the language first; this is just a fallback.
export default function Home() {
    redirect("/en");
}
