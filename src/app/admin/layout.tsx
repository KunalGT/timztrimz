import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin | Timz Trimz",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  // Allow login page through without auth
  // Layout wraps all /admin/* pages, but we need login to be accessible
  // We'll check the path via a trick: login page sets its own layout

  return (
    <div className="min-h-screen bg-off-white">
      {authed ? (
        <>
          <AdminSidebar />
          <div className="lg:ml-64">
            <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center">
              <div className="ml-10 lg:ml-0">
                <h2 className="font-display text-lg text-black">
                  Timz Trimz Admin
                </h2>
              </div>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </>
      ) : (
        // Not authenticated - only render children (login page)
        <>{children}</>
      )}
    </div>
  );
}
