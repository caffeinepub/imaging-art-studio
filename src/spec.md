# Specification

## Summary
**Goal:** Improve the authenticated “Booking Inquiries” admin UX to make it faster to find, filter, and update the inquiries list.

**Planned changes:**
- Add a free-text search input to filter displayed inquiry cards client-side (case-insensitive) across customer name, phone number, email, and message.
- Add a service-type filter control; when a specific service type is selected, fetch and display inquiries for that service type via a dedicated React Query hook.
- Add a manual “Refresh” control to re-fetch inquiries on demand without a full page reload.
- Ensure search + service-type filtering work together as an intersection when both are active, and all new UI text is in English.

**User-visible outcome:** In the Bookings/Booking Inquiries admin section, authenticated users can search inquiries in real time, filter by service type (with targeted fetching), and refresh the list to see newly submitted inquiries without reloading the page.
