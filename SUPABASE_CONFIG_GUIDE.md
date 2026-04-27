# Supabase Setup & Configuration Guide

## What Was Fixed

### Application Fixes ✅
1. **Created OAuth Callback Route** (`src/routes/auth.callback.tsx`)
   - Handles OAuth redirects from Supabase
   - Processes both successful authentication and error cases
   - Redirects to dashboard on success

2. **Fixed Property Image Upload Flow** 
   - Updated `uploadPropertyImages()` to return image URLs properly
   - Fixed `createProperty()` to return full property data
   - Updated post-property form to use corrected functions
   - Added better error handling and logging

3. **Corrected OAuth Redirect URL**
   - Changed from `/dashboard` to `/auth/callback`
   - Ensures OAuth flow completes properly before navigation

---

## What Still Needs Configuration (Database Setup)

### ✅ Already Working
- Email/password authentication
- Profile auto-creation via database trigger
- RLS policies for properties table
- Storage buckets for images

### ⚠️ Requires Supabase Console Configuration

#### 1. **Google OAuth Provider Setup**

Go to: **Supabase Dashboard → Your Project → Authentication → Providers → Google**

**Steps:**
1. Click "Enable Google Provider"
2. You need Google OAuth Credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project (or use existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Get your Client ID and Client Secret

3. In Supabase, paste:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret

4. Add **Authorized Redirect URIs** in Supabase:
   ```
   http://localhost:8081/auth/callback
   http://localhost:3000/auth/callback (if using different port)
   https://yourdomain.com/auth/callback (production)
   ```

5. Also add these same URIs to Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs

#### 2. **Storage Bucket Verification**

Go to: **Supabase Dashboard → Your Project → Storage**

Verify these buckets exist and are PUBLIC:
- ✅ `property-images` (public)
- ✅ `property-documents` (private)
- ✅ `user-avatars` (public)
- ✅ `user-documents` (private)

If they don't exist, run the SQL from `SUPABASE_SCHEMA.sql` under the "Storage buckets" section

#### 3. **Enable RLS (if not already enabled)**

Go to: **Supabase Dashboard → Your Project → SQL Editor**

Run these commands to enable RLS:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
```

All policies are already defined in `SUPABASE_SCHEMA.sql`

---

## Environment Variables Required

Your `.env` file should have:

```env
# Public/Client-side variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...your_anon_key

# Server-side variables (for SSR)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key (optional for now)
```

Get these from: **Supabase Dashboard → Your Project → Settings → API**

---

## Testing Checklist

After configuring, test these flows:

### ✅ Email Authentication
- [ ] Sign up with email and password
- [ ] Profile created automatically
- [ ] Can log in with credentials
- [ ] Can log out

### ⚠️ Google OAuth (requires Google setup)
- [ ] Click "Continue with Google"
- [ ] Redirects to Google login
- [ ] After approving, redirects to `/auth/callback`
- [ ] Profile created automatically
- [ ] Redirects to dashboard
- [ ] User can post properties

### ✅ Property Posting
- [ ] Upload property with images
- [ ] Images appear in storage bucket
- [ ] Property shows in database with image URLs
- [ ] Can see property on properties page

### ✅ Image Upload
- [ ] Images are stored in `property-images` bucket
- [ ] Public URLs are accessible
- [ ] Database property record has image array filled

---

## Troubleshooting

### "Google sign-in failed" error
→ Check Google OAuth credentials in Supabase console
→ Verify redirect URLs are added in both Supabase and Google Cloud Console

### "Image upload failed"
→ Check storage bucket exists and is public
→ Verify RLS policies allow authenticated users to upload
→ Check browser console for specific error

### "Property not saved to database"
→ Check that RLS policy allows INSERT for authenticated users
→ Check owner_id matches current user's ID
→ Check for data type mismatches (price should be numeric, status should be enum value)

### "Profile not created after signup"
→ Check that `handle_new_user()` trigger exists
→ Check database logs for trigger errors
→ Verify auth.users → public.profiles relationship exists

---

## Files Modified

1. `src/routes/auth.callback.tsx` - NEW OAuth callback handler
2. `src/integrations/supabase/auth.ts` - Fixed OAuth redirect URL
3. `src/integrations/supabase/storage.ts` - Improved image upload return values
4. `src/integrations/supabase/database.ts` - Better error handling for createProperty
5. `src/routes/post-property.tsx` - Fixed image URL handling

---

## Next Steps

1. Provide your Supabase credentials and I'll help verify the setup
2. Once Google OAuth is configured, test the full flow
3. Monitor Supabase logs for any RLS violations
4. Test with real data
