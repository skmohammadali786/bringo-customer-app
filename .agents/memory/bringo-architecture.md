---
name: Bringo App Architecture
description: Key decisions for the Bringo Expo mobile app (hyperlocal on-demand commerce).
---

# Bringo App Architecture

## Key Decisions

**Auth pattern:** AsyncStorage-backed AuthContext. No backend — fully simulated OTP (any 6 digits work). Auth state drives root `app/index.tsx` redirects.

**Why:** First build is frontend-only per expo skill guidelines. AsyncStorage for all persistence.

**Navigation:** expo-router v6 file-based routing. Root stack → `(auth)` group (splash/onboarding/login/otp/permissions) → `(tabs)` group (5 tabs) → push/modal screens.

**Tab bar:** `isLiquidGlassAvailable()` gates NativeTabs vs ClassicTabs (BlurView + Feather icons). 5 tabs: Home, Orders, Wallet, Notifications, Profile.

**Color palette:**
- Background: #F7F5F0 (warm off-white)
- Primary: #111111
- Accent orange: #FF9A3D
- Accent green: #34C759
- Accent blue: #4A90E2
- Danger: #FF4D4F
- Card: #FFFFFF

**Typography:** Inter (400/500/600/700) via @expo-google-fonts/inter. Defined in `constants/typography.ts`.

**Design tokens:** Always use `useColors()` hook — never hardcode hex. Colors in `constants/colors.ts` with light + dark palettes.

**How to apply:** Any new screen imports `useColors()`, `useSafeAreaInsets()`. Web insets: 67px top, 34px bottom + tabBarHeight (84px).

**Images:** 10 AI-generated assets in `assets/images/` (icon, onboarding1-3, hero_products, category_groceries/pharmacy/electronics, empty_state, success_state).

**Mock data:** All in `constants/mockData.ts` — categories, products, orders, notifications, wallet transactions, offers.

**Screens built (50 total):**
- Auth: splash, onboarding, welcome, login, otp, permissions
- Tabs: home, orders, wallet, notifications, profile
- Push: search, categories/index, categories/[slug], request/index, order/[id], order/summary, order/payment, order/success, chat/[id]
- Profile: personal, addresses, help, rewards, referral, wallet-history, settings
