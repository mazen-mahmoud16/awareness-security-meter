import { router } from "../../trpc";
import { homeRouter } from "./home";

export const userRouter = router({
  home: homeRouter,
});
