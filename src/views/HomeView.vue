<template>
  <div>
    <button @click="fetchData" class="request-button">发送请求</button>
    <div v-if="data" class="response-data">
      <h3>响应数据:</h3>
      <pre>{{ data }}</pre>
    </div>
    <div>
      <h2>仪表盘 (Dashboard)</h2>
      <p>欢迎，{{ authStore.username }}</p>
      <button @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const data = ref(null);

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/hello');
    console.log(response)
    data.value = response.data;
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.request-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.request-button:hover {
  background-color: #45a049;
}

.response-data {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>