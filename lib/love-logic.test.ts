import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRelationshipDuration,
  getNextGalleryIndex,
  toggleNoteCardState,
  dampValue,
  getLetterTypographySpec,
} from './love-logic.ts';

test('calculateRelationshipDuration returns placeholder when date is empty', () => {
  const res = calculateRelationshipDuration('');
  assert.equal(res.isPlaceholder, true);
  assert.equal(res.totalDays, 0);
  assert.ok(res.formattedLabel.includes('Tanggal Spesial Kita'));
});

test('calculateRelationshipDuration computes exact years, months, and days for valid date', () => {
  const res = calculateRelationshipDuration('2025-10-15', '2026-10-20');
  assert.equal(res.isPlaceholder, false);
  assert.equal(res.years, 1);
  assert.equal(res.months, 0);
  assert.equal(res.days, 5);
  assert.equal(res.totalDays, 370);
});

test('getNextGalleryIndex wraps around circularly for next and prev', () => {
  assert.equal(getNextGalleryIndex(0, 6, 'prev'), 5);
  assert.equal(getNextGalleryIndex(5, 6, 'next'), 0);
  assert.equal(getNextGalleryIndex(2, 6, 'next'), 3);
  assert.equal(getNextGalleryIndex(2, 6, 'prev'), 1);
});

test('toggleNoteCardState adds and removes card IDs immutably', () => {
  const initial: string[] = [];
  const afterFirst = toggleNoteCardState(initial, 'note-1');
  assert.deepEqual(afterFirst, ['note-1']);
  assert.deepEqual(initial, []);

  const afterSecond = toggleNoteCardState(afterFirst, 'note-2');
  assert.deepEqual(afterSecond, ['note-1', 'note-2']);

  const afterUnflip = toggleNoteCardState(afterSecond, 'note-1');
  assert.deepEqual(afterUnflip, ['note-2']);
});

test('dampValue smoothly interpolates toward target with exponential decay', () => {
  const halfStep = dampValue(0, 10, 6, 0.1);
  assert.ok(halfStep > 0 && halfStep < 10);
  const converged = dampValue(0, 10, 10, 5);
  assert.ok(Math.abs(converged - 10) < 0.001);
});

test('getLetterTypographySpec returns distinct accessible font scales', () => {
  const normal = getLetterTypographySpec('normal');
  const large = getLetterTypographySpec('large');
  const xlarge = getLetterTypographySpec('xlarge');
  assert.equal(normal.label, 'Normal');
  assert.equal(large.label, 'Besar');
  assert.equal(xlarge.label, 'Sangat Besar');
  assert.notEqual(normal.bodyClass, large.bodyClass);
});
