import express from "express";
import session from "express-session";
import passport from "passport";
import { dbConnect, dbDisconnect } from "./db/connect";
import { SESSION_DETAILS } from "./lib/constants";
import errorHandler from "./lib/middlewares/errorHandler";
import init from "./lib/util/init";
import router from "./routes";
import { initTrpcRouter } from "./trpc/initTrpcRoute";

async function main() {
  const app = express();

  await dbConnect();

  await import("./lib/logger");

  await init();

  app.use(session(SESSION_DETAILS));

  app.use(passport.initialize());

  initTrpcRouter(app);

  app.use("/api", router);

  app.use(errorHandler);

  app.listen(process.env.PORT, () => {
    console.log(`API Listening on Port ${process.env.PORT}`);
  });
}

main().catch(async (e) => {
  console.log(e);
  await dbDisconnect();
});
