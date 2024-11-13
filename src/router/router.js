import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',          
    name: 'Home',
    component: () => import('@/components/AddLesson.vue'),
  },
  {
    path: '/lesson/:id',
    name: 'LessonPage',
    component: () => import('@/components/LessonPage/LessonPage.vue'),
    props: route => ({ lessonId: route.params.id }) // передаем :id как prop `lessonId`
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;