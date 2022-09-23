<template>
  <div class="SelectSurvey w-100">
    <div class="container">
      <div class="row mb-4">
        <h1>
          Online Quality Service:<br />
          <span>Self-assessment tool for VET Providers</span>
        </h1>
        <p class="mt-5">
          During this year we will develop the Online Quality Service, a strong
          self-assessment tool for VET Providers to boost their overall quality
          and efficiency. This tool will include all the results from the
          previous work done in the project, such as:
          <b>
            the quality criteria, the guidelines and tools, the tracking system
            and the model for feedback loop.
          </b>
        </p>
        <br />
      </div>
      <div class="row mb-3">
        <div class="col">
          <div class="container-fluid p-0" ref="select">
            <!--            <div class="row survey-selector-container">-->
            <!--              <div class="col-2 text-center offset-1">-->
            <!--                <p class="intro text-start">I am a...</p>-->
            <!--              </div>-->
            <!--              <div class="col-4 text-center">-->
            <!--                <VueMultiSelect-->
            <!--                  v-model="selected"-->
            <!--                  :options="options"-->
            <!--                  :multiple="false"-->
            <!--                  :close-on-select="true"-->
            <!--                  track-by="name"-->
            <!--                  label="name"-->
            <!--                  placeholder="Select an option"-->
            <!--                  :searchable="false"-->
            <!--                  :allow-empty="false"-->
            <!--                >-->
            <!--                </VueMultiSelect>-->
            <!--              </div>-->
            <!--              <div class="col-4 text-center">-->
            <!--                <button-->
            <!--                  :disabled="!selected"-->
            <!--                  class="btn btn-primary btn-start w-75"-->
            <!--                  @click="selectSurvey"-->
            <!--                >-->
            <!--                  Start-->
            <!--                  <span-->
            <!--                    class="spinner-border spinner-border-sm ms-1"-->
            <!--                    role="status"-->
            <!--                    aria-hidden="true"-->
            <!--                    v-if="loading"-->
            <!--                  ></span>-->
            <!--                </button>-->
            <!--              </div>-->
            <!--            </div>-->
            <div class="row mb-4">
              <div class="col">
                <h3><b>I am a...</b></h3>
              </div>
            </div>
            <div class="row select-survey-container mb-4">
              <div
                class="col-4"
                v-for="(survey, index) in options"
                :key="'survey_' + index"
              >
                <div
                  @click="setSelected(survey)"
                  class="target-group-box mb-5"
                  :class="{ selected: selected.value === survey.value }"
                >
                  <h2 class="mt-2">
                    <b>{{ survey.name }}</b>
                  </h2>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-lg-4 col-md-6 col-sm-12 text-center mx-auto">
                <button
                  :disabled="!selected.value"
                  class="btn btn-primary btn-start w-100 btn-lg btn-block"
                  @click="selectSurvey"
                >
                  Start
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
      <div class="row">
        <div class="col">
          <div class="form-check small">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="consentChecked"
              id="flexCheckDefault"
            />
            <label class="form-check-label" for="flexCheckDefault">
              I consent with the
              <a
                class="text-decoration-none"
                href="https://docs.google.com/document/d/1miM6bfhRJprlWe-6iECZGcwxZpb1SIPiJyhY0bTa7sA/"
                target="_blank"
                >Privacy Policy.</a
              >
            </label>
            <span
              v-if="shouldShowMessageToAcceptPrivacyPolicy()"
              class="text-danger ms-1"
            >
              It is required to accept the privacy policy.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SurveyProvider from "@/services/SurveyProvider";
// import VueMultiSelect from "vue-multiselect";

export default {
  name: "SelectSurvey",
  // components: { VueMultiSelect },
  emits: ["surveySelected"],
  data: function () {
    return {
      loading: false,
      surveyProvider: null,
      surveys: [],
      selected: {},
      consentChecked: false,
      buttonClicked: false,
      options: [
        {
          name: "Student",
          value: 1,
        },
        {
          name: "Company",
          value: 2,
        },
        {
          name: "VET provider",
          value: 3,
        },
      ],
    };
  },
  created() {
    this.surveyProvider = new SurveyProvider();
  },
  mounted() {
    this.loading = false;
    this.scrollTo("select");
    this.surveys = this.surveyProvider.getSurveys();
  },
  methods: {
    selectSurvey() {
      let instance = this;
      this.buttonClicked = true;
      if (!this.shouldShowMessageToAcceptPrivacyPolicy()) {
        this.loading = true;
        setTimeout(function () {
          instance.$emit("surveySelected", instance.selected.value);
          instance.loading = false;
        }, 1000);
      }
    },
    shouldShowMessageToAcceptPrivacyPolicy() {
      return !this.consentChecked && this.buttonClicked;
    },
    setSelected(survey) {
      this.selected = survey;
    },
    scrollTo(refName) {
      const element = this.$refs[refName];
      const top = element.offsetTop;
      setTimeout(function () {
        window.scrollTo(0, top);
      }, 300);
    },
  },
};
</script>

<style lang="scss">
@import "SelectSurvey";
</style>
