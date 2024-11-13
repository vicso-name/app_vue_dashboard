import { db } from '../../firebase/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { VueDraggableNext } from 'vue-draggable-next';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QuillEditor } from '@vueup/vue-quill';
import 'quill/dist/quill.snow.css';
export default {

  components: {
    VueDraggableNext,
    QuillEditor // Register the QuillEditor component
  },
  
  props: ['lessonId'],
  data() {
    return {

      showMaterialModal: false,
      showQuizzesModal: false,
      showDropdown: false,
      exerciseCorrectAnswer: '',
      cancelButton: true,

      lessonData: {
        title: '',
        description: '',
        order: 0,
        studyMaterials: [],
        exercises: []
      },

      materialType: '',
      formData: this.resetFormData(),

      materialOptions: [
        { value: 'TITLE_MAIN', label: 'Main Title' },
        { value: 'TITLE', label: 'Inner Title' },
        { value: 'TITLE_IMAGE', label: 'Title with Image' },
        { value: 'WORD_EXAMPLE', label: 'Word Example' },
        { value: 'TEXT', label: 'Simple Textarea' },
        { value: 'TITLE_UNDERLINE', label: 'Title with Lines' },
        { value: 'SUBTITLE', label: 'Subtitle' },
        { value: 'EXAMPLE_UNDERLINE', label: 'Example with Lines' },
        { value: 'TEXT_IMAGE', label: 'Text with Image' },
        { value: 'TEXT_EDITOR', label: 'Rich Text Editor' },
        // Add other options as needed...
      ],

      exercises: [],
      exerciseType: '',
      exerciseContent: '',
      exerciseTip: '',
      exerciseChoices: '',
      exerciseCorrectAnswer: '',
      exerciseOptions: [
        { value: 'TRUE_FALSE', label: 'True/False' },
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
        // Add other options as needed...
      ],

      iconMap: {
        TITLE_MAIN: 'fa-heading',
        TITLE: 'fa-font',
        WORD_EXAMPLE: 'fa-book-open',
        TEXT: 'fa-file-alt',
        TITLE_IMAGE: 'fa-image',
        TITLE_UNDERLINE: 'fa-underline',
        SUBTITLE: 'fa-text-height',
        EXAMPLE_UNDERLINE: 'fa-highlighter',
        TEXT_IMAGE: 'fa-file-image',
        TEXT_EDITOR: 'fa-edit',
        // Add other options as needed...
      },

      iconExerciceMap: {
        TRUE_FALSE: 'fa-heading',
        MULTIPLE_CHOICE: 'fa-font',
        // Add other options as needed...
      },

      isExpanded: []
    };
  },

  created() {
    this.formData = this.resetFormData(); // Properly initialize formData here
    this.fetchLesson();
  },

  watch: {
    lessonId: {
      immediate: true,
      handler() {
        this.fetchLesson();
      }
    }
  },

  methods: {


    toggleCancel() {
      this.cancelButton = !this.cancelButton; // Toggle between true and false
      this.materialType = '';
    },

    handleError(message, error) {
      console.error(message, error);
      alert(`${message}. Please try again.`);
    },

    //Lesson Logic
    openMaterialModal() {
      this.showMaterialModal = true;
    },
    closeMaterialModal() {
      this.showMaterialModal = false;
    },

    selectMaterial(type) {
      this.materialType = type;
      this.cancelButton = true;
      this.closeMaterialModal();
    },

    //Quize Logic
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

    //Dropdown List Logic 
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    selectAnswer(option) {
      this.exerciseCorrectAnswer = option;
      this.showDropdown = false; // Close the dropdown after selection
    },
  
    resetExerciseForm() {
      this.exerciseType = '';
      this.exerciseContent = '';
      this.exerciseTip = '';
      this.exerciseChoices = '';
      this.exerciseCorrectAnswer = '';
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
    
        // Update local state
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
  
    resetFormData() {
      return {
        title: '',
        word: '',
        translation: '',
        transcription: '',
        content: '',
        editor_content: '',
        description: '',
        imageFile: null,
        audioFile: null
      };
    },

    async fetchLesson() {
      try {
        if (!this.lessonId) {
          console.error("Lesson ID is not provided!");
          return;
        }
    
        const lessonRef = doc(db, "lessons", this.lessonId);
        const lessonSnapshot = await getDoc(lessonRef);
    
        if (lessonSnapshot.exists()) {
          this.lessonData = lessonSnapshot.data();
          
          // Ensure studyMaterials is an array
          this.lessonData.studyMaterials = this.lessonData.studyMaterials ? this.lessonData.studyMaterials : [];
          
          this.lessonData.studyMaterials = this.lessonData.studyMaterials.map((material, index) => ({
            ...material,
            isEditing: false,
            order: material.order ?? index
          }));
          this.lessonData.studyMaterials.sort((a, b) => a.order - b.order);
          this.isExpanded = new Array(this.lessonData.studyMaterials.length).fill(false);
        } else {
          alert("Lesson not found");
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      }
    },
    
    toggleAccordion(index) {
      if (index >= 0 && index < this.isExpanded.length) {
        // Toggle using standard array update for Vue 3
        this.isExpanded[index] = !this.isExpanded[index];
      } else {
        console.warn("toggleAccordion: Invalid index", index);
      }
    },

    async onFileChange(type, event) {
      const file = event.target.files[0];
      if (type === 'audio') {
        this.formData.audioFile = file;
      } else if (type === 'image') {
        this.formData.imageFile = file;
      }
    },

    async addStudyMaterial() {

      if (!this.lessonId) {
        alert("Please select or create a lesson first.");
        return;
      }
    
      try {
        console.log('Form Data Content:', this.formData.content);
        const newMaterial = await this.prepareStudyMaterial();
        const lessonRef = doc(db, 'lessons', this.lessonId);
        await updateDoc(lessonRef, {
          studyMaterials: arrayUnion(newMaterial)
        });
        this.lessonData.studyMaterials.push(newMaterial);
        this.formData = this.resetFormData();
        alert("Material successfully added!"); // Success alert
      } catch (error) {
        console.error("Error adding material:", error);
        alert("An error occurred while adding the material. Please try again."); // Error alert
      }

    },

    async prepareStudyMaterial() {
      const order = this.lessonData.studyMaterials.length;
      console.log(order);
    
      const newMaterial = {
        type: this.materialType,
        order
      };
    
      // Debugging line to check formData values
      console.log('Form Data:', this.formData);
    
      if (this.formData.imageFile) {
        newMaterial.imageUrl = await this.uploadFile(this.formData.imageFile, 'images');
      }
      if (this.formData.audioFile) {
        newMaterial.audioUrl = await this.uploadFile(this.formData.audioFile, 'audio');
      }
    
      const fields = {
        TITLE_MAIN: ["title"],
        TITLE: ["title"],
        TITLE_IMAGE: ["title"],
        WORD_EXAMPLE: ["word", "translation", "transcription"],
        TEXT: ["content"],
        TEXT_EDITOR: ["editor_content"],
        TITLE_UNDERLINE: ["title"],
        SUBTITLE: ["content"],
        EXAMPLE_UNDERLINE: ["content"],
        TEXT_IMAGE: ["description"],
        // Add other mappings as required...
      };
    
      if (fields[this.materialType]) {
        fields[this.materialType].forEach(field => {
          newMaterial[field] = this.formData[field];
        });
      } else {
        throw new Error("Invalid material type selected");
      }
    
      return newMaterial;
    },

    async uploadFile(file, folder) {
      const storage = getStorage(); // Corrected this line
      const filePath = `lessons/${folder}/${file.name}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    },

    onDragEnd() {
      this.lessonData.studyMaterials.forEach((material, index) => {
        material.order = index;
      });
      this.saveMaterialsOrder();
    },

    async saveMaterialsOrder() {
      try {
        const lessonRef = doc(db, "lessons", this.lessonId);
        await updateDoc(lessonRef, {
          studyMaterials: this.lessonData.studyMaterials
        });
      } catch (error) {
        console.error("Error saving materials order:", error);
      }
    },

    editMaterial(index) {
      this.lessonData.studyMaterials[index].isEditing = true;
    },

    async saveMaterial(index) {
      const material = this.lessonData.studyMaterials[index];
      material.isEditing = false;

      const lessonRef = doc(db, "lessons", this.lessonId);
      await updateDoc(lessonRef, {
        studyMaterials: this.lessonData.studyMaterials
      });
    },

    cancelEditMaterial(index) {
      this.lessonData.studyMaterials[index].isEditing = false;
      this.fetchLesson();
    },
    removeMaterial(index) {
          const confirmation = confirm("Are you sure you want to remove this study material?");
          if (confirmation) {
            // Remove the item locally
            this.lessonData.studyMaterials.splice(index, 1);

            // Update the database
            const lessonRef = doc(db, "lessons", this.lessonId);
            updateDoc(lessonRef, {
              studyMaterials: this.lessonData.studyMaterials
            })
            .then(() => {
              console.log("Material removed successfully");
            })
            .catch(error => {
              console.error("Error removing material:", error);
            });
          }
    },
  }
}