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
  let token = null;

  // En Android 8.0+ (Oreo en adelante), los canales de notificación son OBLIGATORIOS
  // para que suenen y aparezcan con prioridad alta (Heads-up banner)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('dal-orders', {
      name: 'Pedidos y Envíos Dal',
      description: 'Alertas de estado de compras, envíos en camino y confirmaciones.',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#B56B47',
      enableVibrate: true,
      showBadge: true,
    });
  }

  // Las notificaciones push solo funcionan en dispositivos físicos reales
  if (!Device.isDevice) {
    console.warn('[Push] Debes usar un dispositivo físico real para recibir notificaciones push de FCM.');
    return null;
  }

  // 3. Comprobar permisos existentes o solicitarlos (Android 13+ solicitará POST_NOTIFICATIONS)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Push] El usuario no concedió permisos de notificación.');
    return null;
  }

  try {
    // 4. Intentar obtener el Token nativo de Firebase Cloud Messaging (FCM)
    const deviceTokenResponse = await Notifications.getDevicePushTokenAsync();
    token = deviceTokenResponse.data;
    console.log('[Push] Token FCM nativo obtenido:', token);
  } catch (error) {
    console.warn('[Push] Aviso: Modo Expo Go detectado. Obteniendo token alternativo...');
    try {
      const expoToken = await Notifications.getExpoPushTokenAsync();
      token = expoToken.data;
      console.log('[Push] Token obtenido exitosamente:', token);
    } catch (e2) {
      console.error('[Push] Error al obtener token:', e2.message);
    }
  }

  return token;
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
