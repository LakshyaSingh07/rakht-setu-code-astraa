const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Creates a default admin user if no admin exists in the database
 * @returns {Promise<void>}
 */
async function createDefaultAdmin() {
  try {
    // Check if any admin user already exists
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (adminExists) {
      console.log('Admin user already exists, skipping default admin creation');
      return;
    }
    
    // Default admin credentials
    const defaultAdmin = {
      name: 'Admin',
      email: 'admin@lifebridge.com',
      password: await bcrypt.hash('admin123', 10),
      bloodGroup: 'O+',
      role: 'admin',
      isAdmin: true
    };
    
    // Create the admin user
    const newAdmin = new User(defaultAdmin);
    await newAdmin.save();
    
    console.log('Default admin user created successfully');
    console.log('Email: admin@lifebridge.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
}

module.exports = createDefaultAdmin;