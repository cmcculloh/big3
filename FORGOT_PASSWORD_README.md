# Forgot Password Feature

This application now includes a complete "forgot password" feature that allows users to reset their passwords securely.

## Features

- **Password Reset Request**: Users can request a password reset by entering their username
- **Secure Token Generation**: Cryptographically secure reset tokens are generated
- **Token Expiration**: Reset tokens expire after 24 hours for security
- **Password Confirmation**: Users must confirm their new password to prevent typos
- **Security Best Practices**:
  - No username enumeration (always shows success message)
  - Secure token generation using crypto.getRandomValues
  - Tokens are cleared after use
  - Password validation and hashing

## Implementation Details

### Database Changes
- Added `resetToken` and `resetTokenExpires` fields to the user table
- Reset tokens are stored as text and expire after 24 hours

### New Routes
- `/forgot-password` - Password reset request page
- `/reset-password?token=<token>` - Password reset confirmation page

### Security Features
- Reset tokens are 20 bytes of random data (encoded as base32)
- Tokens expire after 24 hours
- Tokens are cleared after successful password reset
- No indication of whether a username exists or not

## Usage Flow

1. User clicks "Forgot your password?" on login page
2. User enters their username on the forgot password page
3. System generates a secure reset token and stores it in the database
4. User receives a reset link (currently logged to console for development)
5. User clicks the reset link and enters a new password
6. System validates the token, hashes the new password, and clears the token
7. User can now log in with their new password

## Development Notes

- **Email Integration**: Currently, reset tokens are logged to the console. In production, you would integrate with an email service (SendGrid, AWS SES, etc.)
- **Database Migration**: Run `npm run db:push` to apply the database schema changes
- **Testing**: Test the flow by requesting a reset, checking console logs for the token, and using the reset link

## Future Enhancements

- Email integration for sending reset links
- Rate limiting for reset requests
- Audit logging for password changes
- Password strength requirements
- Account lockout after multiple failed attempts

## Files Modified/Created

- `src/lib/server/db/schema.js` - Added reset token fields
- `src/routes/forgot-password/+page.svelte` - Password reset request page
- `src/routes/forgot-password/+page.server.js` - Server logic for reset requests
- `src/routes/reset-password/+page.svelte` - Password reset confirmation page
- `src/routes/reset-password/+page.server.js` - Server logic for password reset
- `src/routes/login/+page.svelte` - Added forgot password link
- `drizzle/0000_green_psynapse.sql` - Database migration file
