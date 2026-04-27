import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProvider } from '@/lib/admin-context';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/settings')({
  head: () => ({
    title: 'Admin Settings',
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Purulia Properties',
    contactEmail: 'contact@puruliaproperties.com',
    supportPhone: '+91-XXXXX-XXXXX',
    commissionRate: 1,
    maxFeaturedListings: 5,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // In real app, save to database
    toast.success('Settings saved successfully');
    setSaved(true);
  };

  return (
    <AdminProvider>
      <AdminLayout>
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-1">Configure platform settings</p>
          </div>

          {/* General Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Phone
                </label>
                <Input
                  value={settings.supportPhone}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Monetization Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monetization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Rate (%)
                </label>
                <Input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Featured Listings Per User
                </label>
                <Input
                  type="number"
                  value={settings.maxFeaturedListings}
                  onChange={(e) => handleChange('maxFeaturedListings', parseInt(e.target.value))}
                />
              </div>
            </div>
          </Card>

          {/* Maintenance Mode */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Maintenance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Disable platform for all users except admins</p>
              </div>
              <button
                onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                className={`w-12 h-6 rounded-full transition ${
                  settings.maintenanceMode ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-8">
              Save Settings
            </Button>
            {saved && <p className="text-green-600 font-medium flex items-center">✓ Saved</p>}
          </div>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-800 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Clear All Cache
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Reset Analytics
              </button>
            </div>
          </Card>
        </div>
      </AdminLayout>
    </AdminProvider>
  );
}
