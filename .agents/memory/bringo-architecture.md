---
name: Bringo App Architecture
description: Key decisions for the Bringo Expo mobile app (hyperlocal on-demand commerce).
---

# Bringo App Architecture

## Key Decisions

**Auth pattern:** AsyncStorage-backed AuthContext. No backend — fully simulated OTP (any 6 digits work). Auth state drives root `app/index.tsx` redirects.

**Why:** First build is frontend-only per expo skill guidelines. AsyncStorage for all persistence.

**Navigation:** expo-router v6 file-based routing. Root stack → `(auth)` group → `(tabs)` group (5 tabs) → push/modal screens.

**Tab bar:** 5 tabs: Home, Orders, Wallet, Notifications, Profile.

**Color palette:**
- Background: #F7F5F0 (warm off-white)
- Primary: #111111, Accent orange: #FF9A3D, Accent green: #34C759, Accent blue: #4A90E2, Danger: #FF4D4F, Card: #FFFFFF
- Dark mode versions all in `constants/colors.ts`

**Typography:** Inter (400/500/600/700) via @expo-google-fonts/inter. Defined in `constants/typography.ts`.

**Design tokens:** Always use `useColors()` hook — never hardcode hex.

## ThemeContext (context/ThemeContext.tsx)
- Stores preference: "light" | "dark" | "system", persisted to AsyncStorage at `@bringo_theme`
- Also stores accentColor at `@bringo_accent`, default "#FF9A3D". Both loaded via Promise.all.
- **White flash fix:** Before `loaded` is true, `resolved` uses `systemScheme` directly — prevents dark-mode users seeing a white flash while AsyncStorage reads. After loaded, uses stored preference.
- **Do NOT return null while loading** — causes splash screen to stay visible. Always render children.
- useColors() overlays accentColor onto accentOrange/tint/accent keys.
- **Why:** App must default to light. Returning null blocks SplashScreen.hideAsync chain.

## AddressContext (context/AddressContext.tsx)
- Persistent address storage via AsyncStorage at `@bringo_addresses`.
- Provides: addresses, defaultAddress, addAddress, removeAddress, setDefault, formatAddress.
- Pre-seeded with 2 mock addresses. Wrap with `<AddressProvider>` inside AuthProvider in _layout.tsx.

## White Flash Fix
- Add `contentStyle: { backgroundColor: colors.background }` to Stack screenOptions in _layout.tsx
- RootLayoutNav uses useColors() inside ThemeProvider
- **Why:** Without this, a white flash appears briefly when navigating between screens.

## Animation Pattern
- All screens: `entering={FadeInDown.duration(400).delay(N)}` on Animated.View sections
- Standard stagger: 0, 80, 140, 200, 260, 320ms delays per successive section
- Interactive elements: useSharedValue + withSpring for press scale (0.93–1.0)
- **Why:** Consistent staggered entrance across all 50 screens.

## Linking for Phone/Email (help.tsx pattern)
- Import `* as Linking from "expo-linking"` (NOT react-native Linking — deprecated)
- Always call `canOpenURL()` first, fallback to Alert with contact info
- tel: and mailto: URL patterns work on real devices

## Share/Copy Invite (invite/index.tsx pattern)
- Use `expo-clipboard` (v8.0.8 for SDK 54) for `Clipboard.setStringAsync(text)`.
- Use `Share` from `react-native` for cross-platform sharing (WhatsApp, SMS, email).
- **Why:** expo-clipboard@56 is wrong SDK version — must pin ~8.0.8 for SDK 54.

## Button Variants
- Valid: "primary" | "secondary" | "ghost" | "danger" | "orange". "outline" does NOT exist.

## Stack Animation Types
- Valid: "default" | "fade" | "flip" | "none" | "slide_from_bottom" | "slide_from_right" | "slide_from_left" | "simple_push".

## Promo Codes (checkout/index.tsx)
- BRINGO10 = 10% off, FIRST50 = ₹50 flat off, SAVE20 = 20% off.

## Notifications Tab
- Hidden from bottom bar using `href: null` in Tabs.Screen options (route kept, tab icon removed).

## Trending See-All
- Routes to `/search/results?filter=trending` (not a modal, standard push).

## Request Product Success
- Route to `/request/success` (NOT `/order/success`) — distinct screens with different accent colors
- Request success uses orange ring; order success uses green ring

## Photo Upload (personal.tsx + profile.tsx pattern)
- Uses expo-image-picker (~17.0.9, already installed)
- Action sheet: "Take Photo" → launchCameraAsync | "Choose from Library" → launchImageLibraryAsync
- Web fallback: Alert explaining feature is mobile-only
- Request both camera AND media library permissions separately

## Dev Script Port Fix
- artifact.toml sets PORT=18115 via env block; use `${PORT:-18115}` in package.json dev script
- **Why:** Without the bash default-value fallback, workflow fails when PORT env not injected

## Mock data (constants/mockData.ts)
Exports: CATEGORIES, PRODUCTS, ACTIVE_ORDERS, PAST_ORDERS, NOTIFICATIONS, WALLET_TRANSACTIONS, OFFERS, ORDER_STATUS_STEPS

## Screens built (50+ total)
Auth: splash, onboarding, welcome, login, otp, permissions
Tabs: home, orders, wallet, notifications, profile
Push: search, categories, request/index, request/success, order/*, chat, product/[id], product/reviews
Profile: personal, addresses, help, appearance, settings, terms, privacy, about, rewards, referral, wallet-history, payment-methods, manage, delete
Support: wallet/add, wallet/transfer, address/add, address/edit, notifications/settings, invite/index
