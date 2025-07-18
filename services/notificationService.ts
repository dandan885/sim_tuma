import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  categoryId?: string;
}

class NotificationService {
  private expoPushToken: string | null = null;

  // Initialize notification service
  async initialize(): Promise<void> {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for push notifications');
      }
      
      // Get push token
      this.expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', this.expoPushToken);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    // Configure notification categories
    await this.setupNotificationCategories();
  }

  // Setup notification categories for different types
  private async setupNotificationCategories(): Promise<void> {
    await Notifications.setNotificationCategoryAsync('transaction', [
      {
        identifier: 'view',
        buttonTitle: 'View Details',
        options: { opensAppToForeground: true },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('chat', [
      {
        identifier: 'reply',
        buttonTitle: 'Reply',
        options: { opensAppToForeground: true },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('bill', [
      {
        identifier: 'pay',
        buttonTitle: 'Pay Now',
        options: { opensAppToForeground: true },
      },
    ]);
  }

  // Send local notification
  async sendLocalNotification(data: NotificationData): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        categoryIdentifier: data.categoryId,
      },
      trigger: null, // Send immediately
    });
  }

  // Schedule notification for future
  async scheduleNotification(
    data: NotificationData,
    triggerDate: Date
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        categoryIdentifier: data.categoryId,
      },
      trigger: triggerDate,
    });

    return notificationId;
  }

  // Cancel scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Send transaction notification
  async sendTransactionNotification(
    type: 'sent' | 'received',
    amount: number,
    contact: string
  ): Promise<void> {
    const title = type === 'sent' ? 'Money Sent' : 'Money Received';
    const body = type === 'sent' 
      ? `UGX ${amount.toLocaleString()} sent to ${contact}`
      : `UGX ${amount.toLocaleString()} received from ${contact}`;

    await this.sendLocalNotification({
      title,
      body,
      categoryId: 'transaction',
      data: { type, amount, contact },
    });
  }

  // Send chat notification
  async sendChatNotification(sender: string, message: string): Promise<void> {
    await this.sendLocalNotification({
      title: `Message from ${sender}`,
      body: message,
      categoryId: 'chat',
      data: { sender, message },
    });
  }

  // Send bill reminder notification
  async sendBillReminderNotification(
    billType: string,
    amount: number,
    dueDate: string
  ): Promise<void> {
    await this.sendLocalNotification({
      title: 'Bill Payment Reminder',
      body: `Your ${billType} bill of UGX ${amount.toLocaleString()} is due on ${dueDate}`,
      categoryId: 'bill',
      data: { billType, amount, dueDate },
    });
  }

  // Schedule recurring bill reminders
  async scheduleRecurringBillReminder(
    billType: string,
    amount: number,
    dayOfMonth: number
  ): Promise<string[]> {
    const notificationIds: string[] = [];
    
    // Schedule for next 12 months
    for (let i = 0; i < 12; i++) {
      const reminderDate = new Date();
      reminderDate.setMonth(reminderDate.getMonth() + i);
      reminderDate.setDate(dayOfMonth);
      reminderDate.setHours(9, 0, 0, 0); // 9 AM reminder

      // Only schedule future dates
      if (reminderDate > new Date()) {
        const notificationId = await this.scheduleNotification(
          {
            title: 'Upcoming Bill Payment',
            body: `Your ${billType} bill of UGX ${amount.toLocaleString()} is due tomorrow`,
            categoryId: 'bill',
            data: { billType, amount, recurring: true },
          },
          new Date(reminderDate.getTime() - 24 * 60 * 60 * 1000) // 24 hours before
        );
        
        notificationIds.push(notificationId);
      }
    }

    return notificationIds;
  }

  // Get push token for server registration
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Handle notification response (when user taps notification)
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Handle received notification (when app is in foreground)
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }
}

export const notificationService = new NotificationService();