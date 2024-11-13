import { db } from '../../firebase/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { VueDraggableNext } from 'vue-draggable-next';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  components: {
    VueDraggableNext
  },
  
  props: ['lessonId'],

  data() {
    return {
      showQuizzesModal: false,
      quizeType: '',
      formData: {}, // Initialize as an empty object
      exerciseOptions: [
        { value: 'TRUE_FALSE', label: 'True/False' },
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
        // Add other options as needed...
      ],
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

    //Lesson Logic
    openMaterialModal() {
      this.showMaterialModal = true;
    },
    closeMaterialModal() {
      this.showMaterialModal = false;
    },

    selectMaterial(type) {
      this.materialType = type;
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
      this.quizeType = type;
      this.closeMaterialModal();
    },

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
        const newMaterial = await this.prepareStudyMaterial();
        const lessonRef = doc(db, 'lessons', this.lessonId);
        await updateDoc(lessonRef, {
          studyMaterials: arrayUnion(newMaterial)
        });
        this.lessonData.studyMaterials.push(newMaterial);
        this.formData = this.resetFormData();
      } catch (error) {
        console.error("Error adding material:", error);
      }
    },

    async prepareStudyMaterial() {
      const order = this.lessonData.studyMaterials.length;
      const newMaterial = {
        type: this.materialType,
        order
      };

      if (this.formData.imageFile) {
        newMaterial.imageUrl = await this.uploadFile(this.formData.imageFile, 'images');
      }
      if (this.formData.audioFile) {
        newMaterial.audioUrl = await this.uploadFile(this.formData.audioFile, 'audio');
      }

      const fields = {
        TITLE_MAIN: ["title"],
        TITLE_IMAGE: ["title"],
        WORD_EXAMPLE: ["word", "translation", "transcription"],
        TEXT: ["content"],
        // Add other mappings as needed...
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