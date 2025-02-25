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
// 要加的部分
// import apiClient from '../home.ApiClient';
// const handleLogin = async () => {
// if (username.value && password.value) {
//     try {
//     const response = await apiClient.post('/login', {
//         username: username.value,
//         password: password.value,
//     });

//     if (response && response.data && response.data.token) {
//         const token = response.data.token;
        
//         // 存储 token
//         authStore.login(token, username.value);

//         alert('登录成功');
//         router.push('/');
//     } else {
//         alert('登录失败，请检查用户名或密码');
//     }
//     } catch (error) {
//     console.error('登录请求出错:', error);
//     alert('登录失败，请稍后重试');
//     }
// } else {
//     alert('请填写用户名和密码');
// }
// };

const handleLogin = () => {
    const token = '123'
    // 存储 token
    authStore.login(token, username.value);

    alert('登录成功');
    router.push('/');
}
</script>
  