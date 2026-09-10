// Fungsi murni untuk kalkulasi pembayaran — diekstrak dari transactionController.js
// supaya dapat diuji secara terisolasi tanpa perlu database (lihat tests/paymentCalculator.test.js).

function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);
}

function calculateTotal(subtotal, { taxRate = 0, serviceChargeRate = 0 } = {}) {
  // taxRate & serviceChargeRate belum diterapkan di Fase 1 (lihat Open Questions PRD),
  // parameter disiapkan agar mudah diaktifkan nanti tanpa mengubah signature fungsi.
  const tax = subtotal * taxRate;
  const serviceCharge = subtotal * serviceChargeRate;
  return subtotal + tax + serviceCharge;
}

function calculateChange(amountPaid, total) {
  if (amountPaid < total) {
    throw new Error('Jumlah pembayaran kurang dari total tagihan');
  }
  return amountPaid - total;
}

module.exports = { calculateSubtotal, calculateTotal, calculateChange };
