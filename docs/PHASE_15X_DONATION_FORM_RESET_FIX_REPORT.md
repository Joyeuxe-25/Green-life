# Phase 15X Donation Form Reset Fix Report

## Root cause

The Donate page renders `DonationForm` from `apps/public-site/components/donation-form.tsx`. Its submit handler built `FormData` from `event.currentTarget`, awaited `submitDonationMessage(...)`, and then called `event.currentTarget.reset()` after the async operation completed.

React submit events do not provide a reliable `currentTarget` after the handler has crossed an async boundary. By the time the donation request resolved, `event.currentTarget` was `null`, so the successful submit path attempted to call `reset()` on `null` and threw:

```text
Cannot read properties of null (reading 'reset')
```

The donation message had already been submitted successfully; the exception happened during the post-submit UI cleanup step.

## Files modified

- `apps/public-site/components/donation-form.tsx`
- `apps/public-site/components/contact-form.tsx`
- `docs/PHASE_15X_DONATION_FORM_RESET_FIX_REPORT.md`

## Fix implemented

The donation form now captures the form element synchronously before any `await`:

```ts
const form = event.currentTarget;
const formData = new FormData(form);
```

After `submitDonationMessage(...)` resolves, the code calls `form.reset()` on that saved `HTMLFormElement` instead of reading `event.currentTarget` again.

During the required reset sweep, the same unsafe pattern was found in the public contact form. It was fixed the same way so both public client forms avoid the async event-target null issue.

## Testing performed

- Searched public/admin TypeScript files for reset calls. Remaining reset calls are only `form.reset()` calls on a synchronously captured form element.
- Ran `pnpm --filter public-site typecheck` successfully.
- Ran `pnpm --filter public-site build` successfully. The Donate route compiled and generated without errors.
- Ran `pnpm --filter public-site lint`; this did not execute ESLint because the configured script is `next lint`, but the installed Next.js 16 CLI no longer includes a `lint` command and the project does not have `eslint` installed directly. This is a pre-existing tooling configuration issue, not a code error from this fix.
- Confirmed `pnpm --filter public-site exec eslint --version` reports `Command "eslint" not found`.
- Confirmed `pnpm --filter public-site exec next --help` lists no `lint` command.

## Final verification

With the fix, the successful donation submit flow no longer reads from the React event after `await`. The saved form element remains available for `form.reset()`, so the success path can complete without the `Cannot read properties of null (reading 'reset')` runtime exception.

Expected behavior after a successful donation inquiry:

- The donation request submits to `/public/donation-messages`.
- The form resets after the API call succeeds.
- The success message still appears.
- The submit button returns from `Sending...` to `Send inquiry` because `status` is set to `success`.
- Required-field and email validation remain browser-native and unchanged.
- Failed API submissions still set the error state and leave entered form data intact.