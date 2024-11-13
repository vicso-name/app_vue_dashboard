<template>

  <header class="header">
    <div class="header-item__left" @click="returnHome">
      <img src="./components/icons/main_logo.svg" alt="main_logo">
      <h1>Alef Bet Tutor <span>dashboard</span></h1>
    </div>
    <div class="header-item__right"></div>
  </header>

  <main class="main">

    <nav class="sidebar">
      <h2 class="sidebar-title">Main Menu</h2>
      <ul class="main-menu">
        <li @click="returnHome">Home</li>
      </ul>
      <h2 class="sidebar-title">Alphabet Lessons</h2>
      <ul class="sidebar-list">
        <li v-for="lesson in sortedLessons" :key="lesson.id" @click="openLesson(lesson.id)">
          {{ lesson.title }}
        </li>
      </ul>
    </nav>

    <section class="main-content">
      <router-view></router-view>
    </section>

  </main>
  
</template>

<script>

import { db } from './firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      lessons: []
    };
  },
  computed: {
    sortedLessons() {
      return this.lessons.sort((a, b) => a.order - b.order);
    }
  },
  created() {
    this.loadLessons();
  },
  methods: {
    async loadLessons() {
   try {
      const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
      this.lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Loaded lessons:", this.lessons); // Отладочный вывод
   } catch (error) {
      console.error("Error loading lessons", error);
      alert("Error loading lessons. Please try again.");
   }
},
    openLesson(lessonId) {
      this.$router.push({ name: 'LessonPage', params: { id: lessonId } });
    },
    returnHome() {
      this.$router.push({ name: 'Home' });
    }
  }
};
  

</script>

<style>

  /*** sidebar ***/

  .sidebar-title{
    font-size: 16px;
    font-weight: 600;
    color: #dee2e6;
  }

  .sidebar-list{
    margin-top: 20px;
    padding-left: 15px;
  }

  .sidebar-list li{
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #dee2e6;
    cursor: pointer;
  }

  .main-menu{
    margin-top: 20px;
    margin-bottom: 20px;
    padding-left: 15px;
  }

  .main-menu li{
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #dee2e6;
    cursor: pointer;
  }

  .form-exercises-wrapper{
    margin-top: 40px;
  }

  .current-lesson-build-wrapper{
    flex: 1;
  }
  .add-lesson-form-wrapper{
    flex: 1;
  }
  .lesson-creation-wrapper{
    padding-top: 30px;
    display: flex;
    column-gap: 30px;
  }
  .create-lesson-title{
    font-size: 16px;
    font-weight: 600;
    background: #dee2e6;
    color: #333333;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 15px;
    padding-left: 15px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  .create-lesson-form{
    width: 500px;
    max-width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }
  .form-lesson-title{
    height: 35px;
    width: 100%;
    padding: 6px;
  }
  .form-lesson-description{
    height: 100px;
    width: 100%;
    padding: 6px;
    resize: none;
  }
  .form-lesson-btn{
        height: 40px;
        line-height: 35px;
        cursor: pointer;
        border-radius: 50px;
        background: #1572e8;
        border-color: #1572e8;
        transition: all .5s ease;
        color: #ffffff;
        font-size: 16px;
        font-weight: 700;
        box-sizing: border-box;
        border: none;
        max-width: 300px;
        width: 100%;
  }
  .form-lesson-btn:hover{
      background: #2a79f0;
      border-color: #2a79f0;
  }

  /*** lesson creation dynamic form ***/
  .lesson-creation-dynamic-form{
    margin-top: 30px;
  }
</style>