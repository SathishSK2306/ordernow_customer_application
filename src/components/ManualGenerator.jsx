import React from 'react';

const ManualGenerator = () => {
  const generateManualContent = () => {
    return `
# OrderNow - Food Preparation Time Management Manual

## Table of Contents
1. [Overview](#overview)
2. [How the Queue System Works](#how-the-queue-system-works)
3. [Managing Food Preparation Times](#managing-food-preparation-times)
4. [Customer Experience](#customer-experience)
5. [Admin Panel Features](#admin-panel-features)
6. [Real-time Notifications](#real-time-notifications)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

The OrderNow system implements a sophisticated queue-based ordering system that calculates real-time wait times based on:
- Current orders in the queue
- Batch preparation capabilities
- Food preparation times

## How the Queue System Works

### Basic Concept
The system works on a batch processing model where:
- Each food item has a **Base Time** (time to prepare one batch)
- Each food item has a **Batch Size** (number of items per batch)
- Orders are processed in the order they arrive
- Wait times are calculated based on the queue position

### Example Calculation
Let's say you have Dosa with:
- Base Time: 5 minutes
- Batch Size: 5 dosas

**Current Queue:**
1. Order 1: 5 dosas (will take 5 minutes)
2. Order 2: 2 dosas (will be ready at 10 minutes)
3. Order 3: 3 dosas (will be ready at 10 minutes)
4. **Your Order: 1 dosa (will be ready at 15 minutes)**

**Calculation Logic:**
- Orders 1: Takes first batch (0-5 min)
- Orders 2 & 3: Combined = 5 dosas = 1 batch (5-10 min)
- Your order: Starts new batch (10-15 min)

## Managing Food Preparation Times

### Accessing the Admin Panel
1. Click on "Admin" in the navigation bar
2. Or navigate to `/admin` in the URL

### Default Food Items
The system comes with 30 pre-configured food items:
- Margherita Pizza (15 min, batch size 2)
- Chicken Burger (10 min, batch size 4)
- Masala Dosa (5 min, batch size 5)
- Chicken Biryani (25 min, batch size 2)
- And many more...

### Editing Food Preparation Times
1. Go to Admin Panel
2. Find the food item in the table
3. Click the **Edit** icon (pencil)
4. Modify the Base Time and/or Batch Size
5. Click **Save** icon (disk)

### Adding New Food Items
1. In Admin Panel, click "Add New Food Item"
2. Enter:
   - Food Name
   - Base Time (in minutes)
   - Batch Size (number of items)
3. Click Save

### Removing Food Items
1. Click the **Trash** icon next to the food item
2. Confirm deletion

### Reset to Defaults
- Use the "Reset to Default" button to restore original values
- This will overwrite all custom changes

## Customer Experience

### Placing an Order
1. Customer adds items to cart
2. System calculates estimated wait time
3. Customer sees wait time before checkout
4. Order is placed with real-time tracking

### Order Tracking Stages
1. **Order Placed** - Immediately after checkout
2. **Cooking Started** - 1 second after order placement
3. **Ready for Pickup** - When estimated time is reached

### Notification Timeline
- **Immediate**: "Your order is being prepared!"
- **5 minutes before**: "Your order will be ready in 5 minutes!"
- **2 minutes before**: "Your order will be ready in 2 minutes!"
- **When ready**: "Your order is ready for pickup!"

### Cooking Animation
- Animated utensils icon rotates continuously
- Progress bar shows completion percentage
- Real-time countdown of remaining time

## Admin Panel Features

### Dashboard Stats
- Active Orders count
- Total Food Items
- Average Preparation Time

### Active Orders Monitor
- View all current orders
- See estimated completion times
- Monitor order status

### Food Management Table
- Search functionality
- Edit preparation times
- Add/remove food items
- Sort by name, time, or batch size

### Export/Import
- Export current settings as JSON
- Download manual as text file
- Backup and restore functionality

## Real-time Notifications

### Notification Types
- **Info**: General information (blue)
- **Warning**: Time warnings (yellow)
- **Success**: Order ready (green)
- **Error**: System errors (red)

### Notification Center
- Bell icon in top-right corner
- Shows unread notification count
- Click to view all notifications
- Auto-dismisses after 10 seconds

### Toast Notifications
- Slide in from right side
- Show latest 3 notifications
- Can be dismissed manually

## Best Practices

### Setting Preparation Times
1. **Be Realistic**: Base times on actual kitchen performance
2. **Consider Peak Hours**: Account for busy periods
3. **Test Regularly**: Monitor and adjust based on performance
4. **Update Seasonally**: Adjust for seasonal variations

### Batch Sizes
1. **Kitchen Capacity**: Don't exceed what can be prepared simultaneously
2. **Equipment Limits**: Consider grill space, oven capacity, etc.
3. **Staff Availability**: Factor in number of cooks
4. **Quality Control**: Ensure quality doesn't suffer with larger batches

### Monitoring Orders
1. **Regular Checks**: Monitor active orders frequently
2. **Adjust Times**: Update preparation times based on performance
3. **Customer Communication**: Ensure notifications are working
4. **Peak Hour Planning**: Prepare for busy periods

## Troubleshooting

### Common Issues

**Long Wait Times**
- Check if batch sizes are too small
- Verify preparation times are realistic
- Consider parallel cooking capabilities

**Inaccurate Estimates**
- Review and update preparation times
- Check if batch processing is optimal
- Monitor actual vs. estimated times

**Notification Issues**
- Ensure browser allows notifications
- Check if notifications are being dismissed too quickly
- Verify timing calculations are correct

**Admin Panel Access**
- Ensure admin route is accessible
- Check if data is being saved properly
- Verify localStorage is working

### System Maintenance
1. **Regular Backups**: Export settings regularly
2. **Performance Monitoring**: Watch for slow calculations
3. **Data Cleanup**: Clear old order data periodically
4. **Update Preparation Times**: Adjust based on actual performance

## Technical Information

### Data Storage
- All data stored in browser localStorage
- Automatic backup on every change
- No server-side storage required

### Calculation Algorithm
\`\`\`javascript
// Wait time calculation
const calculateWaitTime = (cartItems, orderQueue) => {
  let totalWaitTime = 0;
  
  cartItems.forEach(item => {
    const itemsInQueue = countItemsInQueue(item.id, orderQueue);
    const batchesNeeded = Math.ceil(itemsInQueue / item.batchSize);
    const waitTime = batchesNeeded * item.baseTime;
    totalWaitTime = Math.max(totalWaitTime, waitTime);
  });
  
  return totalWaitTime;
};
\`\`\`

### Browser Compatibility
- Modern browsers supporting localStorage
- JavaScript ES6+ features
- CSS Grid and Flexbox support

## Support and Updates

### Getting Help
- Check this manual for common issues
- Review the troubleshooting section
- Contact system administrator

### Feature Requests
- Submit through proper channels
- Include detailed requirements
- Provide use case examples

### System Updates
- Regular updates for performance improvements
- New features added based on feedback
- Security patches applied as needed

---

**Last Updated**: ${new Date().toLocaleDateString()}
**Version**: 1.0.0
**Manual Generated**: ${new Date().toLocaleString()}
`;
  };

  const downloadManual = () => {
    const content = generateManualContent();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'OrderNow_Food_Preparation_Management_Manual.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    // For PDF generation, we'll create a simple HTML version
    const content = generateManualContent();
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>OrderNow Manual</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
        h2 { color: #34495e; margin-top: 30px; }
        h3 { color: #7f8c8d; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .toc { background: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div>${content.replace(/\n/g, '<br>').replace(/#{1,6}\s(.+)/g, '<h$1>$2</h$1>')}</div>
    </body>
    </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'OrderNow_Food_Preparation_Management_Manual.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { downloadManual, downloadPDF, generateManualContent };
};

export default ManualGenerator;