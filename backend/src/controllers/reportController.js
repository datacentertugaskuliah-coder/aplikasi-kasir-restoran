// Controller laporan & analitik — akses dibatasi Owner (lihat routes/reportRoutes.js),
// sesuai PRD: "Reports accessible only from within the restaurant" oleh Owner.
const Report = require('../models/Report');

async function getDailySales(req, res) {
  const { startDate, endDate } = req.query;
  const report = await Report.dailySales({ startDate, endDate });
  return res.json({ report });
}

async function getPeriodicSales(req, res) {
  const { period } = req.query; // 'week' | 'month'
  const report = await Report.periodicSales({ period });
  return res.json({ report });
}

async function getBestSellingItems(req, res) {
  const { limit } = req.query;
  const report = await Report.bestSellingItems({ limit: limit ? Number(limit) : undefined });
  return res.json({ report });
}

async function getSalesByCashier(req, res) {
  const { startDate, endDate } = req.query;
  const report = await Report.salesByCashier({ startDate, endDate });
  return res.json({ report });
}

async function getRevenueSummary(req, res) {
  const summary = await Report.revenueSummary();
  return res.json({ summary });
}

module.exports = {
  getDailySales,
  getPeriodicSales,
  getBestSellingItems,
  getSalesByCashier,
  getRevenueSummary,
};
