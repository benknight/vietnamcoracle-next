// import { datadogRum } from '@datadog/browser-rum'
import { datadogLogs } from '@datadog/browser-logs';

export function initDatadog() {
  // Only initialize on client side
  if (typeof window === 'undefined') return;

  // Initialize RUM (Real User Monitoring)
  // datadogRum.init({
  //   applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
  //   clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
  //   site: 'datadoghq.com', // Change to your Datadog site (e.g., 'datadoghq.eu')
  //   service: 'your-app-name',
  //   env: process.env.NODE_ENV,
  //   version: '1.0.0',
  //   sessionSampleRate: 100,
  //   sessionReplaySampleRate: 20,
  //   trackUserInteractions: true,
  //   trackResources: true,
  //   trackLongTasks: true,
  //   defaultPrivacyLevel: 'mask-user-input'
  // })

  if (!process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN) {
    console.warn('Datadog client token is not set. Skipping initialization.');
    return;
  }

  // Initialize Logs
  datadogLogs.init({
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
    site: 'us5.datadoghq.com',
    service: 'vietnamcoracle-next',
    env: process.env.NODE_ENV,
    version: '1.0.0',
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
  });
}
