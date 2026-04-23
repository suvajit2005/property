# 🔧 Setup Instructions - HTTPError 500 Fix

## Problem Summary
Your application was throwing HTTP 500 errors due to:
1. **Missing Supabase environment variables** (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
2. **Unhandled promise rejections** from Supabase queries without .catch() handlers
3. **Missing try-catch** blocks in async/await operations

## ✅ What Was Fixed

### 1. Added Error Handling to All Supabase Queries
- Added `.catch()` handlers to all `.then()` promise chains
- Files updated:
  - `src/routes/index.tsx` - featured and recent properties queries
  - `src/routes/properties.tsx` - search and filter queries
  - `src/routes/properties.$id.tsx` - property detail and saved status queries
  - `src/routes/dashboard.tsx` - user listings queries
  - `src/routes/dashboard.saved.tsx` - saved properties queries
  - `src/components/site/PropertyCard.tsx` - saved status and toggle queries
  - `src/lib/auth.tsx` - session and profile loading

### 2. Added Try-Catch to Async Operations
- Files updated:
  - `src/components/site/PropertyCard.tsx` - toggleSave function
  - `src/routes/properties.$id.tsx` - toggleSave function
  - `src/components/site/OnboardingDialog.tsx` - profile update
  - `src/lib/auth.tsx` - loadProfile function

### 3. Created Environment Configuration
- `.env.example` - Template for environment variables (SAFE TO COMMIT)
- `.env.local` - Your local configuration (IGNORED BY GIT - NEVER COMMIT)

### 4. Improved Error Logging
- Better error messages in middleware when environment variables are missing

---

## 🚀 Setup Your Environment

### Step 1: Get Your Supabase Credentials
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click "Settings" → "API" in the left sidebar
4. Copy these values:
   - **Project URL** → `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **Anon public key** → `SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this SECRET!)

### Step 2: Fill in `.env.local`
Edit `.env.local` in the root directory:
```env
# Public/Client-side variables
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...your_actual_anon_key

# Server-side variables (KEEP SECRET!)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGc...your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_actual_service_role_key
```

### Step 3: Verify Setup
- ✅ `.env.local` is created with your actual credentials
- ✅ `.env.local` is in `.gitignore` (never commit!)
- ✅ `.env.example` shows what variables are needed

### Step 4: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
bun run dev
# or: npm run dev
# or: yarn dev
```

---

## 🧪 Testing

### Test 1: Check if errors are logged
Open browser DevTools (F12) → Console tab
- When loading properties, you should see no red errors
- Old: "Uncaught (in promise) Error: HTTPError"
- New: Errors are caught and logged gracefully

### Test 2: Test each feature
- [ ] Home page loads featured properties
- [ ] Properties page loads and filters work
- [ ] Property details page loads without errors
- [ ] Save property button works
- [ ] Dashboard shows your listings
- [ ] Authentication works

### Test 3: Monitor Network
Open DevTools → Network tab
- No failed 500 responses on Supabase API calls
- All requests should complete or fail gracefully with error handling

---

## 🐛 Troubleshooting

### Still seeing "HTTPError 500"?

**Check 1: Is `.env.local` created?**
```bash
# Verify file exists
ls -la .env.local  # macOS/Linux
dir .env.local     # Windows
```

**Check 2: Are credentials correct?**
- Copy-paste from Supabase dashboard again
- Make sure no extra spaces or quotes
- Verify URL format: `https://xxxxx.supabase.co` (not `http://`)

**Check 3: Did you restart the dev server?**
- Dev servers cache environment variables on startup
- Stop and restart: `Ctrl+C` then `bun run dev`

**Check 4: Check browser console for detailed errors**
- Open DevTools (F12)
- Console tab shows which query failed
- Error messages now include reason and file location

### Missing other credentials (Lovable, etc)?
Check `.env.example` for all required variables
- Only Supabase is required for core functionality
- Lovable.dev integration is optional

---

## 📚 Key Changes Made

### Error Handling Pattern (Before vs After)

**Before (❌ Unhandled):**
```typescript
supabase.from("properties")
  .select("*")
  .then(({ data }) => setData(data));
  // If error occurs: unhandled rejection → 500 error
```

**After (✅ Handled):**
```typescript
supabase.from("properties")
  .select("*")
  .then(({ data, error }) => {
    if (error) {
      console.error("Failed to fetch:", error);
      setData([]);
    } else {
      setData(data ?? []);
    }
  })
  .catch((err) => {
    console.error("Network error:", err);
    setData([]);
  });
```

---

## 💡 Best Practices for Future Development

1. **Always check for errors in Supabase responses:**
   ```typescript
   const { data, error } = await supabase...;
   if (error) handleError(error);
   ```

2. **Wrap async/await in try-catch:**
   ```typescript
   try {
     await supabase...
   } catch (err) {
     toast.error("Operation failed");
   }
   ```

3. **Test with network throttling:**
   - DevTools → Network tab → "Slow 3G"
   - Verify error handling works under poor conditions

4. **Monitor console in production:**
   - Errors are logged with `console.error()`
   - Use a service like Sentry for production monitoring

---

## ✨ Summary

All **8 files with unhandled errors** have been fixed. Your application now:
- ✅ Catches and logs all Supabase errors gracefully
- ✅ Shows user-friendly error messages (via `toast.error()`)
- ✅ Prevents 500 errors from crashing the app
- ✅ Has proper environment variable validation

**Next Step:** Fill in your `.env.local` with actual Supabase credentials and restart the dev server!
