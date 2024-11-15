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

          <label class="material-block__label" for="transcription-word">Transcription</label>
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
          <input id="title-lined" class="material-block__input" v-model="formData.title" required />
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

            <!-- 1 Main Title -->
            <div class="material-block"  v-if="material.type === 'TITLE_MAIN'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" for="main-title-edit">Main Title</label>
                <input id="main-title-edit" class="material-block__input" v-model="material.title" placeholder="Main Title" required />
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 2 Title with Image -->
            <div class="material-block"  v-if="material.type === 'TITLE_IMAGE'">
              <div class="material-block__input-wrapper">

                <label class="material-block__label" for="image-title-edit">Image Title</label>
                <input id="image-title-edit" class="material-block__input" v-model="material.title" placeholder="Image Title" required />

                <label class="material-block__label" for="image-image-edit">Add Image</label>
                <input id="image-image-edit" v-model="material.imageUrl" placeholder="Add Image" />

                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 3 Inner Title -->
            <div class="material-block"  v-if="material.type === 'TITLE'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" for="inner-title-edit">Inner Title</label>
                <input id="inner-title-edit" class="material-block__input" v-model="material.title" placeholder="Inner Title" v-if="material.type === 'TITLE'" required/> 
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 4 Word Example -->
            <div class="material-block"  v-if="material.type === 'WORD_EXAMPLE'">
              <div class="material-block__input-wrapper">

                <label class="material-block__label" for="word-example-word-edit">Word</label>
                <input id="word-example-word-edit" class="material-block__input" v-model="material.word" placeholder="Word" />

                <label class="material-block__label" for="word-example-translation-edit">Translation</label>
                <input id="word-example-translation-edit" class="material-block__input" v-model="material.translation" placeholder="Translation" />

                <label class="material-block__label" for="word-example-transcription-edit">Transcription</label>
                <input id="word-example-transcription-edit" class="material-block__input" v-model="material.transcription" placeholder="Transcription" />

                <label class="material-block__label" for="word-example-audio-edit">Audio URL</label>
                <input id="word-example-audio-edit" class="material-block__input" v-model="material.audioUrl" placeholder="Audio URL" />

                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 5 Simple Textarea -->
            <div class="material-block"  v-if="material.type === 'TEXT'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" for="simple-text-edit">Simple Text</label>
                <textarea id="simple-text-edit"  class="material-block__input-textarea" v-model="material.content" v-if="material.type === 'TEXT'"></textarea>
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 6 Rich Text Editor -->
            <div class="material-block"  v-if="material.type === 'TEXT_EDITOR'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" >Rich Text Editor</label>
                <div class="quill-editor-wrapper">
                  <quill-editor v-model="material.editor_content" contentType="html" theme="snow"></quill-editor>
                </div>
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>
           
            <!-- 7 Title with Lines Decoration -->
            <div class="material-block"  v-if="material.type === 'TITLE_UNDERLINE'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" for="title-lined-edit">Lines Decorated Title</label>
                <input id="title-lined-edit" class="material-block__input" v-model="material.title" required />
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 8 Subtitle -->
            <div class="material-block" v-if="material.type === 'SUBTITLE'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" for="subtitle-block-edit">Subtitle</label>
                <input id="subtitle-block-edit" class="material-block__input" v-model="material.content" required />
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 9 Example with Lines Decoration -->
            <div class="material-block" v-if="material.type === 'EXAMPLE_UNDERLINE'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" for="example-lined-block-edit">Example with Lines</label>
                <input id="example-lined-block-edit" class="material-block__input" v-model="material.content" required />
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

            <!-- 10 Text with Image -->
            <div class="material-block" v-if="material.type === 'TEXT_IMAGE'">
              <div class="material-block__input-wrapper">
                <label class="material-block__label" for="texed-image-block-edit">Text with Image</label>
                <input id="texed-image-block-edit" class="material-block__input" v-model="material.description" required />
                <label class="material-block__label" for="texed-image-block-edit">Text with Image</label>
                <input id="texed-image-block-edit" class="material-block__input" v-model="material.imageUrl" required />
                <div class="material-block_button-wrapper">
                  <button class="material-block__cancel-button" @click="cancelEditMaterial(index)">Cancel</button>
                  <button class="material-block__save-button" @click="saveMaterial(index)">Save</button>
                </div>
              </div>
            </div>

          </div>

          <!-- DISPLAYING ELEMENTS IN USER MODE -->
          <div class="lesson-block-rows lesson-materials__guts" v-else>

            <!-- 1 Main Title -->
            <div v-if="material.type === 'TITLE_MAIN'" class="lesson-block-item lesson-materials__title_main">
              <div
                class="lesson-block-item__header"
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Main Title</h3>
                </div>
              </div>

              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__title_main-title" v-if="material.title">{{ material.title }}</p>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </div>
                
              </div>

            </div>

            <!-- 2 Title with Image -->
            <div v-if="material.type === 'TITLE_IMAGE'" class="lesson-block-item">
              <div 
                class="lesson-block-item__header" 
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Title with Image</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <img class="lesson-materials__title_image-image" v-if="material.imageUrl" :src="material.imageUrl" :alt="material.title">
                  <p class="lesson-materials__title_image-title" v-if="material.title">{{ material.title }}</p>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3 Inner Title -->
            <div v-if="material.type === 'TITLE'" class="lesson-block-item">
              <div class="lesson-block-item__header"
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Inner Title</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__title" v-if="material.title">{{ material.title }}</p>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4 Word Example -->
            <div v-if="material.type === 'WORD_EXAMPLE'" class="lesson-block-item">
              <div class="lesson-block-item__header" 
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Word Example</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <div class="lesson-block-item__content-item">
                    <p class="lesson-materials__word">{{ material.word }}</p>
                    <p class="lesson-materials__translation">{{ material.translation }}</p>
                    <p class="lesson-materials__transcription">{{ material.transcription }}</p>
                    <audio v-if="material.audioUrl" :src="material.audioUrl" controls></audio>
                  </div>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5 Simple Textarea -->
            <div v-if="material.type === 'TEXT'" class="lesson-block-item">
              <div 
                class="lesson-block-item__header" 
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Simple Textarea</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__content" v-if="material.content">{{ material.content }}</p>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
                </div>
                
              </div>
            </div>

            <!-- 6 Rich Text Editor -->
            <div v-if="material.type === 'TEXT_EDITOR'" class="lesson-block-item">
              <div 
                class="lesson-block-item__header" 
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Rich Text Editor</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <div v-html="material.editor_content"></div>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7 Title with Lines Decoration -->
            <div v-if="material.type === 'TITLE_UNDERLINE'" class="lesson-block-item">
              <div 
                class="lesson-block-item__header" 
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Lines Decorated Title</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >       
                <div class="lesson-block-item__content-inner">       
                  <p class="lesson-materials__title_underline-content" v-if="material.title">{{ material.title }}</p>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 8 Subtitle -->
            <div v-if="material.type === 'SUBTITLE'" class="lesson-block-item">
              <div 
                class="lesson-block-item__header" 
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Subtitle</h3>
                </div>
              </div>
                <div
                  class="lesson-block-item__content"
                  :class="{ expanded: isExpanded[index] }"
                  :ref="`content-${index}`"
                >

                  <div class="lesson-block-item__content-inner">
                    <p class="lesson-materials__subtitle-text" v-if="material.content">{{ material.content }}</p>
                    <div class="material-block_button-wrapper">
                      <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                        Edit
                      </button>
                      <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                        Delet
                      </button>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 9 Example with Lines Decoration -->
            <div v-if="material.type === 'EXAMPLE_UNDERLINE'" class="lesson-block-item">
              <div 
                class="lesson-block-item__header"
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Lines Decorated Example</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <p class="lesson-materials__example_underlined-text" v-if="material.content">{{ material.content }}</p>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
                </div>
                
              </div>
            </div>

            <!-- 10 Text with Image -->
            <div v-if="material.type === 'TEXT_IMAGE'" class="lesson-block-item">
              <div 
                class="lesson-block-item__header" 
                :class="{ active: isExpanded[index] }"
                @click="toggleAccordion(index)"
                role="button"
                :aria-expanded="isExpanded[index]"
                tabindex="0"
                @keyup.enter.space.prevent="toggleAccordion(index)"
              >
                <span class="lesson-block-item__order-number">{{ material.order }}</span>
                <div class="lesson-block-item__title">
                  <font-awesome-icon :icon="isExpanded[index] ? 'chevron-up' : 'chevron-down'" />
                  <h3>Text with Image</h3>
                </div>
              </div>
              <div
                class="lesson-block-item__content"
                :class="{ expanded: isExpanded[index] }"
                :ref="`content-${index}`"
              >
                <div class="lesson-block-item__content-inner">
                  <img class="lesson-materials__text_image-image" v-if="material.imageUrl" :src="material.imageUrl" :alt="material.description">
                  <p class="lesson-materials__text_image-description">{{ material.description }}</p>
                  <div class="material-block_button-wrapper">
                    <button title="Edit Block" class="edit-material-btn" @click="editMaterial(index)">
                      Edit
                    </button>
                    <button title="Remove Block" class="remove-material-btn" @click="removeMaterial(index)">
                      Delet
                    </button>
                  </div>
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
import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid
import { debounce } from 'lodash'; // Make sure to install lodash

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
                exercises: []
            },

            materialType: '',
            formData: this.resetFormData(), // Optional: Remove if not used elsewhere

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
            storage: getStorage(), // Initialize storage once
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

    methods: {

        toggleCancel() {
            this.cancelButton = !this.cancelButton;
            this.materialType = '';
        },

        toggleAccordion(index) {
          this.isExpanded[index] = !this.isExpanded[index];
          
          this.$nextTick(() => {
            const content = this.$refs[`content-${index}`][0];
            if (this.isExpanded[index]) {
              const height = content.scrollHeight + 'px';
              content.style.maxHeight = height;
            } else {
              content.style.maxHeight = '0px';
            }
          });
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

                    // Initialize lessonData
                    this.lessonData = lessonSnapshot.data();
                    
                    // Ensure studyMaterials is an array
                    this.lessonData.studyMaterials = this.lessonData.studyMaterials ? this.lessonData.studyMaterials : [];
                    
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
                
                // Fetch current studyMaterials
                const lessonSnapshot = await getDoc(lessonRef);
                let currentMaterials = [];
                if (lessonSnapshot.exists()) {
                    currentMaterials = lessonSnapshot.data().studyMaterials || [];
                }

                // Append new material
                currentMaterials.push(newMaterial);

                // Update Firestore
                await updateDoc(lessonRef, {
                    studyMaterials: currentMaterials
                });

                // Update local state
                this.lessonData.studyMaterials = currentMaterials;
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
                id: uuidv4(), // Ensure uniqueness
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

        async onFileChange(type, event) {
            const file = event.target.files[0];
            if (type === 'audio') {
                this.formData.audioFile = file;
            } else if (type === 'image') {
                this.formData.imageFile = file;
            }
        },

        async uploadFile(file, folder) {
            const filePath = `lessons/${folder}/${file.name}`;
            const fileRef = ref(this.storage, filePath);
            await uploadBytes(fileRef, file);
            return getDownloadURL(fileRef);
        },

        onDragEnd() {
            this.lessonData.studyMaterials.forEach((material, index) => {
                material.order = index;
            });
            this.saveMaterialsOrder();
        },

        saveMaterialsOrder: debounce(async function () {
            try {
                const lessonRef = doc(db, "lessons", this.lessonId);
                await updateDoc(lessonRef, {
                    studyMaterials: this.lessonData.studyMaterials
                });
            } catch (error) {
                console.error("Error saving materials order:", error);
            }
        }, 300), // Debounced to prevent excessive writes

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

        // Transition Hooks for Smooth Height Animation
        beforeEnter(el) {
          el.style.height = '0px';
        },
        enter(el, done) {
          const height = el.scrollHeight;
          el.style.transition = 'height 0.15s ease';
          el.style.height = height + 'px';
          el.addEventListener('transitionend', done);
        },
        afterEnter(el) {
          el.style.height = 'auto';
        },
        beforeLeave(el) {
          el.style.height = el.scrollHeight + 'px';
        },
        leave(el, done) {
          el.style.transition = 'height 0.15 ease';
          el.style.height = '0px';
          el.addEventListener('transitionend', done);
        },
        afterLeave(el) {
          el.style.height = '0px';
        },
    }

}
</script>

<style lang="scss" scoped>
  @use 'lesson.styles' as *;
</style>