const { calculateSubtotal, calculateTotal, calculateChange } = require('../src/utils/paymentCalculator');

describe('calculateSubtotal', () => {
  test('menjumlahkan subtotal dari beberapa item dengan benar', () => {
    const items = [
      { unit_price: 15000, quantity: 2 }, // 30000
      { unit_price: 10000, quantity: 1 }, // 10000
    ];
    expect(calculateSubtotal(items)).toBe(40000);
  });

  test('mengembalikan 0 untuk order tanpa item', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  test('menangani unit_price bertipe string (dari database numeric)', () => {
    const items = [{ unit_price: '25000', quantity: 3 }];
    expect(calculateSubtotal(items)).toBe(75000);
  });
});

describe('calculateTotal', () => {
  test('tanpa pajak/service charge, total sama dengan subtotal (default Fase 1)', () => {
    expect(calculateTotal(50000)).toBe(50000);
  });

  test('menghitung dengan taxRate jika diberikan (siap untuk fase mendatang)', () => {
    expect(calculateTotal(100000, { taxRate: 0.1 })).toBe(110000);
  });

  test('menghitung dengan taxRate dan serviceChargeRate sekaligus', () => {
    expect(calculateTotal(100000, { taxRate: 0.1, serviceChargeRate: 0.05 })).toBe(115000);
  });
});

describe('calculateChange', () => {
  test('menghitung kembalian dengan benar saat bayar lebih', () => {
    expect(calculateChange(50000, 35000)).toBe(15000);
  });

  test('kembalian 0 saat bayar pas', () => {
    expect(calculateChange(20000, 20000)).toBe(0);
  });

  test('melempar error saat bayar kurang dari total', () => {
    expect(() => calculateChange(10000, 15000)).toThrow(
      'Jumlah pembayaran kurang dari total tagihan'
    );
  });
});

describe('Skenario integrasi kalkulasi pembayaran (subtotal -> total -> kembalian)', () => {
  test('alur lengkap: 2 item, tanpa pajak, bayar dengan uang pas Rp100.000', () => {
    const items = [
      { unit_price: 25000, quantity: 2 }, // 50000
      { unit_price: 30000, quantity: 1 }, // 30000
    ];
    const subtotal = calculateSubtotal(items); // 80000
    const total = calculateTotal(subtotal); // 80000 (tanpa pajak di Fase 1)
    const change = calculateChange(100000, total);

    expect(subtotal).toBe(80000);
    expect(total).toBe(80000);
    expect(change).toBe(20000);
  });
});
