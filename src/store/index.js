import { createStore } from "vuex";
import innings from "./modules/innings";
import batsmans from "./modules/batsmans";
import bowlers from "./modules/bowlers";

export default createStore({
  modules: {
    innings,
    batsmans,
    bowlers,
  },
  strict: process.env.NODE_ENV !== "production",
});
