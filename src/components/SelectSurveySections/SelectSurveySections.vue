<template>
  <div class="SelectSurveySections">
    <div class="container" v-if="survey.survey">
      <div class="row mb-2">
        <div class="col">
          <h1>Survey: {{ survey.name }}</h1>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <p v-if="survey.survey" v-html="survey.survey.description"></p>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <div class="container-fluid">
            <div class="row survey-selector-container">
              <div
                class="col-lg-2 col-md-3 text-center offset-lg-1 offset-md-0"
              >
                <p class="intro text-start">
                  Choose more sections for your quiz:
                </p>
              </div>
              <div class="col-6 text-center">
                <VueMultiselect
                  v-model="selected"
                  :options="surveySections"
                  :multiple="true"
                  :close-on-select="false"
                  track-by="name"
                  label="name"
                  placeholder="Select the sections"
                  :searchable="false"
                  :allow-empty="true"
                  @remove="removeOption"
                >
                </VueMultiselect>
              </div>
              <div class="col-3 text-center">
                <button
                  :disabled="!selected"
                  class="btn btn-primary btn-start w-75"
                  @click="selectSurveySections"
                >
                  Take the Quiz
                  <span
                    class="spinner-border spinner-border-sm ms-1"
                    role="status"
                    aria-hidden="true"
                    v-if="loading"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="toast position-absolute"
        :class="{ show: toastVisible }"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">Note</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body" v-html="toastMessage"></div>
      </div>
      <div style="margin-top: 7rem">
        <div
          class="row mb-5"
          v-for="(page, index) in survey.survey.pages"
          :key="'section_' + index"
        >
          <div class="col">
            <h4 class="mb-2 section-title">{{ page.name }}</h4>
            <p>{{ survey.section_descriptions[index] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueMultiselect from "vue-multiselect";
import SurveyProvider from "@/services/SurveyProvider";

export default {
  name: "SelectSurveySections",
  components: { VueMultiselect },
  emits: ["surveySectionsSelected"],
  props: {
    surveyId: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      toastMessage: null,
      toastVisible: false,
      loading: false,
      surveyProvider: null,
      survey: {},
      surveySections: [],
      selected: [],
    };
  },
  created() {
    this.surveyProvider = new SurveyProvider();
  },
  mounted() {
    this.loading = false;
    this.survey = this.surveyProvider.getSurvey(this.surveyId);

    for (let i = 0; i < this.survey.survey.pages.length; i++) {
      const section = {
        index: i,
        name: this.survey.survey.pages[i].name,
        required: i === 0,
      };
      this.surveySections.push(section);
      if (i === 0) {
        this.selected.unshift(section);
      }
    }
  },
  methods: {
    selectSurveySections() {
      if (this.selected.length === 1) {
        this.showToast("You should select <b>2</b> or more sections.");
      } else {
        const ids = this.selected.map((item) => item.id);
        let pagesToKeep = [];
        for (let i = 0; i < ids.length; i++) {
          pagesToKeep.push(this.survey.survey.pages[i]);
        }
        this.survey.survey.pages = pagesToKeep;
        this.$emit("surveySectionsSelected", this.survey);
      }
    },
    removeOption(option) {
      if (option.required) {
        this.selected.unshift(option);
        this.showToast("This Section is required.");
      }
    },
    showToast(message) {
      this.toastVisible = true;
      this.toastMessage = message;
      let instance = this;
      setTimeout(function () {
        instance.toastVisible = false;
      }, 5000);
    },
  },
};
</script>
<style lang="scss">
@import "SelectSurveySections";
</style>