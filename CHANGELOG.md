# Changelog

All notable changes to this project will be documented in this file.

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
