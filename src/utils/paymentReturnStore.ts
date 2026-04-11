/**
 * Stores the navigation destination to return to after the Razorpay
 * payment flow completes and the user returns via deep link.
 *
 * This is intentionally a plain module-level variable (not React state)
 * so it survives the app going to background while the browser is open.
 */

export interface PaymentReturnDestination {
  returnTo: string;
  returnScreen?: string;
  returnParams?: any;
}

let _destination: PaymentReturnDestination | null = null;

export const setPaymentReturnDestination = (dest: PaymentReturnDestination) => {
  _destination = dest;
};

export const getPaymentReturnDestination = (): PaymentReturnDestination | null => {
  return _destination;
};

export const clearPaymentReturnDestination = () => {
  _destination = null;
};
