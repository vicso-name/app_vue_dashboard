<template>
    <div class="add-lesson-form-wrapper">

        <h2 class="create-lesson-title">Create New Lesson</h2>
        
        <form class="create-lesson-form" @submit.prevent="createLesson">
            <input class="form-lesson-title" v-model="lessonData.title" placeholder="Lesson Title" required />
            <textarea class="form-lesson-description" v-model="lessonData.description" placeholder="Lesson Description" required></textarea>
            <button class="form-lesson-btn" type="submit">Create Lesson</button>
        </form>

    </div>

    <div class="current-lesson-build-wrapper">

        <div v-if="lessonId" class="form-study-materials-wrapper">

            <h2 class="create-lesson-title">Add Study Materials to Lesson</h2>

            <form class="lesson-creation-dynamic-form" @submit.prevent="addStudyMaterial">

            <select v-model="materialType" @change="clearFormData" required>
                <option disabled value="">Select Lesson Element</option>
                <option v-for="type in materialOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>

            <!-- Dynamic Input Fields Based on materialType -->
                <div v-if="materialType === 'TITLE_MAIN'">
                <input v-model="formData.title" placeholder="Enter Main Title" required />
                </div>
                
                <div v-if="materialType === 'TITLE_IMAGE'">
                <input v-model="formData.title" placeholder="Enter Title for Image" required />
                <input type="file" @change="onFileChange('image', $event)" accept="image/*" required />
                </div>

                <div v-if="materialType === 'TITLE'">
                <input v-model="formData.title" placeholder="Enter Title" required />
                </div>

                <div v-if="materialType === 'WORD_EXAMPLE'">
                    <input v-model="formData.word" placeholder="Enter Word" required />
                    <input v-model="formData.translation" placeholder="Enter Translation" required />
                    <input v-model="formData.transcription" placeholder="Enter Transcription" required />
                    <input type="file" @change="onFileChange('audio', $event)" accept="audio/*" />
                </div>

                <div v-if="materialType === 'TEXT'">
                    <textarea v-model="formData.content" placeholder="Enter Text Content" required></textarea>
                </div>

                <div v-if="materialType === 'TITLE_LINED'">
                    <textarea v-model="formData.content" placeholder="Enter Lined Title Content" required></textarea>
                </div>

                <div v-if="materialType === 'SUBTITLE'">
                    <textarea v-model="formData.content" placeholder="Enter Subtitle Content" required></textarea>
                </div>

                <div v-if="materialType === 'EXAMPLE_UNDERLINE'">
                    <textarea v-model="formData.content" placeholder="Enter Underlined Example" required></textarea>
                </div>

                <div v-if="materialType === 'TITLE_UNDERLINE'">
                    <textarea v-model="formData.content" placeholder="Enter Underlined Title" required></textarea>
                </div>

                <div v-if="materialType === 'TEXT_IMAGE'">
                    <textarea v-model="formData.description" placeholder="Enter Description" required></textarea>
                    <input type="file" @change="onFileChange('image', $event)" accept="image/*" />
                </div>

                <!-- Add Material Button -->
                <button type="submit">Add Selected Material</button>
            </form>

            <h3>Current Study Materials:</h3>

            <ul>
                <li v-for="material in studyMaterials" :key="material.id">
                    {{ material.word || material.content || material.title }} - {{ material.translation }}
                    <button @click="deleteMaterial(material.id)">Remove</button>
                </li>
            </ul>

        </div>

        <div v-if="lessonId" class="form-exercises-wrapper">
      
          <h2 class="create-lesson-title">Add Exercises to Lesson</h2>

          <form @submit.prevent="addExercise">

            <select v-model="exerciseType" required>
              <option disabled value="">Select Exercise Type</option>
              <option v-for="type in exerciseOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>

            <div v-if="exerciseType">
              <input v-model="exerciseContent" placeholder="Enter Exercise Content" required />

              <!-- Additional fields for specific exercise types -->
              <div v-if="exerciseType === 'MULTIPLE_CHOICE' || exerciseType === 'MULTIPLE_CHOICE_SECOND'">
                <input v-model="exerciseTip" placeholder="Enter Tip" />
                <input v-model="exerciseChoices" placeholder="Enter Choices (comma-separated)" />
                <input v-model="exerciseCorrectAnswer" placeholder="Enter Correct Answer" />
              </div>

              <!-- Fields for TRUE_FALSE -->
              <div v-if="exerciseType === 'TRUE_FALSE'">
                <input type="checkbox" v-model="exerciseCorrectAnswer" />
                <label>Correct Answer (True/False)</label>
              </div>

              <!-- Other exercise-specific fields as needed -->

              <button type="submit">Add Exercise</button>
            </div>
          </form>

          <h3>Current Exercises:</h3>
          <ul>
            <li v-for="exercise in exercises" :key="exercise.id">
              {{ exercise.content }} - {{ exercise.type }}
              <button @click="deleteExercise(exercise.id)">Remove</button>
            </li>
          </ul>
        </div>
    </div>

   
</template>

<script>
import { db } from '../firebase/firebase';
import { collection, addDoc, doc, deleteDoc, getDocs, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  data() {
    return {
      lessonData: {
        title: '',
        description: '',
        order: 0,
        studyMaterials: []
      },
      lessonId: null,
      materialType: '',
      materialOptions: [
        { value: 'TITLE_MAIN', label: 'Main Title' },
        { value: 'WORD_EXAMPLE', label: 'Word Example' },
        { value: 'TEXT', label: 'Text Content' },
        { value: 'TITLE_IMAGE', label: 'Title with Image' },
        { value: 'TITLE_LINED', label: 'Lined Title' },
        { value: 'SUBTITLE', label: 'Subtitle' },
        { value: 'EXAMPLE_UNDERLINE', label: 'Example Underline' },
        { value: 'TITLE', label: 'Title' },
        { value: 'TEXT_IMAGE', label: 'Text with Image' },
        { value: 'TITLE_UNDERLINE', label: 'Underlined Title' }
      ],
      studyMaterials: [],
      lessons: [],
      formData: this.resetFormData(),
      maxOrder: 0,
      exercises: [],
      exerciseType: '',
      exerciseContent: '',
      exerciseTip: '',
      exerciseChoices: '',
      exerciseCorrectAnswer: '',
      exerciseOptions: [
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
        { value: 'MULTIPLE_CHOICE_SECOND', label: 'Multiple Choice Second' },
        { value: 'TRUE_FALSE', label: 'True/False' }
      ]
    };
  },

  async created() {
    await this.fetchLessons();
  },

  methods: {
    resetFormData() {
      return {
        title: '',
        word: '',
        translation: '',
        transcription: '',
        content: '',
        description: '',
        imageFile: null,
        audioFile: null
      };
    },

    async fetchLessons() {
      try {
        const lessonsCollection = collection(db, 'lessons');
        const lessonsSnapshot = await getDocs(lessonsCollection);
        this.lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.maxOrder = this.lessons.reduce((max, lesson) => Math.max(max, lesson.order), 0);
      } catch (error) {
        this.handleError("Failed to fetch lessons", error);
      }
    },

    async createLesson() {
      try {
        this.lessonData.order = this.maxOrder + 1;
        const lessonRef = await addDoc(collection(db, 'lessons'), this.lessonData);
        this.lessonId = lessonRef.id;
        this.studyMaterials = [];
        alert("Lesson created successfully. You can now add study materials to it.");
        this.maxOrder = this.lessonData.order;
      } catch (error) {
        this.handleError("Failed to create lesson", error);
      }
    },

    handleError(message, error) {
      console.error(message, error);
      alert(`${message}. Please try again.`);
    },

    async onFileChange(type, event) {
      const file = event.target.files[0];
      if (type === 'audio') {
        this.formData.audioFile = file;
      } else if (type === 'image') {
        this.formData.imageFile = file;
      }
    },

    async uploadFile(file, folder) {
      const storage = getStorage();
      const filePath = `alphabet_lessons/${folder}/${file.name}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    },

    async addStudyMaterial() {
      if (!this.lessonId) {
        alert("Please create a lesson before adding materials.");
        return;
      }

      try {
        const newMaterial = await this.prepareStudyMaterial();
        const lessonRef = doc(db, 'lessons', this.lessonId);

        await updateDoc(lessonRef, {
          studyMaterials: arrayUnion(newMaterial)
        });

        this.studyMaterials.push(newMaterial);
        this.formData = this.resetFormData();
      } catch (error) {
        this.handleError("Error adding material to lesson", error);
      }
    },

    async prepareStudyMaterial() {
      const order = this.studyMaterials.length;
      const studyMaterial = {
        type: this.materialType,
        order
      };

      if (this.formData.audioFile) {
        studyMaterial.audioUrl = await this.uploadFile(this.formData.audioFile, 'audio');
      }
      if (this.formData.imageFile) {
        studyMaterial.imageUrl = await this.uploadFile(this.formData.imageFile, 'images');
      }

      const materialFields = {
        TITLE_MAIN: ["title"],
        TITLE_IMAGE: ["title"],
        TITLE: ["title"],
        WORD_EXAMPLE: ["word", "translation", "transcription"],
        TEXT: ["content"],
        TITLE_LINED: ["content"],
        SUBTITLE: ["content"],
        EXAMPLE_UNDERLINE: ["content"],
        TITLE_UNDERLINE: ["content"],
        TEXT_IMAGE: ["description"]
      };

      materialFields[this.materialType].forEach(field => {
        studyMaterial[field] = this.formData[field];
      });

      return studyMaterial;
    },

    async addExercise() {
      if (!this.lessonId) {
        alert("Please create a lesson before adding exercises.");
        return;
      }

      try {
        const exerciseData = this.prepareExerciseData();
        const lessonRef = doc(db, 'lessons', this.lessonId);

        await updateDoc(lessonRef, {
          exercises: arrayUnion(exerciseData)
        });

        this.exercises.push(exerciseData);
        this.resetExerciseForm();
      } catch (error) {
        this.handleError("Error adding exercise to lesson", error);
      }
    },

    prepareExerciseData() {
      const additionalData = {};

      if (this.exerciseType === 'MULTIPLE_CHOICE' || this.exerciseType === 'MULTIPLE_CHOICE_SECOND') {
        additionalData.choices = this.exerciseChoices.split(',').map(choice => choice.trim());
        additionalData.correctAnswer = this.exerciseCorrectAnswer;
      } else if (this.exerciseType === 'TRUE_FALSE') {
        additionalData.correctAnswer = this.exerciseCorrectAnswer;
      }

      return {
        id: this.exercises.length + 1,
        type: this.exerciseType,
        content: this.exerciseContent,
        tip: this.exerciseTip,
        additionalData,
        score: 0
      };
    },

    resetExerciseForm() {
      this.exerciseType = '';
      this.exerciseContent = '';
      this.exerciseTip = '';
      this.exerciseChoices = '';
      this.exerciseCorrectAnswer = '';
    },

    async deleteExercise(exerciseId) {
      if (!this.lessonId) return;

      try {
        const lessonRef = doc(db, 'lessons', this.lessonId);
        const lessonSnapshot = await getDoc(lessonRef);
        const lessonData = lessonSnapshot.data();

        const updatedExercises = lessonData.exercises.filter(ex => ex.id !== exerciseId);

        await updateDoc(lessonRef, { exercises: updatedExercises });
        this.exercises = updatedExercises;
      } catch (error) {
        this.handleError("Error deleting exercise", error);
      }
    },

    async deleteMaterial(materialId) {
      if (!this.lessonId) return;

      try {
        const lessonRef = doc(db, 'lessons', this.lessonId);
        const lessonSnapshot = await getDoc(lessonRef);
        const lessonData = lessonSnapshot.data();

        const updatedMaterials = lessonData.studyMaterials.filter(
          material => material.id !== materialId
        );

        await updateDoc(lessonRef, { studyMaterials: updatedMaterials });
        this.studyMaterials = updatedMaterials;
      } catch (error) {
        this.handleError("Error deleting material", error);
      }
    }
  }
};
</script>
