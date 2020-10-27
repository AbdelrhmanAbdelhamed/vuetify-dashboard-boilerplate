<script>
import { isSecureURL } from '@utils'

import VueUploadComponent from 'vue-upload-component'

export default {
  name: 'FileUpload',
  components: {
    VueUploadComponent,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
      required: false,
      default: () => [],
    },
    inputFilter: {
      type: Function,
      required: false,
      default: function(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          // Add file

          if (this.fileUpload.files.length === this.fileUpload.maximum) {
            this.$dialog.notify.error(`Maximum number of files is ${this.fileUpload.maximum}`)
            return prevent()
          }

          if (newFile.size > this.maxSize * 1024 * 1024) {
            this.$dialog.notify.error(`File Size should NOT exceed ${this.maxSize} MB`)
            return prevent()
          }

          // Filter non-image file
          // Will not be added to files
          const fileExtension = newFile.name.replace(/.*\./, '').toLowerCase()
          if (!this.allowedExtensions.includes(fileExtension)) {
            this.$dialog.notify.error(`Only ${this.allowedExtensions} extensions are allowed`)
            return prevent()
          }

          // Create the 'blob' field for preview
          newFile.blob = ''
          const URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            // Use name as a blob if name is a valid https url and mark it as manually Added
            // Otherwise Create URL Object as a blob
            if (isSecureURL(newFile.file.name)) {
              newFile.blob = newFile.file.name
              newFile.manuallyAdded = true
            } else {
              newFile.blob = URL.createObjectURL(newFile.file)
              newFile.manuallyAdded = false
            }
          }
        }

        if (newFile && oldFile) {
          // Update file

          // Increase the version number
          newFile.version = newFile.version ? newFile.version++ : 0
        }

        if (!newFile && oldFile) {
          // Remove file

          // Refused to remove the file
          if (this.hideRemove) return prevent()
        }
      },
    },
    // size in MB
    maxSize: {
      type: Number,
      required: false,
      default: 5,
    },
    allowedExtensions: {
      type: Array,
      required: false,
      default: () => ['jpeg', 'jpg', 'png'],
    },
    previewAttrs: {
      type: Object,
      required: false,
      default: function() {
        return {
          contain: true,
          'aspect-ratio': this.$attrs.multiple ? 1 : 2.5,
          class: 'grey lighten-2',
        }
      },
    },
    dropActiveText: {
      type: String,
      required: false,
      default: function() {
        return this.$t('drop_active_text')
      },
    },
    dropInputText: {
      type: String,
      required: false,
      default: function() {
        return this.$t('drop_input_text')
      },
    },
    inputAttrs: {
      type: Object,
      required: false,
      default: function() {
        return {
          text: !this.$attrs.multiple,
          color: 'primary',
          fab: this.$attrs.multiple,
          'x-small': this.$attrs.multiple,
          elevation: '0',
        }
      },
    },
    removeText: {
      type: String,
      required: false,
      default: function() {
        return this.$t('remove_file')
      },
    },
    removeAttrs: {
      type: Object,
      required: false,
      default: () => ({
        text: true,
        color: 'error',
      }),
    },
    hideAdd: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideRemove: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      fileUpload: {},
    }
  },
  computed: {
    canShowImagePreview() {
      return this.attrs.accept.includes('image')
    },
    attrs() {
      return {
        accept: 'image/*',
        multiple: false,
        name: 'file',
        drop: false,
        ...this.$attrs,
      }
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (value) => {
          this.files = value
          this.$emit('input', this.files)
        },
      }
    },
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.setFiles(newVal)
      },
      deep: true,
    },
  },
  mounted() {
    // https://github.com/lian-yue/vue-upload-component/issues/254
    this.$nextTick(function() {
      this.fileUpload = this.$refs.fileUpload
      this.setFiles(this.value)
    })
  },
  methods: {
    setFiles(files) {
      const canAddFiles = typeof this.fileUpload.add === 'function' && files.length

      if (canAddFiles) {
        this.fileUpload.clear()
        this.files = this.fileUpload.add(files.map((file, index) => new File([index], file)))
      }
    },
    handleFileInput(newFile, oldFile, prevent) {
      const isFileChanged = (newFile, oldFile) => !oldFile || newFile.file !== oldFile.file

      const shouldEmitNewFile = newFile && isFileChanged(newFile, oldFile) && !newFile.manuallyAdded

      if (shouldEmitNewFile) {
        this.$emit('file-add', { newFile, oldFile, prevent })
      }
    },
    handleRemoveFile(file, index) {
      this.$emit('file-remove', { file, index })
      this.fileUpload.remove(file)
    },
  },
}
</script>

<template>
  <div :class="[$style.file]">
    <div v-if="fileUpload && fileUpload.dropActive" :class="[$style['drop-active']]">
      <slot name="drop-active" :dropActiveText="dropActiveText">
        <h3>{{ dropActiveText }}</h3>
      </slot>
    </div>

    <div
      v-show="!files.length || attrs.multiple"
      class="text-center"
      :class="[$style['input-label']]"
    >
      <VueUploadComponent
        ref="fileUpload"
        :value="files"
        v-bind="attrs"
        v-on="listeners"
        @input-filter="(newFile, oldFile, prevent) => inputFilter(newFile, oldFile, prevent)"
        @input-file="handleFileInput"
      >
        <div v-if="!hideAdd">
          <slot :inputAttrs="inputAttrs" :dropInputText="dropInputText">
            <div v-if="attrs.multiple" class="text-h4">
              {{ dropInputText }}
              <v-btn v-bind="inputAttrs">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-btn v-else v-bind="inputAttrs">
              {{ dropInputText }}
            </v-btn>
          </slot>
        </div>
      </VueUploadComponent>
    </div>

    <div v-if="files.length">
      <div v-if="files.length">
        <v-row>
          <v-col
            cols="12"
            :sm="attrs.multiple ? 6 : false"
            :offset-sm="attrs.multiple ? 3 : undefined"
          >
            <v-container fluid>
              <v-row>
                <v-col
                  v-for="(file, index) in files"
                  :key="file.blob"
                  :cols="attrs.multiple ? 4 : 12"
                  class="d-flex child-flex"
                >
                  <v-card flat tile>
                    <slot name="preview" :files="files" :file="file" :previewAttrs="previewAttrs">
                      <div v-if="canShowImagePreview" class="text-center">
                        <v-img :src="file.blob" v-bind="previewAttrs">
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular indeterminate color="grey"></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </div>
                      <div v-else class="text-center text-h3"
                        >{{ file.name }} ({{ file.size }} B)</div
                      >
                    </slot>
                    <div v-if="!hideRemove" class="d-flex justify-center text-center mt-1">
                      <slot
                        name="remove"
                        :files="files"
                        :file="file"
                        :index="index"
                        :removeFile="handleRemoveFile"
                        :removeAttrs="removeAttrs"
                        :removeText="removeText"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              v-bind="removeAttrs"
                              :icon="attrs.multiple"
                              @click.prevent="handleRemoveFile(file, index)"
                              v-on="attrs.multiple ? on : {}"
                            >
                              <v-icon v-if="attrs.multiple">mdi-delete</v-icon>
                              <span v-else>
                                {{ removeText }}
                              </span>
                            </v-btn>
                          </template>

                          <span> {{ removeText }} </span>
                        </v-tooltip>
                      </slot>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
/* stylelint-disable selector-class-pattern */

.input-label {
  label {
    cursor: pointer;
  }
}

.file .drop-active {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  text-align: center;
  background: #000;
  opacity: 0.6;
}

.file .drop-active h3 {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  padding: 0;
  margin: -0.5em 0 0;
  font-size: 40px;
  color: #fff;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
