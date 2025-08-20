import { AdminGuard } from "@/components/admin/admin-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-bold">Lab17 Admin Panel</h1>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-400">shay152@gmail.com</span>
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-medium">SA</span>
              </div>
            </div>
          </div>
        </div>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}