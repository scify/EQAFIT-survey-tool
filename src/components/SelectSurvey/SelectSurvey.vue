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
      <div class="row">
        <div class="col">
          <div class="container-fluid">
            <div class="row survey-selector-container">
              <div class="col-2 text-center offset-1">
                <p class="intro">I am a...</p>
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
      this.loading = true;
      setTimeout(function () {
        instance.$emit("surveySelected", instance.selected.value);
        this.loading = false;
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
@import "SelectSurvey";
</style>