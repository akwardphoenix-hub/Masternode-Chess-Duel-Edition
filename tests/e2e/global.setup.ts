import { chromium, type Page } from '@playwright/test';

export default async () => {
  // Global setup function - can be used for any one-time setup
};

/**
 * Mock all external network requests to ensure tests run completely offline.
 * Only allows requests to localhost/127.0.0.1, all others are blocked or stubbed.
 */
export async function mockExternal(page: Page) {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    
    // Allow requests to localhost and 127.0.0.1
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
      return route.continue();
    }
    
    // Block/stub all external requests
    // Serve tiny fixtures for common file types
    if (url.pathname.endsWith('.json')) {
      return route.fulfill({ status: 200, body: '{}', contentType: 'application/json' });
    }
    
    if (/\.(png|jpg|jpeg|svg|ico)$/i.test(url.pathname)) {
      return route.fulfill({ status: 200, body: '', contentType: 'image/png' });
    }
    
    if (/\.(woff2?)$/i.test(url.pathname)) {
      return route.fulfill({ status: 200, body: '', contentType: 'font/woff2' });
    }
    
    if (/\.(css)$/i.test(url.pathname)) {
      return route.fulfill({ status: 200, body: '', contentType: 'text/css' });
    }
    
    if (/\.(js)$/i.test(url.pathname)) {
      return route.fulfill({ status: 200, body: '', contentType: 'application/javascript' });
    }
    
    // Generic stub for everything else
    return route.fulfill({ status: 200, body: '' });
  });
}
