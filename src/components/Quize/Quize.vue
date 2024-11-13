<template>
    <!-- QUIZ SECTION -->

      <h2 class="quize-details__title">Quiz Section</h2>

      <!-- Add New Quiz Section -->
      <div class="add-new-block add-material-form">

      

      <!-- Modal for Quiz Selection -->
      
      <div v-if="showQuizzesModal" class="modal" @click.self="closeQuizeModal">
          <div class="modal-content">
          <h2 class="modal-content__title">Select Quiz Type</h2>
          <div class="material-grid">
              <div
              v-for="type in exerciseOptions"
              :key="type.value"
              class="material-item"
              @click="selectQuize(type.value)"
              >
              <!-- Replace with icons/images as appropriate -->
              <div class="material-icon">
                  <font-awesome-icon :icon="iconExerciceMap[type.value]" v-if="iconExerciceMap[type.value]" />
              </div>
              <span class="material-title">{{ type.label }}</span>
              </div>
          </div>
          <button class="modal-close-btn" @click="closeQuizeModal">Close</button>
          </div>
      </div>

      <!-- Conditional Inputs for Quiz Type -->

      <!-- True/False Quiz -->
      <div class="material-block" v-if="exerciseType === 'TRUE_FALSE' && cancelButton == true">
        <div class="material-block__input-wrapper">

          <label class="material-block__label" for="exercise-content">Enter Statement</label>
          <input class="material-block__input" id="exercise-content" v-model="exerciseContent" placeholder="Enter the statement" required />
        
          <label class="material-block__label" for="correct-answer">Correct Answer</label>
          <div class="dropdown">

            <div class="dropdown__selected" @click="toggleDropdown">
              {{ exerciseCorrectAnswer ? exerciseCorrectAnswer : 'Select Answer' }}
              <font-awesome-icon 
                :icon="showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'" 
                class="dropdown__icon"
              />
            </div>
            
            <ul v-show="showDropdown" class="dropdown__list">
              <li 
                v-for="option in ['true', 'false']" 
                :key="option" 
                @click="selectAnswer(option)"
                :class="{'dropdown__item--selected': exerciseCorrectAnswer === option}" 
                class="dropdown__item"
              >
                {{ option }}
              </li>
            </ul>
          </div>

          <label class="material-block__label" for="correct-answer">Hint</label>
          <input class="material-block__input" v-model="exerciseTip" placeholder="Enter Tip" />
          <p class="material-block__description">Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.</p>

        </div>

        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addExercise">Save</button>
        </div>

      </div>

      <!-- Multiple Choice Quiz -->
      <div class="material-block" v-if="exerciseType === 'MULTIPLE_CHOICE' && cancelButton == true">

        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="exercise-content">Question</label>
          <input class="material-block__input" id="exercise-content" v-model="exerciseContent" placeholder="Enter the question" required/>

          <label class="material-block__label" for="choices">Choices (comma-separated)</label>
          <input class="material-block__input" id="choices" v-model="exerciseChoices" placeholder="Enter choices separated by commas" required/>

          <label class="material-block__label" for="correct-answer">Correct Answer</label>
          <input class="material-block__input" id="correct-answer" v-model="exerciseCorrectAnswer" placeholder="Enter the correct answer" required/>

          <label class="material-block__label" for="correct-answer">Hint</label>
          <input class="material-block__input" v-model="exerciseTip" placeholder="Enter Tip" />
        </div>

        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addExercise">Save</button>
        </div>
        
      </div>




    <!-- QUIZES GRID -->
    <div class="quize-blocks">

      <div class="quize-blocks__title-wrapper">
          <div class="quize-blocks__header">
            <font-awesome-icon icon="fa-check-circle" />
            <h2 class="quize-blocks__title">Quiz Blocks</h2>
          </div>
          <button class="add-new-block__btn" @click="openQuizeModal">
            <span>Add New Quiz</span>
          </button>
      </div>

      <div class="quize-blocks__subtitle-wrapper">
          <div class="quize-blocks__subtitle-item">#</div>
          <div class="quize-blocks__subtitle-item">Label</div>
      </div>

      <VueDraggableNext v-model="localExercises" @end="onDragEnd">

        <div class="quize-materials" v-for="(exercise, index) in localExercises" :key="exercise.id">
          <!-- DISPLAYING ELEMENTS IN EDIT MODE -->
          <div v-if="exercise.isEditing">
            <!-- Ваш код для режима редактирования -->
          <div v-if="exercise.isEditing">
              <input v-model="exercise.content" placeholder="Exercise Content" />
              <input v-model="exercise.tip" placeholder="Tip" />
              <input
              v-model="exercise.correctAnswer"
              placeholder="Correct Answer"
              v-if="exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'TRUE_FALSE'"
              />
              <!-- Add more fields as needed -->
              <button @click="saveExercise(index)">Save</button>
              <button @click="cancelEditExercise(index)">Cancel</button>

          </div>
          </div>

          <!-- DISPLAYING ELEMENTS IN USER MODE -->
          <div class="quize-block-rows quize-materials__guts" v-else>

            <div v-if="exercise.type === 'TRUE_FALSE'" class="quize-block-item quize-materials__title_main">
              <div class="quize-block-item__header" @click="toggleAccordion(index)">
                <span class="quize-block-item__order-number">{{ exercise.order }}</span>
                <div class="quize-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'"/>
                  <h3>True or False</h3>
                </div>
              </div>
              <div
                class="quize-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                :ref="'content' + index"
              >
                <div class="quize-block-item__content-inner">
                  <p class="quize-materials__title_main-title" v-if="exercise.content">{{ exercise.content }}</p>
                </div>
                <button @click="editExercise(index)">Edit</button>
              </div>
            </div>

            <div v-if="exercise.type === 'MULTIPLE_CHOICE'" class="quize-block-item quize-materials__title_main">
              <div class="quize-block-item__header" @click="toggleAccordion(index)">
                <span class="quize-block-item__order-number">{{ exercise.order }}</span>
                <div class="quize-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'"/>
                  <h3>Multiple Choice</h3>
                </div>
              </div>
              <div
                class="quize-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                :ref="'content' + index"
              >
                <div class="quize-block-item__content-inner">
                  <p class="quize-materials__title_main-title" v-if="exercise.content">{{ exercise.content }}</p>
                </div>
                <button @click="editExercise(index)">Edit</button>
              </div>
            </div>


          

          </div>

        </div>

      </VueDraggableNext>

    </div>

</div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default {
  components: {
    VueDraggableNext,
  },
  props: {
    lessonId: {
      type: String,
      required: true,
    },
    lessonData: {
      type: Object,
      default: () => ({ exercises: [] }),
    },
  },
  data() {
    return {
      localExercises: [],

      showQuizzesModal: false,
      showDropdown: false,
      cancelButton: true,
 
      exerciseType: '',
      exerciseContent: '',
      exerciseTip: '',
      exerciseChoices: '',
      exerciseCorrectAnswer: '',

      exerciseOptions: [
        { value: 'TRUE_FALSE', label: 'True/False' },
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
      ],

      iconExerciceMap: {
        TRUE_FALSE: 'fa-heading',
        MULTIPLE_CHOICE: 'fa-font',
      },

      isExpanded: [],
    };
  },
  created() {
    // Инициализируем localExercises данными из родительского компонента
    this.localExercises = this.lessonData.exercises || [];
    this.isExpanded = this.localExercises.map(() => false);
  },
  watch: {
    localExercises(newVal) {
      // Обновляем isExpanded при изменении localExercises
      this.isExpanded = newVal.map(() => false);
    },
    'lessonData.exercises': {
      handler(newVal) {
        this.localExercises = newVal;
      },
      immediate: true,
    },
  },
  methods: {

    toggleAccordion(index) {
        if (index >= 0 && index < this.isExpanded.length) {
            this.isExpanded[index] = !this.isExpanded[index];
        } else {
            console.warn("toggleAccordion: Invalid index", index);
        }
    },

    toggleCancel() {
      this.cancelButton = !this.cancelButton; // Toggle between true and false
      this.materialType = '';
    },
    openQuizeModal() {
      this.showQuizzesModal = true;
    },
    closeQuizeModal() {
      this.showQuizzesModal = false;
    },
    selectQuize(type) {
      this.exerciseType = type;
      this.cancelButton = true;
      this.closeQuizeModal();
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectAnswer(option) {
      this.exerciseCorrectAnswer = option;
      this.showDropdown = false;
    },
    resetExerciseForm() {
      this.exerciseType = '';
      this.exerciseContent = '';
      this.exerciseTip = '';
      this.exerciseChoices = '';
      this.exerciseCorrectAnswer = '';
    },
    async onDragEnd() {
      // Обновляем порядок упражнений
      this.localExercises.forEach((exercise, index) => {
        exercise.order = index;
      });

      // Обновляем данные в Firestore
      try {
        const lessonRef = doc(db, 'lessons', this.lessonId);
        await updateDoc(lessonRef, {
          exercises: this.localExercises,
        });

        // Эмитируем событие для обновления данных в родительском компоненте
        this.$emit('update-lesson-data-exercises', this.localExercises);
      } catch (error) {
        console.error('Error updating exercises order', error);
      }
    },
    async addExercise() {
      if (!this.lessonId) {
        alert("Please create a lesson before adding exercises.");
        return;
      }
      
      if (!this.exerciseType || !this.exerciseContent) {
        alert("Please fill out all required fields before adding the exercise.");
        console.error("Missing fields:", {
          exerciseType: this.exerciseType,
          exerciseContent: this.exerciseContent
        });
        return;
      }
      
      try {
        const exerciseData = this.prepareExerciseData();
        console.log('Prepared exercise data:', exerciseData);
        const lessonRef = doc(db, 'lessons', this.lessonId);
      
        await updateDoc(lessonRef, {
          exercises: arrayUnion(exerciseData)
        });
        // Эмитируем событие для обновления данных в родительском компоненте
        this.$emit('update-lesson-data', exerciseData);
        this.resetExerciseForm();
        this.isExpanded.push(false);
      } catch (error) {
        console.error("Error adding exercise to lesson", error);
      }
    },
    prepareExerciseData() {
      const additionalData = {};

      if (this.exerciseType === 'MULTIPLE_CHOICE') {
        additionalData.choices = this.exerciseChoices.split(',').map(choice => choice.trim());
        additionalData.correctAnswer = this.exerciseCorrectAnswer;
      } else if (this.exerciseType === 'TRUE_FALSE') {
        additionalData.correctAnswer = this.exerciseCorrectAnswer;
      }

      return {
        id: Date.now(),
        type: this.exerciseType,
        content: this.exerciseContent,
        tip: this.exerciseTip,
        additionalData,
        score: 0,
        isEditing: false,
      };
    },

    editExercise(index) {
      this.localExercises[index].isEditing = true;
    },

    async saveExercise(index) {
      // Сохранение изменений
      this.localExercises[index].isEditing = false;

      // Обновляем данные в Firestore
      try {
        const lessonRef = doc(db, 'lessons', this.lessonId);
        await updateDoc(lessonRef, {
          exercises: this.localExercises,
        });
      } catch (error) {
        console.error('Error saving exercise', error);
      }
    },
    cancelEditExercise(index) {
      this.localExercises[index].isEditing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  @use 'quize.styles' as *;
</style>