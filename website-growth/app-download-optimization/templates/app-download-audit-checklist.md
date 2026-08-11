# App Download Optimization: Audit & Setup Checklist

Use this checklist to evaluate on-site web-to-app touchpoints, eliminate transition friction, and optimize channels to drive maximum native mobile app installations.

---

## 1. Intrusiveness & Mobile SEO Compliance

- [ ] **No Immediate Full-Screen Interstitials:** Are full-screen app-install popups completely disabled on initial page load? (Ensures compliance with Google's mobile-friendly guidelines and prevents SEO ranking penalties).
- [ ] **Value-First Positioning:** Are high-friction app promotion modals shown only *after* the user has completed a high-intent web action (e.g., viewing an order confirmation, looking up a tracking link, or spending >3 minutes on site)?
- [ ] **Scroll-Tolerant Layouts:** Do any app banners leave at least 85% of the mobile screen visible, allowing users to read page content without being forced to download?

## 2. Mobile Custom Smart Banner UX

- [ ] **Unified Cross-Browser Styling:** Is the app-install banner a custom HTML/CSS element rather than relying on browser-default Safari/Android smart banners? (Ensures consistent, stylized presentation across all browsers, including Chrome, Firefox, and Opera on both iOS and Android).
- [ ] **OS-Aware CTA Routing:** Does the banner's primary CTA button automatically detect the user's active operating system and link directly to the correct store?
  - iOS Web -> Link directly to Apple App Store
  - Android Web -> Link directly to Google Play Store
  - Desktop Web -> Suppressed or replaced with handoff tools
- [ ] **Essential Visual Anatomy:** Does the custom smart banner include the following five critical elements:
  - [ ] **High-Res App Icon:** Instantly recognizable, branded app icon.
  - [ ] **App Name & Author:** Clear app title with company/publisher name.
  - [ ] **Social Proof / Ratings:** Dynamic display of active App Store ratings (e.g., `★★★★★ (4.8 Rating)`).
  - [ ] **Benefit-Driven Microcopy:** Explicit, action-oriented motivation (e.g., *"Download for Real-Time Delivery Tracking"* or *"$15 Off First App Order"*).
  - [ ] **High-Contrast Call to Action:** Prominent button labeled `GET APP`, `INSTALL`, or `OPEN`.
- [ ] **Prominent & Easy Dismissal:** Is there a highly visible close button `[x]` with a minimum touch-target size of 44x44px?
- [ ] **Smart Dismissal Suppression:** When a user clicks the close `[x]` button, does the system write a cookie or `localStorage` key to suppress the banner for at least 7 to 14 days?
- [ ] **"Installed" Detection Logic:** Does the banner dynamically check if the app is already installed and transition the button CTA text from "INSTALL" to "OPEN"?

## 3. Desktop-to-Mobile Continuity Bridge

- [ ] **Dynamic QR Code Component:** Does the desktop app landing page display a prominent QR code with clear scan instructions (e.g., *"Scan with your mobile camera to download instantly"*), rather than a static link?
- [ ] **QR Code OS Router:** Does the QR code target a dynamic short link that auto-detects the scanning phone's OS and redirects to the correct app store?
- [ ] **SMS Text-to-Download Form:** Is there a single-field input form allowing desktop users to type their mobile phone number to receive an instant, direct download link via SMS?
- [ ] **Real-Time Input Validation:** Does the phone input field validate country codes and formats in real-time as the user types, preventing submission errors?
- [ ] **Regulatory SMS Compliance (TCPA/GDPR):** Is there an unchecked, explicit consent checkbox directly below the input field with compliant terms (e.g., *"By clicking, you agree to receive a one-time automated text message with a link to download our app. Msg & data rates may apply."*)?

## 4. Deep Linking & Context Preservation

- [ ] **Universal Links (iOS) & App Links (Android):** Are active deep-linking assets configured on the web server (e.g., `apple-app-site-association` and `.well-known/assetlinks.json`)?
- [ ] **Bypass to App:** When a user who already has the app installed clicks an app promo link on mobile web, does the browser instantly launch the native app rather than sending them to the app store?
- [ ] **Deferred Deep Linking Integration:** Is a deep-linking provider (e.g., Branch, AppsFlyer, Adjust) integrated to maintain user context across the app store installation gap?
- [ ] **Post-Install Context Preservation:** When a new user downloads, installs, and launches the app for the first time, does the app automatically route them to the *exact* product page, content piece, or promotional coupon they were viewing on mobile web?

## 5. Campaign Mechanics & Value Proposition

- [ ] **Exclusive App-Only Incentives:** Is there a compelling on-site value proposition for downloading the app (e.g., *"Receive $15 off first app purchase,"* *"Free shipping in-app,"* or *"Unlock app-exclusive early product drops"*), rather than generic *"Download our app"* copy?
- [ ] **Consistent Multi-Touchpoint Promotion:** Is the app promoted contextually across high-intent web pathways:
  - [ ] **Footer:** Clean App Store/Google Play badges.
  - [ ] **Checkout Success Page:** *"Track your order on the go with our App."*
  - [ ] **Order Confirmation Email:** Inclusion of QR codes and download links.
  - [ ] **Premium Gated Feature Prompts:** *"This feature is available on our free Mobile App."*

## 6. Analytics & Success Metric Implementation

- [ ] **Store Outbound Click Tracking:** Are all outbound clicks on app store badges and smart banners instrumented with custom analytics events (e.g., Google Analytics 4, Mixpanel)?
- [ ] **UTM Parameter Serialization:** Do all app store redirect URLs carry structured UTM parameters to attribute installs back to the specific referring web page or banner?
- [ ] **Install Attribution Close-the-Loop:** Is web visitor data correlated with new mobile app installs to accurately calculate Web-to-App Conversion Rate?
- [ ] **CPI & CAC Monitoring:** Is Web-to-App conversion tracked alongside paid ad campaigns to measure how on-site optimization reduces Cost Per Install (CPI) and Customer Acquisition Cost (CAC)?
