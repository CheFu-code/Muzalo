export function friendlyAuthError(error: unknown) {
  if (error instanceof Error && error.message) {
    const code = 'code' in error ? String(error.code) : '';

    if (code === 'auth/invalid-email') return 'Enter a valid email address.';
    if (code === 'auth/invalid-credential') {
      return 'That email or password does not look right.';
    }
    if (code === 'auth/popup-closed-by-user') return 'Sign-in was cancelled.';
    if (code === 'auth/popup-blocked') {
      return 'Allow popups for this site and try Google sign-in again.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many attempts. Wait a bit and try again.';
    }
    if (code === 'auth/multi-factor-auth-required') {
      return 'This account requires multi-factor sign-in.';
    }

    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
