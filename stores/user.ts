// stores/user.ts
import { defineStore } from "pinia";
interface userInfo {
  username: string;
}
export const useUserStore = defineStore("user-store", {
  state: () => ({
    token: "",
    userInfo: <userInfo>{
      username: "",
    },
  }),
  getters: {
    isLogin: (state) => !!state.token,
  },
  actions: {
    login(payload: { token: string; userInfo: userInfo }) {
      this.token = payload.token;
      this.userInfo = payload.userInfo;
    },
    logout() {
      this.token = "";
      this.userInfo = {
        username: "",
      };
    },
  },
  persist: true,
});
