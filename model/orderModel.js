import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js'; // Adjust the path according to your project structure

const Order = sequelize.define('Order', {
  orderid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  mercid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  receiptid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productid: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Change this to DataTypes.STRING if you expect string IDs
    allowNull: true,
  },
  amount: {
    type: DataTypes.STRING, // Change to DataTypes.INTEGER if the amount is numeric
    allowNull: true,
  },
  order_date: {
    type: DataTypes.STRING, // Change to DataTypes.DATE if you're storing actual dates
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ru: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  additional_info: {
    type: DataTypes.JSONB, // Use JSONB for storing structured data
    allowNull: true,
  },
  itemcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device: {
    type: DataTypes.JSONB, // Use JSONB for structured device data
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
  user_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'order', // Set your desired table name
  timestamps: false, // Disable automatic timestamps
});

// Sync the model with the database
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Order table synced successfully.');
//   })
//   .catch(err => {
//     console.error('Error syncing Order table:', err);
//   });

export default Order;
