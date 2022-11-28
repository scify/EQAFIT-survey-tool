<template>
  <div class="SelectSurvey w-100">
    <div class="container">
      <div class="row mb-4">
        <h1>
          {{ $t("online_quality_service") }}<br />
          <span>{{ $t("self_assessment_tool_title") }}</span>
        </h1>
        <p class="mt-5" v-html="$t('intro_message')"></p>
        <br />
      </div>
      <div class="row mb-3">
        <div class="col">
          <div class="container-fluid p-0" ref="select">
            <div class="row mb-4">
              <div class="col">
                <h3>
                  <b>{{ $t("i_am_a") }}</b>
                </h3>
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
                  {{ $t("start") }}
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
              {{ $t("i_consent") }}
              <a
                class="text-decoration-none"
                href="https://docs.google.com/document/d/1miM6bfhRJprlWe-6iECZGcwxZpb1SIPiJyhY0bTa7sA/"
                target="_blank"
              >
                {{ $t("privacy_policy") }}
              </a>
            </label>
            <span
              v-if="shouldShowMessageToAcceptPrivacyPolicy()"
              class="text-danger ms-1"
            >
              {{ $t("privacy_required") }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SurveyProvider from "@/services/SurveyProvider";

export default {
  name: "SelectSurvey",
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
          name: null,
          value: 1,
        },
        {
          name: null,
          value: 2,
        },
        {
          name: null,
          value: 3,
        },
      ],
    };
  },
  created() {
    this.surveyProvider = new SurveyProvider();
  },
  mounted() {
    this.setTranslatableResources();
    this.loading = false;
    this.scrollTo("select");
    this.surveys = this.surveyProvider.getSurveys();
  },
  methods: {
    setTranslatableResources() {
      this.options[0].name = this.$t("student");
      this.options[1].name = this.$t("company");
      this.options[2].name = this.$t("vet_provider");
    },
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
