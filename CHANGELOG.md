# Changelog

All notable changes to this project will be documented in this file.

## [1.7.3] - 2026-04-04

- `CHANGELOG.md`
- `package-lock.json`
- `package.json`
- `public/nit.json`
- `supabase_schema.sql`
- Tightened the user profile creation policy to require the role be set to 'user', preventing users from self-assigning elevated roles on insert

## [1.7.3] - 2026-04-04

- SETX Football Release v1.7.3

## [1.7.3] - 2026-04-04

- SETX Football Release v1.7.3

## [1.7.3] - 2026-04-04

- SETX Football Release v1.7.3

## [1.7.3] - 2026-04-04

- `CHANGELOG.md`, `package.json`, `package-lock.json`, `supabase_schema.sql`, `public/nit.json`
- Tightened the user profile creation policy to require the role be set to 'user', preventing users from self-assigning elevated roles on insert

## [1.7.3] - 2026-04-04

- SETX Football Release v1.7.3

## [1.7.2] - 2026-04-03

- SETX Football Release v1.7.2

## [1.7.1] - 2026-04-03

- SETX Football Release v1.7.1

## [1.7.1] - 2026-04-03

- SETX Football Release v1.7.1

## [1.7.1] - 2026-04-02

- Fixed missing `user_id` being passed to `updateCashAppUsername` in PaymentPage
- Reformatted JSX indentation in HomePage coach cards and StaffPanel stat cards for consistency
- Cleaned up trailing newline in LICENSE.md

## [1.7.1] - 2026-04-02

- SETX Football Release v1.7.1

## [1.7.1] - 2026-04-01

- SETX Football Release v1.7.1

## [1.7] - 2026-04-01

- SETX Football Release v1.7

## [1.6] - 2026-04-01

- Extracted registration row mapping into a standalone `buildRegistrationRow` helper, eliminating the inline object literal inside `createRegistration`
- Replaced all hardcoded `"camp_registrations"` string references with a `REGISTRATIONS_TABLE` constant throughout RegistrationService
- Replaced inline date arithmetic in `canEdit` and `getDaysRemaining` with the shared `getDaysSince` helper from utils
- Replaced `new Date().getFullYear()` calls with the shared `getCurrentYear` helper and extracted a reusable `fallback` variable in `getAllYears`
- Removed the `getShirtPrice()` method from RegistrationService; Dashboard now imports and uses `SHIRT_PRICE` directly from constants
- Switched payment status value in `buildRegistrationRow` from the hardcoded string `"pending"` to `PAYMENT_STATUSES.PENDING`
- Added `PAYMENT_STATUSES` and `getDaysSince`/`getCurrentYear` imports to RegistrationService to support the above changes
- Added `SHIRT_PRICE` to Dashboard's constants imports to replace the removed `RegistrationService.getShirtPrice()` call
- Reformatted README markdown tables to use aligned column padding for improved readability

## [1.5] - 2026-04-01

- Fixed trailing comma in supabaseClient error message to satisfy linter/formatter requirements
- Cleaned up package-lock.json with dependency tree changes

## [1.4] - 2026-03-15

- Added ScrollToTop component that automatically scrolls the page to the top whenever the user navigates to a new route
- Integrated ScrollToTop into the main App router so it applies across all pages

## [1.3] - 2026-03-15

- Suppress react-hooks/exhaustive-deps lint warnings in Dashboard and StaffPanel useEffect hooks
- Remove unused FaTrophy icon import from HomePage

## [1.2] - 2026-03-15

- Add Privacy Policy and Terms of Service pages with dedicated routes
- Move Supabase credentials to environment variables with .env fallbacks
- Add .env to .gitignore to prevent committing secrets
- Refactor AuthContext to destructure Supabase responses and properly propagate errors
- Refactor AuthService to return raw Supabase responses instead of unwrapping internally
- Update RegistrationService to return raw responses and add deleteRegistration support
- Add registration deletion functionality to the Dashboard with confirmation flow
- Redesign Dashboard navigation from dark gradient header to clean white navbar with slate styling
- Redesign AuthPage with softer slate color palette, fade-in animation, and icon-enhanced error/success alerts
- Overhaul StaffPanel with improved layout, search/filter capabilities, and expanded admin controls
- Rework HomePage layout and section styling
- Refine PaymentPage UI and structure
- Add fadeIn keyframe animation and .animate-fade-in utility class to global styles
- Add organized CSS section comments and color palette documentation
- Add JSDoc documentation across components, services, and utility modules
- Add a "release" npm script using nit
- Extend Tailwind config with new theme customizations
- Add helper utilities in helpers.js and new constants
- Remove unused App.css file

## [1.1] - 2026-03-15

- Apply consistent code formatting across the entire codebase using Prettier
- Standardize all JavaScript string literals to use double quotes instead of single quotes
- Add trailing commas to arrays, objects, and function parameters for cleaner diffs
- Reformat JSX to place long attribute lists and ternary expressions on separate lines
- Prettify HTML in index.html with proper multi-line attribute formatting
- Format site.webmanifest from single-line JSON to readable multi-line structure
- Clean up CSS with multi-line transition and animation shorthand properties
- Add missing semicolons to module.exports in postcss and tailwind config files
- Fix inconsistent indentation in StaffPanel table markup
- Remove trailing blank lines and unnecessary whitespace across all source files
