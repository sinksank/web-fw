import { defineStore } from 'pinia';

interface AuthState {
  token: string | null;
  username: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('authToken') || null,
    username: localStorage.getItem('username') || null,
  }),
  getters: {
    isAuthenticated: (state: AuthState): boolean => !!state.token,
  },
  actions: {
    login(token: string, username: string) {
      this.token = token;
      this.username = username;
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
    },
    logout() {
      this.token = null;
      this.username = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    },
  },
});
