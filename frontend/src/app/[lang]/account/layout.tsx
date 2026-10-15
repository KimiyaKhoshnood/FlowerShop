import { AccountNav } from "@/components/account/AccountNav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-10">
      <AccountNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
