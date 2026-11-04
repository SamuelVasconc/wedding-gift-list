import { redirect } from "next/navigation";
import { isAuthBypassed } from "@/lib/auth-bypass";

export const dynamic = "force-dynamic";

export default function Home() {
  redirect(isAuthBypassed() ? "/gifts" : "/login");
}
