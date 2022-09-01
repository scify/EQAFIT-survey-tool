<template>
  <div class="SelectSurvey">
    <div class="container">
      <div class="row mb-2">
        <div class="col">
          <h1>Online Quality Service:</h1>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col">
          <h2 class="fw-light">Self-assessment tool for VET providers</h2>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <p>
            For each scenario, choose the answer that you deem to be fitting.
            When you answer to all scenarios, you will be able to view your
            results, with tips on how to improve!
          </p>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <div class="container-fluid">
            <div class="row survey-selector-container">
              <div class="col-2 text-center offset-1">
                <p class="intro text-start">I am a...</p>
              </div>
              <div class="col-4 text-center">
                <VueMultiselect
                  v-model="selected"
                  :options="options"
                  :multiple="false"
                  :close-on-select="true"
                  track-by="name"
                  label="name"
                  placeholder="Select an option"
                  :searchable="false"
                  :allow-empty="false"
                >
                </VueMultiselect>
              </div>
              <div class="col-4 text-center">
                <button
                  :disabled="!selected"
                  class="btn btn-primary btn-start w-75"
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
              <a class="text-decoration-none" href="#" target="_blank"
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
import VueMultiselect from "vue-multiselect";

export default {
  name: "SelectSurvey",
  components: { VueMultiselect },
  emits: ["surveySelected"],
  data: function () {
    return {
      loading: false,
      surveyProvider: null,
      surveys: [],
      selected: null,
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
  },
};
</script>

<style lang="scss">
@import "SelectSurvey";
</style>
