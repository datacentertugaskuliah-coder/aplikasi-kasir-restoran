const db = require('../config/db');

const Bundle = {
  async findAll() {
    const { rows } = await db.query(
      `SELECT b.*,
        COALESCE(json_agg(json_build_object(
          'menuItemId', bi.menu_item_id, 'quantity', bi.quantity
        )) FILTER (WHERE bi.id IS NOT NULL), '[]') AS items
       FROM bundles b
       LEFT JOIN bundle_items bi ON bi.bundle_id = b.id
       WHERE b.is_active = TRUE
       GROUP BY b.id
       ORDER BY b.name`
    );
    return rows;
  },

  async create({ name, description, bundlePrice, items }) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        `INSERT INTO bundles (name, description, bundle_price) VALUES ($1, $2, $3) RETURNING *`,
        [name, description, bundlePrice]
      );
      const bundle = rows[0];
      for (const item of items) {
        await client.query(
          `INSERT INTO bundle_items (bundle_id, menu_item_id, quantity) VALUES ($1, $2, $3)`,
          [bundle.id, item.menuItemId, item.quantity || 1]
        );
      }
      await client.query('COMMIT');
      return bundle;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async setActive(id, isActive) {
    const { rows } = await db.query(
      'UPDATE bundles SET is_active = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, isActive]
    );
    return rows[0];
  },

  async setAvailable(id, isAvailable) {
    const { rows } = await db.query(
      'UPDATE bundles SET is_available = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, isAvailable]
    );
    return rows[0];
  },
};

module.exports = Bundle;
