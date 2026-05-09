/**
 * Click.uz Payment Integration Helper
 * 
 * To integrate with Click, you need:
 * 1. service_id
 * 2. merchant_id
 * 3. merchant_user_id
 */

export const CLICK_CONFIG = {
  MERCHANT_ID: '22837', // O'zingizning Merchant ID-ni bu yerga qo'ying
  SERVICE_ID: '31568',  // O'zingizning Service ID-ni bu yerga qo'ying
  MERCHANT_USER_ID: '36452', // O'zingizning User ID-ni bu yerga qo'ying
};

/**
 * Click to'lov havolasini yaratish
 * @param amount To'lov summasi
 * @param transactionId Buyurtma ID-si
 */
export const generateClickUrl = (amount: number, transactionId: string) => {
  const url = new URL('https://my.click.uz/services/pay');
  url.searchParams.append('service_id', CLICK_CONFIG.SERVICE_ID);
  url.searchParams.append('merchant_id', CLICK_CONFIG.MERCHANT_ID);
  url.searchParams.append('amount', amount.toString());
  url.searchParams.append('transaction_param', transactionId);
  url.searchParams.append('return_url', window.location.origin);
  
  return url.toString();
};
