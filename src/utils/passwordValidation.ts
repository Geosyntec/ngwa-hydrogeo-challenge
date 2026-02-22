/**
 * Password rules: longer than 8 characters, at least one capital letter,
 * one number, and one special character.
 */
const MIN_LENGTH = 9
const HAS_UPPER = /[A-Z]/
const HAS_NUMBER = /\d/
const HAS_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

export type PasswordValidationResult = {
  valid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  if (password.length < MIN_LENGTH) {
    errors.push('Password must be longer than 8 characters.')
  }
  if (!HAS_UPPER.test(password)) {
    errors.push('Password must contain at least one capital letter.')
  }
  if (!HAS_NUMBER.test(password)) {
    errors.push('Password must contain at least one number.')
  }
  if (!HAS_SPECIAL.test(password)) {
    errors.push('Password must contain at least one special character.')
  }
  return {
    valid: errors.length === 0,
    errors,
  }
}
