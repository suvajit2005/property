import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getDashboardStats } from '@/integrations/supabase/admin';
import { Users, Building2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/')({
  head: () => ({
    title: 'Admin Dashboard — Purulia Properties',
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    activeListings: 0,
    pendingApprovals: 0,
    soldRented: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'bg-orange-500' },
    { label: 'Active Listings', value: stats.activeListings, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending Approval', value: stats.pendingApprovals, icon: Clock, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${loading ? 'animate-pulse' : ''}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h2>
          <p className="text-3xl font-bold text-yellow-500">{stats.pendingApprovals}</p>
          <p className="text-gray-600 text-sm mt-2">Properties awaiting verification</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sold / Rented</h2>
          <p className="text-3xl font-bold text-green-500">{stats.soldRented}</p>
          <p className="text-gray-600 text-sm mt-2">Completed transactions</p>
        </Card>
      </div>

      {/* Quick Navigation */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition cursor-pointer"
          >
            <Users size={24} className="mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-gray-800">Manage Users</p>
          </a>
          <a
            href="/admin/properties"
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition cursor-pointer"
          >
            <Building2 size={24} className="mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium text-gray-800">Manage Properties</p>
          </a>
          <a
            href="/admin/properties?status=pending"
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition cursor-pointer"
          >
            <Clock size={24} className="mx-auto mb-2 text-yellow-600" />
            <p className="text-sm font-medium text-gray-800">Approvals</p>
          </a>
          <a
            href="/admin/settings"
            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition cursor-pointer"
          >
            <Building2 size={24} className="mx-auto mb-2 text-gray-600" />
            <p className="text-sm font-medium text-gray-800">Settings</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
