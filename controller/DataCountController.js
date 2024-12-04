import Data_count from "../model/dataCountModel.js";

// Create a new Data Count entry
export const createDataCount = async (req, res) => {
    try {
      const { data_type, total_count, description,type,page } = req.body;
  
      // Create a new record in the database
      const newDataCount = await Data_count.create({ data_type, total_count, description,type,page });
  
      res.status(201).json({
        success: true,
        message: 'Data count created successfully.',
        data: newDataCount,
      });
    } catch (error) {
      console.error('Error creating data count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create data count.',
        error: error.message,
      });
    }
  };
  
  // Get all Data Count entries
  export const getAllDataCountController = async (req, res) => {
    try {
      const dataCounts = await Data_count.findAll();
  
      res.status(200).json({
        success: true,
        message: 'Data counts fetched successfully.',
        data: dataCounts,
      });
    } catch (error) {
      console.error('Error fetching data counts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch data counts.',
        error: error.message,
      });
    }
  };
  
  // Update a Data Count entry
  export const updateDataCountController = async (req, res) => {
    try {
      const { id } = req.params; // Assume the ID is provided in the URL
      const { data_type, total_count, description,type,page } = req.body;
  
      // Find and update the record
      const dataCount = await Data_count.findByPk(id);
      if (!dataCount) {
        return res.status(404).json({
          success: false,
          message: 'Data count not found.',
        });
      }
  
      await dataCount.update({ data_type, total_count, description,type,page });
  
      res.status(200).json({
        success: true,
        message: 'Data count updated successfully.',
        data: dataCount,
      });
    } catch (error) {
      console.error('Error updating data count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update data count.',
        error: error.message,
      });
    }
  };
  
  // Delete a Data Count entry
  export const deleteDataCountController = async (req, res) => {
    try {
      const { id } = req.params; // Assume the ID is provided in the URL
  
      // Find and delete the record
      const dataCount = await Data_count.findByPk(id);
      if (!dataCount) {
        return res.status(404).json({
          success: false,
          message: 'Data count not found.',
        });
      }
  
      await dataCount.destroy();
  
      res.status(200).json({
        success: true,
        message: 'Data count deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting data count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete data count.',
        error: error.message,
      });
    }
  };