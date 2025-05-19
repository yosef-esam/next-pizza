import { cache } from "@/lib/cache";

interface Notification {
  id: number;
  message: string;
  createdAt: string;
}

interface NotificationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errors: null;
  data: Notification[];
}

export const getBannerNotifications = cache(
  async () => {
    try {
      const response = await fetch('https://smartlabel1.runasp.net/api/Notifications/me', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const result: NotificationResponse = await response.json();
      
      // Filter only banner-related notifications
      const bannerNotifications = result.data.filter(notification => 
        notification.message.toLowerCase().includes('banner')
      );

      return bannerNotifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  ['banner-notifications'],
  { revalidate: 300 } // Cache for 5 minutes
); 