import { createRouter, createWebHistory } from 'vue-router'

import LayoutView from '../views/LayoutView.vue'
import HomeView from '../views/HomeView.vue'
import SoftwareIdentityView from '../views/SoftwareIdentityView.vue'
import SBOMManagementView from '../views/SBOMManagementView.vue'
import VulnerabilityScanView from '../views/VulnerabilityScanView.vue'
import VulnerabilityDatabaseView from '../views/VulnerabilityDatabaseView.vue'
import SettingsView from '../views/SettingsView.vue'

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
          path: '/settings',
          name: 'settings',
          component: SettingsView,
          meta: { title: 'System Settings' },
        }
      ],
      meta: { title: 'Dashboard' },
    },
  
  ],
})

// // Navigation Guard for Setting Page Titles
// outer.beforeEach((to, from, next) => {
//   document.title = to.meta.title || 'Software Security Platform';
//   next();
// });

export default router
