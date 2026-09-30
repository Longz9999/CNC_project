import assert from "node:assert/strict";

import {
  SHIPPING_FEE,
  SHIPPING_FREE_FROM,
  VAT_RATE,
  calculateOrderTotals,
} from "./catalog.js";

const test = (name, fn) => {
  fn();
  console.log(`ok - ${name}`);
};

test("calculates inner-city shipping and VAT from the merchandise subtotal", () => {
  const result = calculateOrderTotals(1000000, {
    vat: true,
    shippingZone: "inner-city",
  });

  assert.equal(result.shipping, SHIPPING_FEE);
  assert.equal(result.vat, Math.round(1000000 * VAT_RATE));
  assert.equal(result.total, 1000000 + SHIPPING_FEE + Math.round(1000000 * VAT_RATE));
  assert.equal(result.shippingLabel, "35.000₫");
});

test("waives inner-city shipping at the free-shipping threshold", () => {
  const result = calculateOrderTotals(SHIPPING_FREE_FROM, {
    shippingZone: "inner-city",
  });

  assert.equal(result.shipping, 0);
  assert.equal(result.shippingLabel, "Miễn phí");
  assert.equal(result.total, SHIPPING_FREE_FROM);
});

test("leaves non-inner-city shipping for confirmation", () => {
  const result = calculateOrderTotals(500000, {
    shippingZone: "other-province",
  });

  assert.equal(result.shipping, 0);
  assert.equal(result.shippingLabel, "Báo phí sau");
  assert.equal(result.total, 500000);
});

console.log("catalog totals smoke tests passed");
