import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { verifyAdminPin } from '../lib/auth.ts';

describe('Admin Authentication', () => {
  test('verifyAdminPin menyetujui PIN yang benar (default: 123456)', async () => {
    const isValid = await verifyAdminPin('123456');
    assert.equal(isValid, true);
  });

  test('verifyAdminPin menolak PIN yang salah', async () => {
    const isWrong = await verifyAdminPin('999999');
    assert.equal(isWrong, false);
  });

  test('verifyAdminPin menangani input dengan whitespace', async () => {
    const isValid = await verifyAdminPin('  123456  ');
    assert.equal(isValid, true);
  });
});
