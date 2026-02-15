# Specification

## Summary
**Goal:** Add customer feedback collection and behavior event tracking, with admin-only review/analytics views, and ensure inquiries/contacts are easily accessible for authenticated users.

**Planned changes:**
- Backend: add public feedback submission API (supports anonymous) and admin-only feedback retrieval APIs with pagination/limits.
- Frontend: add a feedback form (rating + optional text) with success/error states, connected to the feedback submission API.
- Frontend: add an authenticated, admin-only feedback review view with list display (timestamp, rating, text), search/filter, refresh, and loading/empty/error states.
- Backend: add public behavior event recording APIs for section/page views and key click events, plus admin-only analytics retrieval APIs (recent events + simple aggregates).
- Frontend: instrument navigation/CTAs and key interactions to asynchronously record view/click events without disrupting UX.
- Frontend: add an authenticated, admin-only behavior analytics view showing recent events and “top” aggregates with refresh and loading/empty/error states.
- Frontend: verify inquiries/contact submissions review is accessible in an authenticated view and add an explicit navigation entry point if not already discoverable.

**User-visible outcome:** Visitors can submit feedback and the site records basic behavior events in the background; admins can review feedback, view simple behavior analytics, and access inquiries via a clear authenticated navigation entry.
