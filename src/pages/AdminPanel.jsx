import DashboardOverview from "../components/admin/DashboardOverview";
import AdminProducts from "../components/admin/AdminProducts";

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <DashboardOverview />
      <AdminProducts />
    </div>
  );
}
