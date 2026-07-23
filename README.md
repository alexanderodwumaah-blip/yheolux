# YHEOLUX — Signature. Elegance in Every Detail.

A full e-commerce site inspired by Jumia, built with **Next.js 14, Tailwind CSS, and Supabase**, ready to deploy on **Vercel**.

No online payments: buyers pick a product, choose pickup/delivery + payment
preference, then hand off to **WhatsApp or a phone call** to confirm with
the seller. Admins manage products and orders from a dashboard.

---

## 1. Push this project to your GitHub

This folder is a plain project (not yet a git repo). From inside it:

```bash
git init
git add .
git commit -m "Initial commit: YHEOLUX e-commerce site"
git branch -M main
git remote add origin https://github.com/alexanderodwumaah-blip/YOUR-REPO-NAME.git
git push -u origin main
```

(Create the empty repo first on GitHub, then run the commands above.)

---

## 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Once it's created, open **SQL Editor** → **New query**, paste the entire
   contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.
   This creates every table, security policy, the product-images storage
   bucket, delivery locations, and seeds your two starter products.
3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key

---

## 3. Configure environment variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_DEFAULT_SELLER_PHONE=233241234567
```

---

## 4. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

---

## 5. Create your admin account

1. Visit `/admin/signup` and create an account (name, email, password).
2. Go back to Supabase → **SQL Editor** and run (with your email):

   ```sql
   insert into admin_profiles (id, full_name)
   select id, 'Store Admin' from auth.users where email = 'you@example.com'
   on conflict (id) do nothing;
   ```

3. Log in at `/admin/login`. You can now add products and manage orders at
   `/admin/products` and `/admin/dashboard`.

> Why the manual step? It stops random strangers who sign up from getting
> instant admin access to your store. Every extra admin (staff, co-founder)
> follows the same two steps.

---

## 6. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your
   GitHub repo.
2. In **Environment Variables**, add the same three variables from
   `.env.local`.
3. Deploy. Vercel will give you a live URL (you can add a custom domain
   later under Project → Settings → Domains).
4. Because the app has a `manifest.json` and icons, visitors on mobile can
   **install it as an app** (an install banner appears automatically on
   supported browsers, or via the browser's "Add to Home Screen" menu).

---

## What's included

**Shop (public):**
- Home page with hero, search, and a product grid pulling live from Supabase
- Product detail pages with up to 4 photos, quantity picker, Add to Bag / Order Now
- Cart page
- Checkout: buyer name, phone, pickup/delivery point (Akuse, Asutuarey,
  Kpong, Agormanya, Somanya, Natriku — no delivery fee), and
  Preorder vs. Pay-on-Delivery — then **Order via WhatsApp** (opens a
  prefilled chat with the seller) or **Call Seller**
- Every order is saved to Supabase the moment it's placed, whichever button
  is used
- Newsletter signup (stored in `subscribers`)
- Installable as a phone app (PWA manifest + icons)

**Admin dashboard (`/admin`):**
- Email/password login, signup
- **Orders**: see every order with buyer info, items, total, delivery
  point, payment preference, and checkboxes to mark *Payment made* /
  *Delivered*
- **Products**: create/edit/delete, upload up to 4 photos per product
  (stored in Supabase Storage), set original price (optional, shown
  struck-through) vs. selling price, per-product seller phone number,
  in-stock and featured toggles

---

## Notes & next steps you may want

- **Multiple sellers**: right now each product has its own `seller_phone`,
  and checkout uses the first cart item's seller for the WhatsApp/call
  handoff. If you'll have many independent sellers, consider splitting
  multi-seller carts into separate orders at checkout.
- **Email confirmation**: Supabase may require email confirmation on
  sign-up by default. You can turn this off for faster admin onboarding
  under Authentication → Providers → Email in Supabase, if you prefer.
- **Custom domain / branding**: update `app/layout.tsx` metadata and
  `public/manifest.json` if you rename the store.
