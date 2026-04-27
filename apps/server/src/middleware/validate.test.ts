import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { validate } from './validate.js';

const schema = z.object({ name: z.string() });

function makeReq(body: unknown) {
  return { body } as Request;
}

function makeRes() {
  const res = { json: vi.fn() } as unknown as Response;
  (res as unknown as Record<string, unknown>).status = vi.fn().mockReturnValue(res);
  return res;
}

describe('validate middleware', () => {
  it('calls next() and sets req.body when input is valid', () => {
    const req = makeReq({ name: 'Alice' });
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.body).toEqual({ name: 'Alice' });
  });

  it('returns 400 and does not call next() when input is invalid', () => {
    const req = makeReq({ name: 123 });
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    validate(schema)(req, res, next);

    expect((res as unknown as Record<string, ReturnType<typeof vi.fn>>).status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Validation error' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when required field is missing', () => {
    const req = makeReq({});
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    validate(schema)(req, res, next);

    expect((res as unknown as Record<string, ReturnType<typeof vi.fn>>).status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
