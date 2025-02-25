import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

import LayoutView from '../views/LayoutView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/Login.vue'
import SoftwareIdentityView from '../views/manage/SoftwareIdentityView.vue'
import SBOMManagementView from '../views/report/SBOMManagementView.vue'
import VulnerabilityScanView from '../views/report/VulnerabilityScanView.vue'
import ReportView from '@/views/report/ReportView.vue';
import VulnerabilityDatabaseView from '../views/database/VulnerabilityDatabaseView.vue'
import SettingsView from '../views/SettingsView.vue'
import IdentityRegistrationView from '@/views/manage/IdentityRegistrationView.vue';
import IdentityRevocationView from '@/views/manage/IdentityRevocationView.vue';
import IdentityKeyView from '@/views/manage/IdentityKeyView.vue';
import IdentityDoc from '@/views/manage/IdentityDoc.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LayoutView,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'index',
          component: HomeView,
          meta: { title: 'Software Identity Management' },
        },
        {
          path: '/software-identity',
          name: 'software-identity',
          component: SoftwareIdentityView,
          meta: { title: 'Software Identity Management' },
        },
        {
          path: '/sbom-management',
          name: 'sbom-management',
          component: SBOMManagementView,
          meta: { title: 'SBOM Management' },
        },
        {
          path: '/vulnerability-scan',
          name: 'vulnerability-scan',
          component: VulnerabilityScanView,
          meta: { title: 'Vulnerability Scan' },
        },
        {
          path: '/vulnerability-database',
          name: 'vulnerability-database',
          component: VulnerabilityDatabaseView,
          meta: { title: 'Vulnerability Database' },
        },
        {
          path: '/report',
          name: 'report',
          component: ReportView,
          meta: { title: 'Report' },
        },
        {
          path: '/settings',
          name: 'settings',
          component: SettingsView,
          meta: { title: 'System Settings' },
        }, 
        {
          path: '/identity-registration',
          name: 'identity-registration',
          component: IdentityRegistrationView,
          meta: { title: 'IdentityRegistrationView' },
        },
        {
          path: '/identity-revocation',
          name: 'identity-revocation',
          component: IdentityRevocationView,
          meta: { title: 'IdentityRevocationView' },
        },
        {
          path: '/identity-key-update',
          name: 'identity-key-update',
          component: IdentityKeyView,
          meta: { title: 'IdentityKeyView' },
        },
        {
          path: '/identity-doc-update',
          name: 'identity-doc-update',
          component: IdentityDoc,
          meta: { title: 'IdentityDoc' },
        }
      ],
      meta: { title: 'Dashboard' },
    },
    { path: '/login', component: LoginView },
  ],
})


// 模拟认证状态
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};



router.beforeEach((to, from, next) => {
  const publicRoutes = ['/login']; // 不需要登录的页面
  const authStore = useAuthStore();

  // 判断是否需要验证
  if (!publicRoutes.includes(to.path) && !authStore.isAuthenticated) {
    alert('请先登录！');
    next('/login');
  } else {
    next();
  }
});
export default router
