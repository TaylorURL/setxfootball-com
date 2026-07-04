<p align="center"><img src="src/assets/logo.PNG" alt="SETX Football" width="140" /></p>

<h1 align="center">SETX Football</h1>

<p align="center"><strong>A registration and management platform for Southeast Texas Football — built for parents, run by staff.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/v1.7.20-release-1e3a5f" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" />
</p>

---

SETX Football is the registration and administrative backbone of Southeast Texas Football, an annual youth football camp. Parents visit the platform to enroll their children, configure shirt orders, submit payment through CashApp, and track the status of their registration from submission through confirmation. On the other side of the same application, staff access a protected admin panel that centralizes every registration record, payment verification workflow, and reporting export — no external tooling required.

The platform handles the full registration lifecycle: a parent creates an account, fills out a registration form with per-child details and shirt selections, follows the CashApp payment instructions, and returns to their dashboard to monitor status. Staff verify payments, toggle statuses, search and filter the full registration list, collapse related submissions into grouped orders, and export data as CSV — all through a purpose-built staff interface that operates on the same database with role-enforced access control.

---

## Registration Flow

The registration form is the core of the parent experience. Parents enter their child's information alongside a flexible shirt ordering system that supports multiple line items per submission — each with a size selection spanning Youth XS through Adult 2XL, a recipient name, and a designation for whether the shirt is for the camper or a family member. The real-time cost calculator updates as items are added or removed, applying a flat $5-per-shirt rate so parents always see their total before submitting.

The form also captures emergency contact information with predefined relationship options, ensuring staff have the structured data they need on camp day without free-text parsing.

## Payment Verification

After a registration is submitted, the platform presents CashApp payment instructions — displaying the camp's handle ($SETXYFC) alongside a one-click clipboard copy action. Parents enter their CashApp username as part of the process, giving staff the identifier needed to cross-reference incoming payments against submitted registrations without relying on memo fields or parent-initiated confirmation steps.

Staff verify payment with a single toggle in the admin panel, flipping the registration status from pending to paid. That status is immediately reflected in the parent's dashboard, closing the loop without any email or external communication required.

## User Dashboard

Authenticated parents land on a dashboard that loads all registrations associated with their email address. Each registration displays its current payment status and, within a three-day edit window from the time of submission, an inline edit form that allows corrections to any field. The edit window is enforced both at the UI layer — where the form displays a "days remaining" countdown — and at the service layer, where update operations scope their queries by both record ID and user ID to prevent cross-user edits. After the window closes, the registration becomes read-only.

## Staff Panel

The staff panel is the operational center for camp administrators. It presents a full table of registrations filterable by camp year, searchable across all fields with full-text matching, and filterable by payment status. Payment toggles are applied inline without leaving the table view.

The panel's order grouping feature is one of its most practical capabilities: registrations from the same parent across multiple submissions are collapsed into expandable grouped rows using fuzzy name matching on child names combined with email identity, making it straightforward to see total shirt counts and outstanding balances for a single family at a glance.

A summary statistics row at the top of the panel surfaces five key metrics in real time: total registrations, total shirts ordered, total expected revenue, confirmed revenue from paid registrations, and outstanding balance from unpaid ones. The CSV export button produces a flat file of all visible registrations, respecting the active year and search filters, suitable for printing, sharing with coaches, or importing into external tools.

## Authentication & Access Control

SETX Football uses Supabase Auth with an email verification requirement — new accounts are not active until the verification link is followed. An `AuthContext` provider makes the current user, their profile, loading state, and role flags (`isStaff`, `isAdmin`) available throughout the component tree without prop-drilling. The staff panel route and all staff-level service operations enforce role checks both at the UI routing layer and within the service queries themselves.

## Service Architecture

All Supabase interactions are encapsulated in two service modules — `AuthService` and `RegistrationService` — which export functions returning consistent `{ data, error }` tuples. No component imports the Supabase client directly. This keeps the component tree free of data-access logic and makes the database contract easy to locate, audit, and adjust in one place. IDOR protection is built into every mutation: update and delete operations always include both the record's primary key and the authenticated user's ID as query constraints, preventing one user from modifying another's records even with a known ID.

## Visual Experience

The public-facing home page is structured as a long-form landing page covering the hero section, coaching staff bios, a photo gallery, sponsor logos, and the registration form — all in a single scrollable layout. Sections animate into view using scroll-triggered IntersectionObserver entries rather than a third-party animation library, keeping the bundle lean. The navbar sticks to the top of the viewport and applies a backdrop-blur on scroll, maintaining readability over the page content beneath it.

---

## Architecture

| Layer          | Technology                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| UI Framework   | React 19 with React Router 7                                               |
| Styling        | Tailwind CSS 3.4                                                           |
| Auth           | Supabase Auth with email verification                                      |
| Database       | Supabase PostgreSQL — `camp_registrations`, `user_profiles`                |
| Service Layer  | AuthService, RegistrationService — consistent `{ data, error }` tuples     |
| Access Control | Row-level security + role flags (user / staff / admin)                     |
| Constants      | Shirt sizes, pricing, CashApp handle, edit window, relationships, statuses |

**Data flow:**

```
Parent / Staff action
  → Page component
    → AuthService or RegistrationService
      → Supabase Client
        → PostgreSQL (RLS-enforced)
          → { data, error } returned to component
            → UI state updated (dashboard, staff panel, payment status)
```

---

## Project Stats

| Metric                         | Value                                |
| ------------------------------ | ------------------------------------ |
| Routes                         | 7                                    |
| Database Tables                | 2                                    |
| Shirt Sizes                    | 13 (Youth XS → Adult 2XL)            |
| User Roles                     | 3 (user, staff, admin)               |
| Edit Window                    | 3 days                               |
| Summary Metrics in Staff Panel | 5                                    |
| Service Modules                | 2 (AuthService, RegistrationService) |
| Payment Statuses               | 2 (pending, paid)                    |

---

<p align="center"><sub>Built by <strong>Trenton Taylor</strong></sub></p>
