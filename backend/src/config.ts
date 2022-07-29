// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export default {
  DB_URI: process.env.DATABASE_URI,
  SECRET: process.env.SECRET,
  // MORALIS_SERVER_URL: process.env.MORALIS_SERVER_URL,
  // MORALIS_APP_ID: process.env.MORALIS_APP_ID,
  // MORALIS_MASTER_KEY: process.env.MORALIS_MASTER_KEY,
  // MAGIC_LINK_SECRET_KEY: process.env.MAGIC_LINK_API_KEY,
  // JWT_EXPIRY: process.env.JWT_EXPIRY,
  // TOURNAMENT_BUFFER_TIME: parseInt(process.env.TOURNAMENT_BUFFER_TIME), // number of minutes before tournament start_time
  // TOURNAMENT_DEFAULT_ALLOCATION: parseInt(
  //   process.env.TOURNAMENT_DEFAULT_ALLOCATION,
  // ),
};
