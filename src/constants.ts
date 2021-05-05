// Global properties
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_TEST = !!process.env.IS_TEST;

// Server properties
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Database properties
export const DATABASE_ADDRESS: string = process.env.DATABASE_ADDRESS!;
export const DATABASE_PORT: number = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432;
export const DATABASE_USER: string = process.env.DATABASE_USER!;
export const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD!;
export const DATABASE_NAME: string = process.env.DATABASE_NAME!;
