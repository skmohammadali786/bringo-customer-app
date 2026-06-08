---
name: Bringo Auth Flow
description: Correct navigation flow for authentication and onboarding in Bringo app
---

## Correct Navigation Flow

1. App index.tsx → if !hasSeenOnboarding → `/(auth)/splash`
2. splash.tsx → auto-navigates to `/(auth)/welcome` (NOT onboarding)
3. welcome.tsx:
   - "Get Started" → `/(auth)/onboarding`
   - "I already have an account" → `/(auth)/login`
4. onboarding.tsx → last slide calls `markOnboardingSeen()` + → `/(auth)/login`
5. login.tsx → `/(auth)/otp` (with phone param)
6. otp.tsx → `/(auth)/register` (with phone param) — NOT permissions
7. register.tsx → `login(phone, name)` then `/(tabs)`

## Critical Bug to Avoid

`login()` signature: `login(phone: string, name?: string)` — phone FIRST, name SECOND.
In register.tsx the correct call is `login(phone ?? "", name.trim())`.
Swapping these puts the name as phone number, breaking auth.

## Promo Codes

Valid codes in both checkout/index.tsx and order/summary.tsx:
- BRINGO10: 10% off (percent)
- FIRST50: ₹50 off (flat)
- SAVE20: 20% off (percent)

## Product Data

mockData.ts has 40 products across all 10 categories (3–6 each).
Product type includes `emoji` field — used in ProductCard and product/[id].tsx hero.

**Why:** Previous session had wrong param order causing name/phone mismatch, and onboarding was shown before welcome (making "skip onboarding" for existing users impossible).
