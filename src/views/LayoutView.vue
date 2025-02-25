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
    <el-menu :default-active="activeMenu" @select="handleMenuSelect" router>
  <el-menu-item index="home">区块链可视化界面</el-menu-item>

  <!-- 在线软件报告 -->
  <el-sub-menu index="software-report" :default-opened="true">
    <template #title>在线软件报告</template>
    <el-menu-item index="vulnerability-scan">漏洞扫描</el-menu-item>
    <el-menu-item index="sbom-management">SBOM 生成</el-menu-item>
    <el-menu-item index="report">报告</el-menu-item>
  </el-sub-menu>

  <!-- 软件标识管理 -->
  <el-sub-menu index="software-identity" :default-opened="true">
    <template #title>软件标识管理</template>
    <el-menu-item index="identity-registration">软件标识注册</el-menu-item>
    <el-menu-item index="identity-revocation">标识注销</el-menu-item>
    <el-menu-item index="identity-key-update">标识密钥更新</el-menu-item>
    <el-menu-item index="identity-doc-update">更新标识文档</el-menu-item>
    <el-menu-item index="software-identity">查询软件标识</el-menu-item>
  </el-sub-menu>

  <!-- 漏洞数据库 -->
  <el-sub-menu index="vulnerability-database" :default-opened="true">
    <template #title>漏洞数据库</template>
    <el-menu-item index="vulnerability-database">漏洞库记录修改</el-menu-item>
  </el-sub-menu>

  <!-- 系统设置 -->
  <el-menu-item index="settings">系统设置</el-menu-item>
</el-menu>

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