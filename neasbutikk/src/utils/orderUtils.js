/**
 * Utility functions for handling orders
 */

/**
 * Generates a random order ID in the format: ORDER-XXXX-XXXX
 * where X is a random uppercase letter or number
 * @returns {string} The generated order ID
 */
export const generateOrderId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let firstPart = '';
  let secondPart = '';
  
  // Generate first 4 characters
  for (let i = 0; i < 4; i++) {
    firstPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Generate second 4 characters
  for (let i = 0; i < 4; i++) {
    secondPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `ORDER-${firstPart}-${secondPart}`;
};

/**
 * Creates an order object with all necessary information
 * @param {Object} orderData - Data for the order
 * @param {Array} orderData.items - Items in the order
 * @param {number} orderData.totalAmount - Total order amount
 * @param {Object} orderData.customer - Customer information
 * @returns {Object} The complete order object
 */
export const createOrder = (orderData) => {
  return {
    id: generateOrderId(),
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    customer: orderData.customer,
    status: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};