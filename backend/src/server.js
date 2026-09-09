require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const bundleRoutes = require('./routes/bundleRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cashierOrderRoutes = require('./routes/cashierOrderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', cashierOrderRoutes); // /active dan /:id/open-for-payment, /:id/complete
app.use('/api/orders', orderRoutes); // /table, /walk-in, /:id, /:id/items
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
