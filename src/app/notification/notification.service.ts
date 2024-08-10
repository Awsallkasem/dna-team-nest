import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly onesignalUrl = 'https://onesignal.com/api/v1/notifications';

  private readonly appId = 'f7ddd763-567c-4a8b-9928-4c6b1c4fe9d1';
  private readonly apiKey = 'NTJjNzRhZmQtMzIxNC00Yjg3LWE4OWQtNWUyMzBhOWIyYzFk';

  async sendNotification(
    contents: { [key: string]: string },
    includePlayerIds: string[],
  ) {
    const length = 32; // Adjust length as needed
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    const payload = {
      app_id: this.appId,
      contents,
      include_player_ids: ['a83f6acb-bccf-4792-86a0-b70e5134d525'],
    };

    const url =
      'https://api.onesignal.com/apps/f7ddd763-567c-4a8b-9928-4c6b1c4fe9d1/users';

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        subscriptions: [
          { type: 'Email', token: 'joe@example.com', enabled: true },
        ],
      }),
    };

    await fetch(
      url,

      options,
    )
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error('error:' + err));

    try {
      const response = await axios.post(this.onesignalUrl, payload, {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error sending notification',
        error.response?.data || error.message,
      );
      throw new Error('Error sending notification');
    }
  }
}
