<template>
  <div class="SelectSurveySections w-100">
    <div class="container" v-if="survey.survey">
      <div class="row mb-2">
        <div class="col">
          <h1>Survey: {{ survey.name }}</h1>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col">
          <p v-if="survey.survey" v-html="survey.survey.description"></p>
        </div>
      </div>
      <div class="row mb-0">
        <div class="col">
          <h5 v-html="$t('select_sections')"></h5>
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
      <div style="margin-top: 5rem">
        <div
          class="row mb-5 p-4 section"
          :class="{ selected: surveySections[index].selected }"
          v-for="(page, index) in surveyPages"
          :key="'section_' + index"
        >
          <div class="col-1">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="surveySections[index].selected"
              :id="'check_section_' + index"
              @change="onCheckedChange(surveySections[index], $event)"
            />
          </div>
          <div class="col-11">
            <h4 class="mb-2 section-title">{{ page.name }}</h4>
            <p>
              {{ survey.section_descriptions[page.id - 1].description }}
            </p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-lg-4 col-md-6 col-sm-12 text-center mx-auto">
            <button
              :disabled="!surveySections.length"
              class="btn btn-primary btn-lg btn-block btn-start w-100"
              @click="proceed"
            >
              {{ $t("take_the_quiz") }}
              <span
                class="spinner-border spinner-border-sm ms-1"
                role="status"
                aria-hidden="true"
                v-if="loading"
              ></span>
            </button>
          </div>
        </div>
        <div class="row mb-5">
          <div class="col">
            <p
              v-if="errorMessage"
              class="text-danger ms-1"
              v-html="errorMessage"
            ></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    ref="anonymousModeModal"
    tabindex="-1"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ $t("data_save_confirmation") }}
          </h5>
          <button
            @click="anonymousModeModal.hide()"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body pb-5">
          <div class="container">
            <div class="row my-4">
              <div class="col-8 mx-auto text-start">
                <h5>{{ $t("data_consent_title") }}</h5>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-8 mx-auto text-start">
                <p v-html="$t('data_consent_message')"></p>
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-8 mx-auto text-start">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="consentMode"
                    id="flexCheckDefault"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    {{ $t("data_consent_label") }}
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-5 col-md-8 col-sm-12 text-center mx-auto">
                <button
                  type="button"
                  class="btn btn-primary w-100 btn-lg"
                  @click="selectSurveySections"
                >
                  {{ $t("continue") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SurveyProvider from "@/services/SurveyProvider";
import { Modal } from "bootstrap";
import _ from "lodash";

export default {
  name: "SelectSurveySections",
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
      anonymousModeModal: null,
      consentMode: true,
      errorMessage: null,
      surveyPages: [],
    };
  },
  created() {
    const instance = this;
    this.surveyProvider = new SurveyProvider();
    // eslint-disable-next-line no-unused-vars
    this.globalEventBus.on("lang_changed", function (lang) {
      instance.surveyProvider.setSurveyTranslations();
      instance.setUpSurveySections();
    });
  },
  mounted() {
    this.loading = false;
    this.anonymousModeModal = new Modal(this.$refs.anonymousModeModal);
    this.setUpSurveySections();
  },
  methods: {
    setUpSurveySections() {
      this.surveyProvider.setSurveyTranslations();
      this.survey = this.surveyProvider.getSurvey(this.surveyId);
      this.surveyPages = this.survey.survey.pages;
      this.surveySections = [];
      for (let i = 0; i < this.survey.survey.pages.length; i++) {
        const section = {
          id: i,
          name: this.survey.survey.pages[i].name,
          required: i === 0,
          selected: i === 0,
        };
        this.surveySections.push(section);
      }
    },
    proceed() {
      if (this.getSelectedSections().length === 1) {
        this.errorMessage = this.$t("sections_number_message");
      } else {
        this.anonymousModeModal.show();
      }
    },
    selectSurveySections() {
      this.anonymousModeModal.hide();
      const ids = this.getSelectedSections().map((item) => item.id);
      let pagesToKeep = [];
      for (let i = 0; i < ids.length; i++) {
        pagesToKeep.push(this.survey.survey.pages[i]);
      }
      this.survey.survey.pages = pagesToKeep;
      this.$emit("surveySectionsSelected", {
        survey: this.survey,
        consentMode: this.consentMode,
      });
    },
    getSelectedSections() {
      return _.filter(this.surveySections, "selected");
    },
    onCheckedChange(option, event) {
      this.errorMessage = null;
      if (option.required) {
        event.target.checked = true;
        option.selected = true;
        this.showToast(this.$t("section_required"));
        return false;
      }
    },
    showToast(message) {
      this.toastVisible = true;
      this.toastMessage = message;
      let instance = this;
      setTimeout(function () {
        instance.toastVisible = false;
      }, 115000);
    },
  },
};
</script>
<style lang="scss">
@import "SelectSurveySections";
</style>
