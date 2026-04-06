export const Endpoint = {
    MESSAGES: '/api/v1/messages',
    USERS: '/api/v1/users',
    AUTH: '/api/v1/auth',
    CATEGORIES: '/api/v1/categories',
    PRODUCTS: '/api/v1/products',
    CARTS: '/api/v1/carts',
    ORDERS: '/api/v1/orders',
} as const;

export type EndpointKey = (typeof Endpoint)[keyof typeof Endpoint];