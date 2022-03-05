import { render, screen } from '@testing-library/react';
import rates from './rates.json';
import { convertToEURO } from './utils';


test('Convert currency from USD should work', () => {
  const cur = 'USD';
  const ratio = rates[cur].EUR.amount / Math.pow(10,rates[cur].EUR.scale);
  const amount = 101;
  const amountInCent = amount * 100; 
  expect( parseInt(amount * ratio) ).toBe(convertToEURO(amountInCent, cur));
});

test('Convert currency from GBP should work', () => {
  const cur = 'USD';
  const ratio = rates[cur].EUR.amount / Math.pow(10,rates[cur].EUR.scale);
  const amount = 204;
  const amountInCent = amount * 100; 
  expect( parseInt(amount * ratio) ).toBe(convertToEURO(amountInCent, cur));
});

test('Convert currency from CHF should work', () => {
  const cur = 'CHF';
  const ratio = rates[cur].EUR.amount / Math.pow(10,rates[cur].EUR.scale);
  const amount = 603;
  const amountInCent = amount * 100; 
  expect( parseInt(amount * ratio) ).toBe(convertToEURO(amountInCent, cur));
});


