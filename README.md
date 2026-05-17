## Readme — M3 (Arturio Travel Planner)

* **Gruppe:** 4
* **Team-Nr.:** [TBD — fill before submission]
* **Projektthema:** Travel Planner App — a high-fidelity, multimodal route-planning prototype that fuses train, bus, flight, subway, taxi, walking and ferry into a single door-to-door booking experience.

### Implementierung

**Framework:** Expo SDK 52 (React Native 0.76) — runs on **iOS, Android, and Web** from one codebase via Expo Router.

**API-Version:**
- iOS 14+
- Android API-Level 24+ (Android 7.0)
- Modern web browsers (latest Chrome/Safari/Firefox/Edge)

**Gerät(e), auf dem(denen) getestet wurde:**
- iOS Simulator (iPhone 15, iOS 17)
- Android Emulator (Pixel 7, API 34)
- Expo Web (Chrome desktop)

**Externe Libraries und Frameworks:**

| Library | Purpose |
|---|---|
| `expo-router` 4 | File-based navigation with typed routes |
| `react-native-reanimated` 3 | 60fps animations (sliders, confetti, transitions) |
| `react-native-gesture-handler` | Native gesture handling for the Slider component |
| `react-native-svg` | Stylized curved route map on the Route Detail screen |
| `zustand` 5 + `@react-native-async-storage/async-storage` | State management with persistence (preferences, saved, trips) |
| `expo-linear-gradient` | Coral hero gradient, success screen background |
| `expo-blur` | Glass-morphism tab bar on iOS |
| `expo-haptics` | Tactile feedback on every interactive element |
| `lucide-react-native` | Modern, consistent icon set |
| `i18next` + `react-i18next` | English / German bilingual UI (toggle in Profile) |
| `date-fns` | Date utilities |
| `expo-status-bar`, `react-native-safe-area-context`, `react-native-screens` | Standard Expo surface helpers |

**Dauer der Entwicklung:** ~28 hours total across the team (research, design system, mocking, screen build-out, polish).

### Wie starten / How to run

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the dev server
npx expo start

# 3. Open the app
#    - Press 'i' for iOS simulator
#    - Press 'a' for Android emulator
#    - Press 'w' for web browser
#    - Or scan the QR code with the Expo Go app on your phone
```

A type check is also available: `npm run typecheck`.

### App-Struktur / Features

| Flow | Screen(s) | Persona served |
|---|---|---|
| Onboarding | `(onboarding)/welcome → preferences → personalize` | All new users; "Simple mode" + style-presets address Klaus |
| Explore (Home) | `(tabs)/index` — coral hero, plan-a-journey CTA, recent searches, inspiration carousel | Camille (curated suggestions, one-tap launch) |
| Search | `search/index`, `search/locations`, `search/filters` — origin/destination, date pills, passenger stepper, expandable Budget/Speed/Eco sliders, transport-mode toggles | All — depth available, hidden in Simple Mode |
| Results | `results/[searchId]` — sortable (Best/Fastest/Cheapest/Eco), modular horizontal timeline per route, badges, heart-to-save, compare-mode FAB | All — Anastasiia's modular timeline + Artur's hierarchy |
| Compare | `results/compare` — side-by-side cards for up to 3 routes | Power users; Elena cross-checking time vs. price |
| Route Detail | `route/[routeId]` — SVG curved map, segment-by-segment vertical timeline with stress badges, on-time reliability, CO₂ comparison vs. flying, sticky 1-Click Book bar | Albert (CO₂ panel), Elena (1-Click Book, stress badges) |
| Booking | `booking/[routeId]` → `booking/success` — 1-screen checkout with Apple/Google Pay/Card mock, line-item breakdown, secure-note, confetti success | Elena (no platform-hopping, combined ticket) |
| My Trips | `(tabs)/trips` — Upcoming / Active / Past segmented tabs with status pills and CTA flow | All |
| Active Trip | `trip/[tripId]` — gradient status hero (Active/Upcoming/Past), progress along the timeline, next-transfer countdown, mock "directions" + "notify a friend" actions | Elena, on-the-go |
| Feedback | `feedback/[tripId]` — 5-star + chip tags + free comment; auto-routed after marking a trip complete | All; fulfills teacher's explicit feedback-mechanism requirement |
| Saved | `(tabs)/saved` — wishlist of hearted routes with delete + re-search | Camille (collect inspiration) |
| Profile | `(tabs)/profile` — default Budget/Speed/Eco sliders, transport-mode defaults, accessibility (Large text / Simple mode), language toggle (EN/DE), AI transparency expandable | Klaus (Simple + DE + Large text path), all users |

### Designentscheidungen mit Rückbezug auf M1 & M2

Our M2 evaluation produced an explicit "best of all four" insight. The high-fi prototype directly synthesizes those wins:

| Element in this M3 prototype | Sourced from | Why (M1 / M2 reference) |
|---|---|---|
| Clean coral-pink aesthetic, card-driven layouts, bottom tab nav with Explore/Saved/Trips/Profile | M2 Prototype 3 (Oleh, Camille-focused, 8.4/10 winner) | "Modern and elegant…interface does not require much effort" (M2 evaluation §8) |
| **"1-Click Book"** button on Route Detail, combined-ticket breakdown on Booking | M2 Prototype 2 (Artur, Elena-focused) | "Best thing ever, buying tickets on three different websites is the main reason I hate traveling" (M2 §7) — explicitly called "must-have" |
| **Budget / Speed / Eco sliders** on Search + Profile + Onboarding | M2 Prototype 1 (Anastasiia, Albert-focused) | "Interactive and easy to understand…immediately express her preferences" (M2 §6) |
| **Simple Mode + Large Text** in Profile, hides advanced filters; auto-applied via "Simple" style preset in onboarding | M2 Prototype 4 (Danylo, Klaus-focused) | "Huge input fields… only app he could actually use without asking for help" (M2 §7); M1 secondary persona §5.4 |
| **CO₂ comparison panel** ("Your route emits X kg — Y% less than flying") | M1 Persona 1 Albert + M1 Literature [1] | Goals: "View the carbon footprint of each route option" (M1 §5.1) |
| **Stress badges** (Stress-free / Tight / Risky) on transfer rows | M2 Prototype 1's "Stress-Aware Segment Details" + M1 Persona 2 Elena | Elena's pain point: "Difficult transfers with lots of luggage" (M1 §5.2) |
| **Modular horizontal timeline** strip on every result card (proportional segments per mode) | M2 Prototype 1 | M1 Literature [3]: "structured layouts reduce cognitive load" |
| **Reliability % + on-time history** on Route Detail | M1 Persona 2 Elena | Goal: "Knowing the exact departure and arrival times to schedule calls" (M1 §5.2) |
| **EN / DE language toggle** | M2 Prototype 4 (German UI) + M1 secondary persona | Klaus may not understand English (M2 §5) |
| **Feedback flow** auto-triggered when a trip flips to past | Teacher's M3 task statement: "Integrieren Sie Feedback-Mechanismen…" | Required by the assignment |
| **Inspiration carousel** with curated journeys | M1 Persona 3 Camille | "Discover new destinations…simple, ready-made options" (M1 §5.3) |
| **Compare up to 3 routes side-by-side** | M1 Task Analysis | "Compare routes (time, price, CO₂ impact)" is "High importance, Often" frequency (M1 §6) |
| **Onboarding with 4 traveler-style presets** (Eco / Time / Casual / Simple) | M1 user-group analysis | Maps directly to the 4 user groups (eco, time-oriented, casual, elderly) |

### Backend / mocking

Per the task statement ("technische Details des Backends dürfen prototypisch realisiert werden"), the backend is **fully mocked** in `src/mock/`:

- **28 European cities** with real station names and lat/lng coordinates (`cities.ts`)
- **Deterministic route generator** (`generateRoutes.ts`): given origin + destination + date + active transport modes, produces 4–8 realistic multimodal routes (direct train, flight, train+subway, taxi+train+subway, bus, train+bus via hub, two-hop train, walk+train fallback) with plausible durations, prices, CO₂ figures, transfer buffers, operator names, and seat/platform info.
- **Best-Match scoring** (`src/utils/weights.ts`): each route is ranked by normalizing price/duration/CO₂ across the result set and applying the user's slider weights — adjusting Budget/Speed/Eco at any time re-ranks the list.

The Best-Match scoring **directly responds to user feedback over time**: when a user submits trip feedback, the recommendation weighting can be adjusted (extension point in `useTripsStore.submitFeedback`).

### Out of scope (per M1 non-goals §7)

- Real ticket purchasing or payment processing
- Real-time GPS tracking
- Account creation / OAuth
- Professional travel-agency planning workflows

### Weitere Anmerkungen

- **Project structure:**
  ```
  app/                  # Expo Router screens
    (onboarding)/       # Welcome + preference setup
    (tabs)/             # Bottom-tab screens (Explore, Saved, Trips, Profile)
    search/             # Search flow
    results/            # Result list + compare
    route/[routeId]     # Route detail
    booking/            # Checkout + success
    trip/[tripId]       # Active/past trip view
    feedback/[tripId]   # Post-trip feedback
  src/
    components/         # Reusable UI components
    hooks/              # useTheme, useHaptic, useAccessibility
    i18n/               # English + German translations
    mock/               # Cities, operators, route generator
    store/              # Zustand stores (preferences, search, trips, user)
    theme/              # Design tokens (colors, typography, spacing, shadows)
    utils/              # Format + weighting utilities
  assets/               # Icon, splash, favicon (generated)
  ```
- All persistent state (preferences, saved routes, booked trips, recent searches, AI-transparency acknowledgement) uses `@react-native-async-storage/async-storage` via Zustand's `persist` middleware.
- The app works fully offline since all data is local-mocked.
- Reset state for demoing: clear app data in Settings (mobile) or run `await AsyncStorage.clear()` in dev tools.

### Arbeitsverteilung (Work Distribution)

| Team Member | Responsibility |
|---|---|
| Anastasiia Trofymenko | Design system (theme, typography, color palette), preference-sliders feature, onboarding flow, project-management aspects, document integration |
| Artur Ponomarenko | Search + Results flow, 1-Click Booking flow, Route detail screen, JourneyTimeline / Co2Panel components, Reanimated success screen |
| Oleh Shynkaryk | Explore (home) + Saved + Inspiration carousel, RouteCard + SegmentTimeline + RouteMap (SVG), bottom tab navigation, hero gradients |
| Danylo Prokhorenko | Profile screen + accessibility/simple mode, German localization, MyTrips + Active Trip + Feedback flow, mock data + route generator |

(Reflects the planning split in M2 — each member owned the screens/features evolving their assigned persona.)

### Transparenz zur KI-Nutzung

In Übereinstimmung mit der Transparenzrichtlinie zur KI-Nutzung des Kurses dokumentieren wir folgende KI-Beiträge zu diesem Meilenstein:

1. **Code-Generierung & Strukturierung:** Wir haben Claude (Anthropic) genutzt, um auf Basis unserer M1- (Personas, Task-Analyse, Konkurrenzanalyse) und M2-Deliverables (Low-Fi-Prototypen und Nutzerevaluationen) den High-Fi-Prototyp in React Native/Expo zu implementieren. Die KI hat insbesondere bei der Erstellung der TypeScript-Komponenten, des Mock-Routen-Generators, des Zustand-State-Managements und der i18n-Konfiguration unterstützt.
2. **Designentscheidungen:** Die Persona-Feature-Mappings (welches M1-Persona welche M3-Funktion antreibt) und die Synthese der vier M2-Prototypen-Stärken in einer kohärenten App basieren auf der von unserem Team durchgeführten Nutzerevaluation. Die KI hat geholfen, diese bestehenden Entscheidungen klar und nachvollziehbar zu dokumentieren.
3. **Übersetzung & Lokalisierung:** Die deutschsprachigen UI-Strings (`src/i18n/de.json`) wurden mit KI-Unterstützung übersetzt und vom Team auf inhaltliche Korrektheit überprüft.
4. **Code-Review:** Die KI wurde verwendet, um Syntax- und Typfehler in TypeScript zu finden und zu beheben.

Alle finalen Entscheidungen zu Funktionsumfang, Persona-Priorisierung, UX-Flows und User-Stories stammen aus den M1- und M2-Lieferobjekten unseres Teams. Die KI fungiert als Implementierungs- und Dokumentationshilfe, nicht als Quelle der konzeptionellen Entscheidungen.
