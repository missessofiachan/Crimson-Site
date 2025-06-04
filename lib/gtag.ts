// Google Analytics configuration and utilities
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-SCFSK4S8DV';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url.pathname + url.search,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce specific events
export interface GtagItem {
  _id: string;
  name: string;
  category?: string;
  quantity?: number;
  price: number;
}

export const trackPurchase = (transactionId: string, items: GtagItem[], value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'AUD',
      items: items.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        category: item.category || 'uncategorized',
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
};

export const trackAddToCart = (item: GtagItem) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'AUD',
      value: item.price,
      items: [
        {
          item_id: item._id,
          item_name: item.name,
          category: item.category || 'uncategorized',
          quantity: 1,
          price: item.price,
        },
      ],
    });
  }
};

export const trackRemoveFromCart = (item: GtagItem & { quantity: number }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      currency: 'AUD',
      value: item.price * item.quantity,
      items: [
        {
          item_id: item._id,
          item_name: item.name,
          category: item.category || 'uncategorized',
          quantity: item.quantity,
          price: item.price,
        },
      ],
    });
  }
};

export const trackViewItem = (item: GtagItem) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'AUD',
      value: item.price,
      items: [
        {
          item_id: item._id,
          item_name: item.name,
          category: item.category || 'uncategorized',
          price: item.price,
        },
      ],
    });
  }
};

export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

export const trackBeginCheckout = (items: GtagItem[], value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'AUD',
      value: value,
      items: items.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        category: item.category || 'uncategorized',
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
};

export const trackSignUp = (method: string = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    });
  }
};

export const trackLogin = (method: string = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method,
    });
  }
};
