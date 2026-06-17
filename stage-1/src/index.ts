import { fetchNotifications } from './services/notificationService';
import { MinHeap } from './utils/minHeap';
import { Logger } from './utils/logger';
import { CONFIG } from './config';

async function main(): Promise<void> {
  Logger.info('Starting Priority Inbox Processor...');
  
  try {
    const notifications = await fetchNotifications();
    
    if (notifications.length === 0) {
      Logger.warn('No notifications retrieved from the API.');
      console.log('\n==================================');
      console.log('TOP 10 PRIORITY NOTIFICATIONS');
      console.log('=============================');
      console.log('(No notifications available)');
      return;
    }

    const minHeap = new MinHeap(CONFIG.HEAP_LIMIT);

    Logger.info(`Processing ${notifications.length} notifications through Min Heap of size ${CONFIG.HEAP_LIMIT}...`);
    for (const notification of notifications) {
      minHeap.insert(notification);
    }

    // Get final sorted results (descending weight, descending timestamp)
    const topNotifications = minHeap.getSortedArray();

    console.log('\n==================================');
    console.log('TOP 10 PRIORITY NOTIFICATIONS');
    console.log('=============================');
    
    if (topNotifications.length === 0) {
      console.log('(No notifications found)');
    } else {
      topNotifications.forEach((notification, index) => {
        console.log(`${index + 1}. ${notification.type} | ${notification.message}`);
      });
    }
    console.log('==================================\n');

  } catch (error) {
    Logger.error('An error occurred during Priority Inbox execution:', error);
    process.exit(1);
  }
}

main();
