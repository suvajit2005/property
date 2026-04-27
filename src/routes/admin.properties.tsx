import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  getAdminProperties,
  updatePropertyStatus,
  verifyProperty,
  featureProperty,
  deleteProperty,
} from '@/integrations/supabase/admin';
import { Search, Trash2, CheckCircle, Eye, Star } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/properties')({
  head: () => ({
    title: 'Property Management — Admin',
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [search, statusFilter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAdminProperties({
        search,
        status: statusFilter || undefined,
        limit: 50,
      });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      const { error } = await updatePropertyStatus(propertyId, newStatus as any);
      if (error) throw error;

      setProperties(
        properties.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      toast.success('Status updated');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleVerify = async (propertyId: string, verified: boolean) => {
    try {
      const { error } = await verifyProperty(propertyId, verified);
      if (error) throw error;

      setProperties(
        properties.map((p) => (p.id === propertyId ? { ...p, is_verified: verified } : p))
      );
      toast.success(verified ? 'Property verified' : 'Property unverified');
    } catch (error) {
      console.error('Failed to verify property:', error);
      toast.error('Failed to verify property');
    }
  };

  const handleFeature = async (propertyId: string, featured: boolean) => {
    try {
      const { error } = await featureProperty(propertyId, featured);
      if (error) throw error;

      setProperties(
        properties.map((p) => (p.id === propertyId ? { ...p, is_featured: featured } : p))
      );
      toast.success(featured ? 'Property featured' : 'Feature removed');
    } catch (error) {
      console.error('Failed to feature property:', error);
      toast.error('Failed to update feature');
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await deleteProperty(propertyId);
      if (error) throw error;

      setProperties(properties.filter((p) => p.id !== propertyId));
      toast.success('Property deleted');
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast.error('Failed to delete property');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Property Management</h1>
        <p className="text-gray-600 mt-1">Manage all property listings</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="inactive">Inactive</option>
          </select>

          <Button onClick={fetchProperties} className="bg-blue-600 hover:bg-blue-700">
            Refresh
          </Button>
        </div>
      </Card>

      {/* Properties Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading properties...
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No properties found
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 max-w-xs truncate">
                      {prop.title}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                      ₹{prop.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prop.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {prop.property_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop.id, e.target.value)}
                        className={`px-3 py-1 rounded text-xs font-semibold border-none cursor-pointer ${
                          prop.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : prop.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : prop.status === 'sold'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleVerify(prop.id, !prop.is_verified)}
                          className={`${
                            prop.is_verified ? 'text-green-600' : 'text-gray-400'
                          } hover:text-green-800`}
                          title={prop.is_verified ? 'Unverify' : 'Verify'}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleFeature(prop.id, !prop.is_featured)}
                          className={`${
                            prop.is_featured ? 'text-yellow-600' : 'text-gray-400'
                          } hover:text-yellow-800`}
                          title={prop.is_featured ? 'Unfeature' : 'Feature'}
                        >
                          <Star size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
