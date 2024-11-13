<template>
  <div class="lesson-builder-wrapper">
    <Lesson :lessonId="lessonId" />
    <Quize
      :lessonId="lessonId"
      :lessonData="lessonData"
      @update-lesson-data="updateLessonData"
    />
  </div>
</template>

<script>
import Lesson from '../Lesson/Lesson.vue';
import Quize from '../Quize/Quize.vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default {
  data() {
    return {
      lessonData: {
        exercises: [],
      },
    };
  },
  components: {
    Lesson,
    Quize,
  },
  props: {
    lessonId: {
      type: String,
      required: true,
    },
  },
  async created() {
    await this.fetchLessonData();
  },
  methods: {
    async fetchLessonData() {
      try {
        const lessonRef = doc(db, 'lessons', this.lessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
          const data = lessonSnap.data();
          this.lessonData = data;
        } else {
          console.log('No such lesson!');
        }
      } catch (error) {
        console.error('Error fetching lesson data:', error);
      }
    },
    updateLessonData(newExercise) {
      this.lessonData.exercises.push(newExercise);
    },
    updateLessonExercises(updatedExercises) {
      this.lessonData.exercises = updatedExercises;
    },
  },
};

</script>

<style lang="scss" scoped>
  @use 'lessonPage.styles' as *;
</style>