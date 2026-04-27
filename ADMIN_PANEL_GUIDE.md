# Admin Panel Setup Guide

## Overview
Complete admin panel for managing all resources in Dream Property Hub platform.

## Features Implemented

### ✅ Dashboard
- Real-time statistics (Total Users, Properties, Active Listings, Pending Approvals, Sold/Rented)
- Quick action buttons
- Clean, modern interface with card-based layout

### ✅ User Management
- View all users with search and filters
- Filter by role (Buyer, Seller, Broker, Admin)
- Update user roles
- View user details
- Bulk operations support

### ✅ Property Management
- View all properties with advanced filtering
- Filter by status, type, and listing type
- Approve/Reject listings (status change)
- Verify/Unverify properties
- Feature/Unfeature properties
- Delete properties
- Real-time status updates

### ✅ Settings Panel
- General settings (Site name, Contact info)
- Monetization settings (Commission rate, Featured listing caps)
- Maintenance mode toggle
- Danger zone actions

### ✅ Authentication & Security
- Admin-only access control
- Role-based authorization
- Protected routes
- Automatic redirect for unauthorized users

---

## How to Use

### 1. Access Admin Panel

**URL:** `http://localhost:8081/admin`

**Requirements:**
- Must have `role = 'admin'` in your profile
- Automatic redirect if not authorized

### 2. Dashboard
Shows platform metrics at a glance:
- Click on any stat card for quick details
- Use quick action buttons to navigate to management modules

### 3. User Management (`/admin/users`)

**Search:** Find users by name or email
**Filter:** By role (Buyer, Seller, Broker, Admin)
**Actions:**
- Click **Edit** (pencil icon) to change user role
- Click **Delete** (trash icon) to remove user
- Changes apply immediately

**Example Workflow:**
1. Search for username
2. Click Edit button
3. Select new role from dropdown
4. Click Save

### 4. Property Management (`/admin/properties`)

**Search:** By title or address
**Filters:** By status (Pending, Active, Sold, etc.)
**Actions:**
- ✓ **Verify**: Mark as verified by clicking checkmark
- ⭐ **Feature**: Highlight property by clicking star
- 👁️ **View**: Open property details
- 🗑️ **Delete**: Remove listing

**Status Meanings:**
- **Pending**: Awaiting admin approval
- **Active**: Live on platform
- **Sold**: Transaction completed
- **Rented**: Property rented out
- **Inactive**: Hidden from users

### 5. Settings (`/admin/settings`)

Configure:
- Platform branding (Site name)
- Contact information
- Commission rates for monetization
- Featured listing caps
- Maintenance mode (disable platform for users)

---

## Database Integration

### Tables Used

1. **profiles** - User information
   - Filter by role
   - Update user details
   - Search by email/name

2. **properties** - Property listings
   - Filter by status, type
   - Update status, verification, featured flag
   - Search by title/address
   - Delete listings

3. **admin_audit_logs** (optional) - Track admin actions
   - Log all admin operations
   - Filter by action type
   - Track who did what and when

### CRUD Operations

**CREATE:** Settings panel allows creation of new configurations
**READ:** All modules fetch and display data
**UPDATE:** Users can update user roles, property status, verification
**DELETE:** Remove users or properties

---

## Customization

### Add New Admin Modules

1. **Create route file:** `src/routes/admin.[moduleName].tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProvider } from '@/lib/admin-context';

export const Route = createFileRoute('/admin/moduleName')({
  head: () => ({ title: 'Module Title' }),
  component: ModulePage,
});

function ModulePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        {/* Your content */}
      </AdminLayout>
    </AdminProvider>
  );
}
```

2. **Add to navigation** in `src/components/admin/AdminLayout.tsx`:

```typescript
const navItems = [
  // ... existing items
  { icon: YourIcon, label: 'New Module', href: '/admin/moduleName' },
];
```

### Style Customization

- **Colors:** Use Tailwind classes
- **Primary Blue:** `#0e47a1` (use `bg-blue-600` or adjust)
- **Accent Orange:** `#ff9700` (use `bg-orange-500`)
- **White:** `#ffffff`

### Add Charts/Analytics

Import chart library:
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
```

Use in components to display analytics.

---

## Security Checklist

✅ Admin users have `role = 'admin'`
✅ Routes protected with `AdminProvider`
✅ RLS policies on database tables
✅ Audit logging for admin actions (optional but recommended)
✅ Rate limiting on sensitive operations
✅ Input validation on forms

---

## Troubleshooting

### Issue: "Unauthorized" on `/admin`
**Solution:** User doesn't have admin role. Update in Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### Issue: Tables not loading
**Solution:** 
1. Check Supabase connection in `.env`
2. Verify table names in queries
3. Check RLS policies

### Issue: Changes not reflecting
**Solution:** 
1. Click "Refresh" button
2. Clear browser cache
3. Check browser console for errors

---

## Future Enhancements

- 📊 Advanced analytics with charts (Recharts/Chart.js)
- 📧 Email notification system
- 📱 Mobile app admin access
- 🔔 Real-time notifications for admin actions
- 📝 Content moderation queue
- 💰 Payment/transaction management
- 📍 Location/category management
- 🧾 Advanced reporting & exports
- 🤖 AI-powered fraud detection

---

## Support

For issues or questions about the admin panel:
1. Check database schema in Supabase
2. Verify RLS policies are correctly configured
3. Check browser console for JavaScript errors
4. Verify environment variables are set correctly

---

## Quick Commands

**Start dev server:**
```bash
npm run dev
```

**Access admin panel:**
```
http://localhost:8081/admin
```

**Make a user admin:**
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'user-id';
```

---

Last Updated: April 24, 2026
