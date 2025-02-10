<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';

// 定义响应式的菜单状态
const activeMenu = ref('1');

// 处理菜单选择的函数
const handleMenuSelect = (index: string) => {
  console.log('选中的菜单项:', index);
  activeMenu.value = index;
};
</script>

<template>
  <el-container id="app">
    <!-- 侧边导航栏 -->
    <el-aside style="background-color: #f4f4f4; width: 200px;">
      <el-menu :default-active="activeMenu" @select="handleMenuSelect" router>
        <el-menu-item index="1">Dashboard</el-menu-item>
        <el-menu-item index="2">Software Identity Management</el-menu-item>
        <el-menu-item index="3">SBOM Management</el-menu-item>
        <el-menu-item index="4">Vulnerability Scan</el-menu-item>
        <el-menu-item index="5">Vulnerability Database</el-menu-item>
        <el-menu-item index="6">System Settings</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-main>
      <RouterView></RouterView>
    </el-main>
  </el-container>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>