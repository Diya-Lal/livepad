import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.schema.js';

describe('registerSchema', () => {
  it('accepts valid input', () => {
    const result = registerSchema.safeParse({ name: 'Alice', email: 'alice@example.com', password: '12345678' });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ name: 'A', email: 'alice@example.com', password: '12345678' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ name: 'Alice', email: 'not-an-email', password: '12345678' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ name: 'Alice', email: 'alice@example.com', password: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'alice@example.com', password: 'anypassword' });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'alice@example.com', password: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'password' });
    expect(result.success).toBe(false);
  });
});
