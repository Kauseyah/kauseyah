import AccountSidebar from "@/components/account/AccountSidebar";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-ivory pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-body">
      <div className="container-site max-w-[1200px] mx-auto flex flex-col gap-10 items-center">
        <AccountSidebar />
        <div className="w-full min-h-[600px]">
          {children}
        </div>
      </div>
    </main>
  );
}
