// src/services/notifications.js
// Servicio oficial de Notificaciones Push con Firebase Cloud Messaging (FCM) y Expo Notifications
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// 1. Configurar el comportamiento cuando la notificación llega con la app en PRIMER PLANO (Foreground)
// Permite que la alerta se muestre como banner flotante, reproduzca sonido y actualice el badge
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * 2. Solicitar permisos de notificación (compatible con Android 13+ runtime permission)
 * y obtener el Token FCM del dispositivo para vincularlo a Firebase.
 */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web') {
    return null;
  }
  try {
    let token = null;

    // En Android 8.0+ (Oreo en adelante), los canales de notificación son OBLIGATORIOS
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('dal-orders', {
          name: 'Pedidos y Envíos Dal',
          description: 'Alertas de estado de compras, envíos en camino y confirmaciones.',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#B56B47',
          enableVibrate: true,
          showBadge: true,
        });
      } catch (e) {}
    }

    if (!Device.isDevice) {
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }
    } catch (e) {
      return null;
    }

    try {
      const deviceTokenResponse = await Notifications.getDevicePushTokenAsync();
      token = deviceTokenResponse?.data || null;
    } catch (error) {
      try {
        const expoToken = await Notifications.getExpoPushTokenAsync();
        token = expoToken?.data || null;
      } catch (e2) {
        // En Expo Go iOS, las notificaciones remotas no están disponibles
      }
    }

    return token;
  } catch (err) {
    return null;
  }
}

/**
 * 5. Enviar el token FCM al backend para asociarlo con el usuario actual
 * @param {string} token - Token de FCM
 * @param {string} userEmail - Correo del usuario autenticado
 * @param {string} backendUrl - URL base de tu servidor (ej. http://192.168.1.100:4000)
 */
export async function sendTokenToBackend(token, userEmail = 'cliente@dal.com', backendUrl = 'http://localhost:4000') {
  if (!token) return;

  try {
    const response = await fetch(`${backendUrl}/api/push/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        email: userEmail,
        platform: Platform.OS,
        deviceModel: Device.modelName || 'Android Device',
        registeredAt: new Date().toISOString()
      }),
    });

    const data = await response.json();
    console.log('[Push] Token registrado en el servidor:', data);
    return data;
  } catch (err) {
    console.warn('[Push] No se pudo enviar el token al backend (¿el servidor está corriendo?):', err.message);
  }
}
