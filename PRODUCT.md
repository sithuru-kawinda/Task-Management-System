# Product

## Register

product

## Users

People who need to track their own daily work: a single authenticated user per login, managing a personal list of tasks (title, priority, status, due date). They arrive at the login screen once per session, want to get in fast, and then spend their time in the task dashboard, not on the login page itself.

## Product Purpose

A task management system: authenticate, then create/view/update/delete tasks with search, filtering, sorting, and a dashboard summarizing task counts by status. Built as a technical assessment submission, so craft and polish are part of what's being evaluated, not just function.

## Brand Personality

Friendly, competent, a little bit warm — approachable productivity software, not enterprise-cold and not playful-startup. Confident without being loud. The login screen should feel like the front door to a tool people actually enjoy using daily.

Reference: the provided mockup (diagonal teal/green split, illustration-led left panel, clean white card on the right, pill-shaped primary button). Follow its structure and energy closely; the specific illustration artwork is redrawn in an original style rather than copied.

## Anti-references

- Generic templated SaaS auth page: centered white card on a plain gray background, default shadow, no personality, could belong to any product.
- Corporate/cold enterprise auth (navy, dense forms, no warmth).

## Design Principles

- The login screen is a five-second interaction — clarity and speed beat decoration. Illustration and color set tone but never slow down finding the email/password fields and submitting.
- Only implement what's real. No decorative links or buttons that imply functionality the app doesn't have (no working "forgot password," no OAuth providers, no registration link — none of these exist in this app).
- One confident accent color carries the identity; everything else stays quiet so the form itself reads clearly.
- Consistent with the rest of the app: the dashboard/task UI that follows login should feel like the same product, not a different skin.

## Accessibility & Inclusion

Standard WCAG AA baseline: sufficient color contrast (especially white text on the accent color), visible keyboard focus states, properly labeled form fields, and no motion that can't be reduced (respect `prefers-reduced-motion`). No additional stated requirements.
