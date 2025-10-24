// lib/utils/password-validation.ts

export function validatePassword(password: string): string[] {
    const errors: string[] = [];

    // Length check
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters.');
    }

    if (password.length > 36) {
        errors.push('Password must be less than 128 characters.');
    }

    // Character requirements
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter.');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter.');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number.');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character.');
    }

    // Check against common passwords (optional but good)
    const commonPasswords = ['Password123!','Password1!','P@ssword1!','P@ssword123!'];
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common. Please choose a more unique password.');
    }

    return errors;
}