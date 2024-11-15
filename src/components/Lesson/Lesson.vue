<template>

    <!-- LESSON DETAILS -->
    <div class="lesson-details">
      <h1 class="lesson-details__title">Lesson Details</h1>
      <div class="lesson-details__content">
        <p class="lesson-details__item"><strong class="lesson-details__item-label">Title:</strong> {{ lessonData.title }}</p>
        <p class="lesson-details__item"><strong class="lesson-details__item-label">Description:</strong> {{ lessonData.description }}</p>
      </div>
    </div>
    
    <!-- ADD NEW BLOCK SECTION -->
    <div class="add-new-block add-material-form">


      <!-- Modal for Material Selection -->
      <div v-if="showMaterialModal" class="modal" @click.self="closeMaterialModal">
        <div class="modal-content">
          <h2 class="modal-content__title">Select Material Type</h2>
          <div class="material-grid">
            <div
              v-for="type in materialOptions"
              :key="type.value"
              class="material-item"
              @click="selectMaterial(type.value)"
            >
              <!-- Replace with icons/images as appropriate -->
              <div class="material-icon">
                <font-awesome-icon :icon="iconMap[type.value]" v-if="iconMap[type.value]" />
              </div>
              <span class="material-title">{{ type.label }}</span>
            </div>
          </div>
          <button class="modal-close-btn" @click="closeMaterialModal">Cancel</button>
        </div>
      </div>

      <!-- CONDITIONAL INPUTS FOR MATERIAL TYPE -->

      <!-- 1 Main Title -->
      <div class="material-block" v-if="materialType === 'TITLE_MAIN'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="main-title">Main Title</label>
          <input id="main-title" class="material-block__input" v-model="formData.title" required />
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 2 Title with Image -->
      <div class="material-block" v-if="materialType === 'TITLE_IMAGE'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="image-title">Title with image</label>
          <input id="image-title" class="material-block__input" v-model="formData.title" required />
          <input class="material-block__input-file" type="file" @change="onFileChange('image', $event)" accept="image/*" />
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 3 Inner Title -->
      <div class="material-block" v-if="materialType === 'TITLE'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="inner-title">Inner title</label>
          <input id="inner-title" class="material-block__input" v-model="formData.title" required />
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 4 Word Example -->
      <div class="material-block" v-if="materialType === 'WORD_EXAMPLE'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="foreign-word">Foreign word</label>
          <input id="foreign-word" class="material-block__input" v-model="formData.word" required />

          <label class="material-block__label" for="translation-word">Translation</label>
          <input id="translation-word" class="material-block__input" v-model="formData.translation" required />

          <label class="material-block__label" for="transcription-word">Simple text</label>
          <input id="transcription-word" class="material-block__input" v-model="formData.transcription" required />

          <input class="material-block__input-file" type="file" @change="onFileChange('audio', $event)" accept="audio/*" />
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 5 Simple Textarea -->
      <div class="material-block" v-if="materialType === 'TEXT'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="text-area">Simple text</label>
          <textarea id="text-area"  class="material-block__input-textarea" v-model="formData.content" required></textarea>
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 6 Rich Text Editor -->
      <div class="material-block" v-if="materialType === 'TEXT_EDITOR'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="rich-text-editor">Rich Text Editor</label>
          <div class="quill-editor-wrapper">
            
            <quill-editor v-model:content="formData.editor_content" contentType="html" theme="snow"></quill-editor>

          </div>
          <p class="material-block__description">
            You can format text, add images, and more using this rich text editor.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 7 Title with Lines Decoration -->
      <div class="material-block" v-if="materialType === 'TITLE_UNDERLINE'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="title-lined">Title with Lines</label>
          <input id="title-lined" class="material-block__input" v-model="formData.content" required />
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 8 Subtitle -->
      <div class="material-block" v-if="materialType === 'SUBTITLE'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="subtitle-block">Subtitle</label>
          <input id="subtitle-block" class="material-block__input" v-model="formData.content" required />
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>

      <!-- 9 Example with Lines Decoration -->
      <div class="material-block" v-if="materialType === 'EXAMPLE_UNDERLINE'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="example-lined-block">Example with Lines</label>
          <input id="example-lined-block" class="material-block__input" v-model="formData.content" required />
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <button class="material-block__save-button" @click="addStudyMaterial">Save Block</button>
      </div>

      <!-- 10 Text with Image -->
      <div class="material-block" v-if="materialType === 'TEXT_IMAGE'">
        <div class="material-block__input-wrapper">
          <label class="material-block__label" for="texed-image-block">Text with Image</label>
          <input id="texed-image-block" class="material-block__input" v-model="formData.description" required />
          <p class="material-block__description">
            Nec mattis duis condimentum primis augue. Augue et vulputate primis eros et parturient. Eros purus fringilla phasellus ullamcorper erat.
          </p>
        </div>
        <div class="material-block_button-wrapper">
          <button class="material-block__cancel-button" @click="toggleCancel">Cancel</button>
          <button class="material-block__save-button" @click="addStudyMaterial">Save</button>
        </div>
      </div>
      
    </div>

    <!-- LESSON BLOCKS GRID -->
    <div class="lessons-blocks">

      <div class="lessons-blocks__title-wrapper">
          <div class="lessons-blocks__header">
            <font-awesome-icon icon="fa-book" />
            <h2 class="lessons-blocks__title">Lesson Blocks</h2>
          </div>
          <button class="add-new-block__btn" @click="openMaterialModal">
            <span>Add New Block</span>
          </button>
      </div>

      <div class="lessons-blocks__subtitle-wrapper">
          <div class="lessons-blocks__subtitle-item">#</div>
          <div class="lessons-blocks__subtitle-item">Label</div>
      </div>

      <VueDraggableNext v-model="lessonData.studyMaterials" @end="onDragEnd">

        <div class="lesson-materials" v-for="(material, index) in lessonData.studyMaterials" :key="material.id">
          
          <!-- DISPLAYING ELEMENTS IN EDIT MODE -->
          
          <div v-if="material.isEditing">

            <input v-model="material.title" placeholder="Title" v-if="material.type === 'TITLE_MAIN'" />
            
            <input v-model="material.content" placeholder="Content" v-if="material.type === 'TEXT'" />

            <!-- Rich Text Editor -->

            <div v-if="material.type === 'TEXT_EDITOR'">
              <label>Edit Content:</label>
              <QuillEditor
                v-model="material.editor_content"
                :options="{ theme: 'snow' }"
              />
            </div>
           
            <!-- Add input for TITLE_IMAGE -->
            <div v-if="material.type === 'TITLE_IMAGE'" >
              <input v-model="material.title" placeholder="Image Title" />
              <input v-model="material.imageUrl" placeholder="Image URL" />
            </div>

            <!-- Add input for TEXT_IMAGE -->
            <div v-if="material.type === 'TEXT_IMAGE'" >
              <input v-model="material.description" placeholder="Image Description" />
              <input v-model="material.imageUrl" placeholder="Image URL" />
            </div>

            <!-- Add input for TITLE -->
            <input v-model="material.title" placeholder="Title" v-if="material.type === 'TITLE'" /> 

            <!-- Add input for TITLE_UNDERLINE -->
            <input v-model="material.title" placeholder="Title Underline" v-if="material.type === 'TITLE_UNDERLINE'" />
            
            <!-- Новый блок для редактирования WORD_EXAMPLE -->
            <div v-if="material.type === 'WORD_EXAMPLE'">
              <input v-model="material.word" placeholder="Word" />
              <input v-model="material.translation" placeholder="Translation" />
              <input v-model="material.transcription" placeholder="Transcription" />
              <input v-model="material.audioUrl" placeholder="Audio URL" />
            </div>
            
            <button @click="saveMaterial(index)">Save</button>
            <button @click="cancelEditMaterial(index)">Cancel</button>
          </div>

          <!-- DISPLAYING ELEMENTS IN USER MODE -->
          <div class="lesson-block-rows lesson-materials__guts" v-else>

            <!-- 1 Main Title -->
            <div v-if="material.type === 'TITLE_MAIN'" class="lesson-block-item lesson-materials__title_main">
              <div class="lesson-block-item__header" @click="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'"/>
                  <h3>Main Title</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                ref="content"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__title_main-title" v-if="material.title">{{ material.title }}</p>
                </div>
              </div>
            </div>

            <!-- 2 Title with Image -->
            <div v-if="material.type === 'TITLE_IMAGE'" class="lesson-block-item lesson-materials__title_image">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Title with Image</h3>
                </div>
              </div>
              
                <div
                  class="lesson-block-item__content"
                  :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                  ref="content"
                >
                  <div class="lesson-block-item__content-inner">
                    <img class="lesson-materials__title_image-image" v-if="material.imageUrl" :src="material.imageUrl" :alt="material.title">
                    <p class="lesson-materials__title_image-title" v-if="material.title">{{ material.title }}</p>
                  </div>
                </div>
            </div>

            <!-- 3 Inner Title -->
            <div v-if="material.type === 'TITLE'" class="lesson-block-item lesson-materials__title">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Inner Title</h3>
                </div>
              </div>
              
              <div
                class="lesson-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                ref="content"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__title" v-if="material.title">{{ material.title }}</p>
                </div>
              </div>
            </div>

            <!-- 4 Word Example -->
            <div v-if="material.type === 'WORD_EXAMPLE'" class="lesson-block-item lesson-materials__word">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Word Example</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                ref="content"
              >
                <div class="lesson-block-item__content-inner">
                  <div class="lesson-block-item__content-item">
                    <p class="lesson-materials__word">{{ material.word }}</p>
                    <p class="lesson-materials__translation">{{ material.translation }}</p>
                    <p class="lesson-materials__transcription">{{ material.transcription }}</p>
                    <audio v-if="material.audioUrl" :src="material.audioUrl" controls></audio>
                  </div>
                  <div class="lesson-block-item__content-item-options">
                    <button title="Edit lesson block" class="edit-material-btn" @click="editMaterial(index)">
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button title="Remove lesson block" class="remove-material-btn" @click="removeMaterial(index)">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5 Simple Textarea -->
            <div v-if="material.type === 'TEXT'" class="lesson-block-item lesson-materials__text">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Simple Textarea</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                ref="content"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__content" v-if="material.content">{{ material.content }}</p>
                </div>
              </div>
            </div>

            <!-- 6 Rich Text Editor -->
            <div v-if="material.type === 'TEXT_EDITOR'" class="lesson-block-item lesson-materials__text_editor">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Rich Text Editor</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                ref="content"
              >
                <div class="lesson-block-item__content-inner">
                  <div v-html="material.editor_content"></div>
                </div>
              </div>
            </div>

            <!-- 7 Title with Lines Decoration -->
            <div v-if="material.type === 'TITLE_UNDERLINE'" class="lesson-block-item lesson-materials__title_underline">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Lines Decorated Title</h3>
                </div>
              </div>
              
                <div
                  class="lesson-block-item__content"
                  :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                  ref="content"
                >       
                  <div class="lesson-block-item__content-inner">       
                    <p class="lesson-materials__title_underline-content" v-if="material.content">{{ material.content }}</p>
                  </div>
                </div>
            </div>

            <!-- 8 Subtitle -->
            <div v-if="material.type === 'SUBTITLE'" class="lesson-block-item lesson-materials__subtitle">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Subtitle</h3>
                </div>
              </div>
              
                <div
                  class="lesson-block-item__content"
                  :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                  ref="content"
                >
                  <div class="lesson-block-item__content-inner">
                    <p class="lesson-materials__subtitle-text" v-if="material.content">{{ material.content }}</p>
                  </div>
                </div>
            </div>

            <!-- 9 Example with Lines Decoration -->
            <div v-if="material.type === 'EXAMPLE_UNDERLINE'" class="lesson-block-item lesson-materials__example_underlined">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Lines Decorated Example</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                ref="content"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__example_underlined-text" v-if="material.content">{{ material.content }}</p>
                </div>
              </div>
            </div>

            <!-- 10 Text with Image -->
            <div v-if="material.type === 'TEXT_IMAGE'" class="lesson-block-item lesson-materials__text_image">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Text with Image</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                ref="content"
              >
                <div class="lesson-block-item__content-inner">
                  <img class="lesson-materials__text_image-image" v-if="material.imageUrl" :src="material.imageUrl" :alt="material.description">
                  <p class="lesson-materials__text_image-description">{{ material.description }}</p>
                </div>
              </div>
            </div>

            <!-- TITLE_LINED Внимание! Я не уверен, что этот блок будет использоваться поэтому пока оставлю его под вопросом -->
            <div v-if="material.type === 'TITLE_LINED'" class="lesson-block-item lesson-materials__title_lined">
              <div class="lesson-block-item__header" @click.stop="toggleAccordion(index)">
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Excepteur sint</h3>
                </div>
              </div>
                <div
                  class="lesson-block-item__content"
                  :style="{ height: isExpanded[index] ? 'auto' : '0px', overflow: 'hidden', transition: 'height 0.3s ease' }"
                  ref="content"
                >      
                  <div class="lesson-block-item__content-inner">        
                    <p class="lesson-materials__title" v-if="material.content">{{ material.content }}</p>
                  </div>
                </div>
            </div>

          </div>

        </div>        

      </VueDraggableNext>

    </div>

</template>

<script>

import { db } from '../../firebase/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { VueDraggableNext } from 'vue-draggable-next';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QuillEditor } from '@vueup/vue-quill';
import 'quill/dist/quill.snow.css';
    
    export default {

        components: {
            VueDraggableNext,
            QuillEditor,
        },

        props: {
            lessonId: {
                type: String,
                required: true,
            },
        },

        data() {
            return {
                showMaterialModal: false,
                cancelButton: true,

                lessonData: {
                    title: '',
                    description: '',
                    order: 0,
                    studyMaterials: [],
                    exercises: [] // Added exercises to match the expected data structure
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
                },

                isExpanded: [],
            };
        },

        created() {
            this.formData = this.resetFormData();
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

        methods:{

            toggleCancel() {
                this.cancelButton = !this.cancelButton; // Toggle between true and false
                this.materialType = '';
            },

            toggleAccordion(index) {
                if (index >= 0 && index < this.isExpanded.length) {
                    this.isExpanded[index] = !this.isExpanded[index];
                } else {
                    console.warn("toggleAccordion: Invalid index", index);
                }
            },

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
                        this.lessonData = lessonSnapshot.data();
                        this.$emit('update:lessonData', this.lessonData); 
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
                    alert("Material successfully added!");
                } catch (error) {
                    console.error("Error adding material:", error);
                    alert("An error occurred while adding the material. Please try again.");
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
                    TITLE: ["title"],
                    TITLE_IMAGE: ["title"],
                    WORD_EXAMPLE: ["word", "translation", "transcription"],
                    TEXT: ["content"],
                    TEXT_EDITOR: ["editor_content"],
                    TITLE_UNDERLINE: ["title"],
                    SUBTITLE: ["content"],
                    EXAMPLE_UNDERLINE: ["content"],
                    TEXT_IMAGE: ["description"],
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
                const storage = getStorage();
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
                    this.lessonData.studyMaterials.splice(index, 1);
                    const lessonRef = doc(db, "lessons", this.lessonId);
                    updateDoc(lessonRef, {
                    studyMaterials: this.lessonData.studyMaterials
                    })
                    .catch(error => {
                    console.error("Error removing material:", error);
                    });
                }
            },
        }

    }

</script>

<style lang="scss" scoped>
  @use 'lesson.styles' as *;
</style>