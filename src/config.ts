export const AppConfig = {
  backendUrl:
    process.env.NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_SERVER_URL
      : process.env.NEXT_PUBLIC_SERVER_URL_DEV,
};
