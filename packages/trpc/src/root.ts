import { authRouter } from "./routers/authRouter.js";
import { fieldRouter } from "./routers/fieldRouter.js";
import { formRouter } from "./routers/formRouter.js";
import { responseRouter } from "./routers/responseRouter.js";
import { router } from "./trpc.js";

export const appRouter = router({
  auth: authRouter,
  field: fieldRouter,
  form: formRouter,
  response: responseRouter
});

export type AppRouter = typeof appRouter;
