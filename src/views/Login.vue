<template>
    <div class="login-container">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input v-model="username" type="text" id="username" required />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const username = ref('');
  const password = ref('');
  
  const handleLogin = () => {
    if (username.value && password.value) {
      // 模拟服务器返回的 token
      const mockToken = 'jwt-mock-token';
      authStore.login(mockToken, username.value);
      alert('登录成功');
      router.push('/');
    } else {
      alert('请填写用户名和密码');
    }
  };
  </script>
  