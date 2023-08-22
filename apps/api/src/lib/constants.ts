import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { SessionOptions } from "express-session";
dotenv.config();

export const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const PORT = process.env.PORT;

export const MONGOURL = process.env.MONGOURL || `mongodb://${
  DB_USER ? `${DB_USER}:${DB_PASS}@` : ``
}${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_USER ? `?authSource=admin` : ``}`;

const COOKIE_SECRET = process.env.COOKIE_SECRET!;
export const production =
  process.env.NODE_ENV && process.env.NODE_ENV?.includes("production");

export const SESSION_DETAILS: SessionOptions = {
  name: "sid",
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
  },
  store: new MongoStore({ mongoUrl: MONGOURL }),
};

export const DEFAULT_ADMIN = process.env.DEFAULT_ADMIN;
export const DEFAULT_PASS = process.env.DEFAULT_PASS;

export const PUBLIC_FOLDER = process.env.PUBLIC_FOLDER!;
export const TENANTS_FOLDER = `${process.env.PUBLIC_FOLDER!}/images/tenants`;
export const IMAGES_FOLDER = `${process.env.PUBLIC_FOLDER!}/images`;
export const VIDEOS_FOLDER = `${process.env.PUBLIC_FOLDER!}/videos`;
export const VIDEO_THUMBNAILS_FOLDER = `${process.env
  .PUBLIC_FOLDER!}/videoThumbnails`;
export const TEMP_FOLDER = `${process.env.PUBLIC_FOLDER!}/temp`;
export const TENANT_REPORTS_FOLDER = `${process.env.PUBLIC_FOLDER!}/reports`;

export const EMAIL_USER = process.env.EMAIL_USER!;
export const EMAIL_PASS = process.env.EMAIL_PASS!;

export const AUTHENTICATION_STRATEGIES = [
  "microsoft",
  "microsoft-saml",
  "google",
  "local",
] as const;

export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "";
export const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "";

export const HOME_CLIENT_URL = CLIENT_ORIGIN;
export const CALLBACK_CLIENT_URL = CLIENT_ORIGIN + "/auth/callback";
export const LOGIN_CLIENT_URL = CLIENT_ORIGIN + "/auth/login";
export const FAILURE_CLIENT_URL = CLIENT_ORIGIN + "/auth/failure";
