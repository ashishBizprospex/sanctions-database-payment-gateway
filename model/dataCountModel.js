import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js'; // Adjust the path according to your project structure

const Data_count = sequelize.define('Data_count', {
  data_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  total_count: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  page:{
    type: DataTypes.STRING,
    allowNull: true, 
  }
}, {
  tableName: 'data_count', // Set your desired table name
  timestamps: false, // Disable automatic timestamps
});

// Sync the model with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Data_count table synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing Data_count table:', err);
  });

export default Data_count;
