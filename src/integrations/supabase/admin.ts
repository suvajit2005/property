// Admin database queries and operations
import { supabase } from './client';

// ===== USERS MANAGEMENT =====
export async function getAdminUsers(filters?: { search?: string; role?: string; limit?: number; offset?: number }) {
  let query = supabase
    .from('profiles')
    .select('id, email, display_name, phone, role, created_at, onboarded', { count: 'exact' });

  if (filters?.search) {
    query = query.or(`display_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  query = query.order('created_at', { ascending: false });

  if (filters?.limit) {
    query = query.range(filters.offset || 0, (filters.offset || 0) + filters.limit - 1);
  }

  return query;
}

export async function getUserWithStats(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('owner_id', userId);

  return { profile, propertiesCount };
}

export async function updateUserRole(userId: string, role: 'buyer' | 'seller' | 'broker' | 'admin') {
  return supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
}

export async function blockUser(userId: string) {
  return supabase
    .from('profiles')
    .update({ onboarded: false })
    .eq('id', userId);
}

// ===== PROPERTIES MANAGEMENT =====
export async function getAdminProperties(filters?: {
  search?: string;
  status?: string;
  propertyType?: string;
  listingType?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('properties')
    .select('id, title, price, city, property_type, listing_type, status, is_verified, created_at, owner_id', { count: 'exact' });

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.propertyType) {
    query = query.eq('property_type', filters.propertyType);
  }

  if (filters?.listingType) {
    query = query.eq('listing_type', filters.listingType);
  }

  query = query.order('created_at', { ascending: false });

  if (filters?.limit) {
    query = query.range(filters.offset || 0, (filters.offset || 0) + filters.limit - 1);
  }

  return query;
}

export async function updatePropertyStatus(propertyId: string, status: 'pending' | 'active' | 'sold' | 'rented' | 'inactive') {
  return supabase
    .from('properties')
    .update({ status })
    .eq('id', propertyId);
}

export async function verifyProperty(propertyId: string, verified: boolean) {
  return supabase
    .from('properties')
    .update({ is_verified: verified })
    .eq('id', propertyId);
}

export async function featureProperty(propertyId: string, featured: boolean) {
  return supabase
    .from('properties')
    .update({ is_featured: featured })
    .eq('id', propertyId);
}

export async function deleteProperty(propertyId: string) {
  return supabase
    .from('properties')
    .delete()
    .eq('id', propertyId);
}

// ===== DASHBOARD ANALYTICS =====
export async function getDashboardStats() {
  const [usersRes, propertiesRes, activeListingsRes, pendingRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact' }).range(0, 0),
    supabase.from('properties').select('*', { count: 'exact' }).range(0, 0),
    supabase.from('properties').select('*', { count: 'exact' }).eq('status', 'active').range(0, 0),
    supabase.from('properties').select('*', { count: 'exact' }).eq('status', 'pending').range(0, 0),
  ]);

  const soldRentedRes = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .or('status.eq.sold,status.eq.rented')
    .range(0, 0);

  return {
    totalUsers: usersRes.count || 0,
    totalProperties: propertiesRes.count || 0,
    activeListings: activeListingsRes.count || 0,
    pendingApprovals: pendingRes.count || 0,
    soldRented: soldRentedRes.count || 0,
  };
}

export async function getPropertiesByType() {
  return supabase
    .from('properties')
    .select('property_type')
    .then(({ data }) => {
      if (!data) return {};
      return data.reduce((acc: any, item: any) => {
        acc[item.property_type] = (acc[item.property_type] || 0) + 1;
        return acc;
      }, {});
    });
}

export async function getUserGrowth() {
  // Get users created in last 30 days, grouped by day
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });
}

// ===== ADMIN AUDIT LOGS =====
export async function logAdminAction(userId: string, action: string, targetType: string, targetId: string, details?: any) {
  return supabase
    .from('admin_audit_logs')
    .insert({
      admin_id: userId,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      timestamp: new Date().toISOString(),
    });
}
