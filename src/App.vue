<template>
  <main>
    <div class="wrapper">
      <SelectSurvey
        v-if="appInSelectSurveyState()"
        @survey-selected="surveySelected"
      ></SelectSurvey>
    </div>
  </main>
</template>

<script>
import SelectSurvey from "@/components/SelectSurvey/SelectSurvey.vue";

const State = Object.freeze({
  select_survey: 0,
  select_survey_sections: 1,
  survey_response_in_progress: 2,
  survey_response_results: 3,
});

export default {
  name: "App",
  components: { SelectSurvey },
  mounted() {},
  data: function () {
    return {
      appState: State.select_survey,
    };
  },
  methods: {
    appInSelectSurveyState() {
      return this.appState === State.select_survey;
    },
    appInSelectSurveySectionsState() {
      return this.appState === State.select_survey_sections;
    },
    appInSurveyResponseInProgressState() {
      return this.appState === State.survey_response_in_progress;
    },
    appInSurveyResponseResultsState() {
      return this.appState === State.survey_response_results;
    },
    surveySelected(surveyId) {
      console.log(surveyId);
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/app";
</style>
