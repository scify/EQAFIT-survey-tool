import _ from "lodash";
import axios from "axios";

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "",
  },
};

export default class SurveyProvider {
  instance = null;
  static translator = null;

  constructor() {
    this.getAndSaveAuthToken();
    this.setSurveyTranslations();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SurveyProvider();
    }
    return this.instance;
  }

  surveys = [
    {
      id: 1,
      name: "",
      section_descriptions: [
        {
          name: "",
          description: "",
        },
        {
          name: "",
          description: "",
        },
        {
          name: "",
          description: "",
        },
        {
          name: "",
          description: "",
        },
      ],
      section_score_texts: [
        {
          section: 2,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
        {
          section: 3,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
        {
          section: 4,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
      ],
      section_max_scores: {
        2: 118,
        3: 12,
        4: 80,
      },
      survey: {
        title: "",
        description: "",
        logo: "data:image/png;base64,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",
        logoFit: "none",
        logoPosition: "right",
        pages: [
          {
            id: 1,
            name: "",
            elements: [
              {
                type: "radiogroup",
                name: "question0",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question1",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "18-24",
                  },
                  {
                    value: "item2",
                    text: "25-34",
                  },
                  {
                    value: "item3",
                    text: "35-44",
                  },
                  {
                    value: "item4",
                    text: "45-54",
                  },
                  {
                    value: "item5",
                    text: "55+",
                  },
                ],
              },
              {
                name: "question2",
                title: "",
                type: "datepicker",
                inputType: "date",
                dateFormat: "mm/dd/yy",
                isRequired: false,
              },
              {
                name: "question3",
                title: "",
                type: "datepicker",
                inputType: "date",
                dateFormat: "mm/dd/yy",
                isRequired: false,
              },
              {
                type: "radiogroup",
                name: "question4",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "",
              },
              {
                type: "dropdown",
                name: "question5",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question6",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                  {
                    value: "item8",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "",
              },
              {
                type: "dropdown",
                name: "question7",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question8",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question9",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question10",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "",
              },
              {
                type: "dropdown",
                name: "question11",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                  {
                    value: "item8",
                    text: "",
                  },
                  {
                    value: "item9",
                    text: "",
                  },
                  {
                    value: "item10",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "",
              },
            ],
            title: "",
          },
          {
            id: 2,
            name: "",
            elements: [
              {
                type: "matrix",
                name: "question12",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question13",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question14",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                  {
                    value: "5",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                  {
                    value: "Row7",
                    text: "",
                  },
                  {
                    value: "Row8",
                    text: "",
                  },
                  {
                    value: "Row9",
                    text: "",
                  },
                  {
                    value: "Row10",
                    text: "",
                  },
                  {
                    value: "Row11",
                    text: "",
                  },
                  {
                    value: "Row12",
                    text: "",
                  },
                  {
                    value: "Row13",
                    text: "",
                  },
                  {
                    value: "Row14",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question15",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question16",
                visibleIf: "{question15} = 'item1'",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
                selectAllText: "Financial reasons",
              },
            ],
            title: "",
          },
          {
            id: 3,
            name: "",
            elements: [
              {
                type: "checkbox",
                name: "question17",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                  {
                    value: "item8",
                    text: "",
                  },
                  {
                    value: "item9",
                    text: "",
                  },
                  {
                    value: "item10",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question18",
                title: "When did you start your first job after graduation?",
                isRequired: false,
                choices: [
                  {
                    value: "1count_4",
                    text: "At the time of graduation",
                  },
                  {
                    value: "2count_4",
                    text: "Less than 1 month after graduation",
                  },
                  {
                    value: "3count_4",
                    text: "1 to less than 3 months after graduation",
                  },
                  {
                    value: "4count_4",
                    text: "3 to less than 6 months after graduation",
                  },
                  {
                    value: "1count_2",
                    text: "6 to less than 9 months after graduation",
                  },
                  {
                    value: "2count_2",
                    text: "9 to less than 12 months after graduation",
                  },
                  {
                    value: "1",
                    text: "More than one year after graduation",
                  },
                  {
                    value: "0",
                    text: "I have not been employed since graduation",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question19",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question20",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "1count_4",
                    text: "",
                  },
                  {
                    value: "2count_4",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "1count_1",
                    text: "",
                  },
                  {
                    value: "2count_1",
                    text: "",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question21",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                  {
                    value: "item8",
                    text: "",
                  },
                  {
                    value: "item9",
                    text: "",
                  },
                  {
                    value: "item10",
                    text: "",
                  },
                  {
                    value: "item11",
                    text: "",
                  },
                  {
                    value: "item12",
                    text: "",
                  },
                  {
                    value: "item13",
                    text: "",
                  },
                  {
                    value: "item14",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question22",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                  {
                    value: "item8",
                    text: "",
                  },
                  {
                    value: "item9",
                    text: "",
                  },
                  {
                    value: "item10",
                    text: "",
                  },
                  {
                    value: "item11",
                    text: "",
                  },
                  {
                    value: "item12",
                    text: "",
                  },
                  {
                    value: "item13",
                    text: "",
                  },
                  {
                    value: "item14",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question23",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question24",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question25",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question26",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question27",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question28",
                visibleIf: "{question27} = 'item1'",
                title: "",
                isRequired: false,
                requiredIf: "{question27} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question29",
                visibleIf: "{question27} = 'item1'",
                title: "",
                isRequired: false,
                requiredIf: "{question27} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (pelase specify)",
              },
              {
                type: "dropdown",
                name: "question30",
                visibleIf: "{question27} = 'item1'",
                title: "",
                isRequired: false,
                requiredIf: "{question27} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question31",
                visibleIf: "{question27} = 'item1'",
                title: "",
                isRequired: false,
                requiredIf: "{question27} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                  {
                    value: "item8",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question32",
                visibleIf: "{question27} = 'item1'",
                title: "",
                isRequired: false,
                requiredIf: "{question27} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                ],
              },
            ],
            title: "",
          },
          {
            id: 4,
            name: "",
            elements: [
              {
                type: "matrix",
                name: "question33",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                  {
                    value: "5",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row 1",
                    text: "",
                  },
                  {
                    value: "Row 2",
                    text: "",
                  },
                  {
                    value: "Row 3",
                    text: "",
                  },
                  {
                    value: "Row 4",
                    text: "",
                  },
                  {
                    value: "Row 5",
                    text: "",
                  },
                  {
                    value: "Row 6",
                    text: "",
                  },
                  {
                    value: "Row 7",
                    text: "",
                  },
                  {
                    value: "Row 8",
                    text: "",
                  },
                  {
                    value: "Row 9",
                    text: "",
                  },
                  {
                    value: "Row 10",
                    text: "",
                  },
                  {
                    value: "Row 11",
                    text: "",
                  },
                  {
                    value: "Row 12",
                    text: "",
                  },
                  {
                    value: "Row 13",
                    text: "",
                  },
                  {
                    value: "Row 14",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question34",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                  {
                    value: "5",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row 1",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question35",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                  {
                    value: "5",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row 1",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question36",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                  {
                    value: "item8",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question37",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question38",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question39",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
            ],
            title: "",
            description: "",
          },
        ],
        showProgressBar: "both",
        progressBarType: "buttons",
        goNextPageAutomatic: false,
      },
    },
    {
      id: 2,
      name: "",
      section_descriptions: [
        {
          name: "",
          description: "",
        },
        {
          name: "",
          description: "",
        },
        {
          name: "",
          description: "",
        },
      ],
      section_max_scores: {
        2: 72,
        3: 64,
      },
      section_score_texts: [
        {
          section: 2,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
        {
          section: 3,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
      ],
      survey: {
        title: "",
        description: "",
        logo: "data:image/png;base64,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",
        logoFit: "none",
        logoPosition: "right",
        pages: [
          {
            id: 1,
            name: "",
            elements: [
              {
                type: "radiogroup",
                name: "question0",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "radiogroup",
                name: "question1",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question2",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            name: "",
            elements: [
              {
                type: "matrix",
                name: "question3",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question4",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "0",
                    text: "",
                  },
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                  {
                    value: "Row7",
                    text: "",
                  },
                  {
                    value: "Row8",
                    text: "",
                  },
                  {
                    value: "Row9",
                    text: "",
                  },
                  {
                    value: "Row10",
                    text: "",
                  },
                  {
                    value: "Row11",
                    text: "",
                  },
                  {
                    value: "Row12",
                    text: "",
                  },
                  {
                    value: "Row13",
                    text: "",
                  },
                  {
                    value: "Row14",
                    text: "",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            name: "",
            elements: [
              {
                type: "matrix",
                name: "question5",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "0",
                    text: "",
                  },
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                  {
                    value: "Row7",
                    text: "",
                  },
                  {
                    value: "Row8",
                    text: "",
                  },
                  {
                    value: "Row9",
                    text: "",
                  },
                  {
                    value: "Row10",
                    text: "",
                  },
                  {
                    value: "Row11",
                    text: "",
                  },
                  {
                    value: "Row12",
                    text: "",
                  },
                  {
                    value: "Row13",
                    text: "",
                  },
                  {
                    value: "Row14",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question6",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "0",
                    text: "",
                  },
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question7",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "0",
                    text: "",
                  },
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question8",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 3,
      name: "",
      section_descriptions: [
        {
          name: "",
          description: "",
        },
        {
          name: "",
          description: "",
        },
        {
          name: "",
          description: "",
        },
      ],
      section_max_scores: {
        1: 6,
        2: 108,
        3: 6,
      },
      section_score_texts: [
        {
          section: 1,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
        {
          section: 2,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
        {
          section: 3,
          score_texts: [
            {
              min_score: 0,
              text: "",
            },
            {
              min_score: 21,
              text: "",
            },
            {
              min_score: 41,
              text: "",
            },
            {
              min_score: 61,
              text: "",
            },
            {
              min_score: 81,
              text: "",
            },
          ],
        },
      ],
      survey: {
        title: "",
        description: "",
        logo: "data:image/png;base64,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",
        logoFit: "none",
        logoPosition: "right",
        pages: [
          {
            id: 1,
            name: "",
            elements: [
              {
                type: "radiogroup",
                name: "question0",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "radiogroup",
                name: "question2",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                  {
                    value: "item6",
                    text: "",
                  },
                  {
                    value: "item7",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question2",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question3",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "0",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question4",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "1count_1",
                    text: "",
                  },
                  {
                    value: "2count_1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question5",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "0",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question6",
                visibleIf: "{question5} = '1'",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "item1",
                    text: "",
                  },
                  {
                    value: "item2",
                    text: "",
                  },
                  {
                    value: "item3",
                    text: "",
                  },
                  {
                    value: "item4",
                    text: "",
                  },
                  {
                    value: "item5",
                    text: "",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
            ],
          },
          {
            id: 2,
            name: "",
            elements: [
              {
                type: "matrix",
                name: "question7",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                  {
                    value: "Row7",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question8",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question9",
                title: "",
                isRequired: false,
                columns: [
                  {
                    value: "0",
                    text: "",
                  },
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "3",
                    text: "",
                  },
                  {
                    value: "4",
                    text: "",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "",
                  },
                  {
                    value: "Row2",
                    text: "",
                  },
                  {
                    value: "Row3",
                    text: "",
                  },
                  {
                    value: "Row4",
                    text: "",
                  },
                  {
                    value: "Row5",
                    text: "",
                  },
                  {
                    value: "Row6",
                    text: "",
                  },
                  {
                    value: "Row7",
                    text: "",
                  },
                  {
                    value: "Row8",
                    text: "",
                  },
                  {
                    value: "Row9",
                    text: "",
                  },
                  {
                    value: "Row10",
                    text: "",
                  },
                  {
                    value: "Row11",
                    text: "",
                  },
                  {
                    value: "Row12",
                    text: "",
                  },
                  {
                    value: "Row13",
                    text: "",
                  },
                  {
                    value: "Row14",
                    text: "",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            name: "",
            elements: [
              {
                type: "radiogroup",
                name: "question10",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "1count_4",
                    text: "",
                  },
                  {
                    value: "2count_4",
                    text: "",
                  },
                  {
                    value: "3count_4",
                    text: "",
                  },
                  {
                    value: "1count_3",
                    text: "",
                  },
                  {
                    value: "2count_3",
                    text: "",
                  },
                  {
                    value: "2",
                    text: "",
                  },
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "0",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question11",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "0",
                    text: "",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question12",
                title: "",
                isRequired: false,
                choices: [
                  {
                    value: "1",
                    text: "",
                  },
                  {
                    value: "0",
                    text: "",
                  },
                ],
              },
              {
                type: "comment",
                name: "question13",
                title: "",
              },
              {
                type: "comment",
                name: "question14",
                title: "How do you collect and analyze this data?",
              },
            ],
          },
        ],
      },
    },
  ];

  getSurveys() {
    return this.surveys;
  }

  getSurvey(id) {
    return _.find(this.surveys, { id: id });
  }

  getSurveyResponsesFromServer() {
    return new Promise(function callback(resolve, reject) {
      axios
        .get(
          "https://www.eqafit.org/wp-json/wp/v2/survey_responses/",
          axiosConfig
        )
        .then(function (response) {
          if (response.status > 300) {
            reject(response);
          }
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  sendSurveyResponseToServer(data) {
    return new Promise(function callback(resolve, reject) {
      axios
        .post(
          "https://www.eqafit.org/wp-json/wp/v2/survey_responses/",
          data,
          axiosConfig
        )
        .then(function (response) {
          if (response.status > 300) {
            reject(response);
          }
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  getAndSaveAuthToken() {
    const data = {
      username: import.meta.env.VITE_REST_API_AUTH_USERNAME,
      password: import.meta.env.VITE_REST_API_AUTH_USERPASSWORD,
    };
    axios
      .post(
        "https://www.eqafit.org/wp-json/jwt-auth/v1/token",
        data,
        axiosConfig
      )
      .then(function (response) {
        axiosConfig.headers.Authorization = "Bearer " + response.data.token;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  setSurveyTranslations() {
    this.createSurveySections(0, 1, 4);

    this.createChoicesQuestion(0, 0, 1, 0, 0, 2);
    this.createChoicesQuestion(0, 0, 1, 1, 1, 0);
    this.createChoicesQuestion(0, 0, 1, 2, 2, 0);
    this.createChoicesQuestion(0, 0, 1, 3, 3, 0);
    this.createChoicesQuestion(0, 0, 1, 4, 4, 3, true);
    this.createChoicesQuestion(0, 0, 1, 5, 5, 7);
    this.createChoicesQuestion(0, 0, 1, 6, 6, 7, true);
    this.createChoicesQuestion(0, 0, 1, 7, 7, 5);
    this.createChoicesQuestion(0, 0, 1, 8, 8, 2);
    this.createChoicesQuestion(0, 0, 1, 9, 9, 3);
    this.createChoicesQuestion(0, 0, 1, 10, 10, 6, true);
    this.createChoicesQuestion(0, 0, 1, 11, 11, 10, true);

    this.createMatrixQuestion(0, 1, 1, 0, 12, 6, 4);
    this.createMatrixQuestion(0, 1, 1, 1, 13, 6, 4);
    this.createMatrixQuestion(0, 1, 1, 2, 14, 14, 5);
    this.createChoicesQuestion(0, 1, 1, 3, 15, 2);
    this.createChoicesQuestion(0, 1, 1, 4, 16, 5, true);

    this.createChoicesQuestion(0, 2, 1, 0, 17, 10, true);
    this.createChoicesQuestion(0, 2, 1, 1, 18, 8);
    this.createChoicesQuestion(0, 2, 1, 2, 19, 3);
    this.createChoicesQuestion(0, 2, 1, 3, 20, 6);
    this.createChoicesQuestion(0, 2, 1, 4, 21, 14, true);
    this.createChoicesQuestion(0, 2, 1, 5, 22, 14, true);
    this.createChoicesQuestion(0, 2, 1, 6, 23, 5);
    this.createChoicesQuestion(0, 2, 1, 7, 24, 5);
    this.createChoicesQuestion(0, 2, 1, 8, 25, 5, true);
    this.createChoicesQuestion(0, 2, 1, 9, 26, 5);
    this.createChoicesQuestion(0, 2, 1, 10, 27, 2);
    this.createChoicesQuestion(0, 2, 1, 11, 28, 5);
    this.createChoicesQuestion(0, 2, 1, 12, 29, 7, true);
    this.createChoicesQuestion(0, 2, 1, 13, 30, 5, true);
    this.createChoicesQuestion(0, 2, 1, 14, 31, 8);
    this.createChoicesQuestion(0, 2, 1, 15, 32, 6);

    this.createMatrixQuestion(0, 3, 1, 0, 33, 14, 5);
    this.createMatrixQuestion(0, 3, 1, 1, 34, 1, 5);
    this.createMatrixQuestion(0, 3, 1, 2, 35, 1, 5);
    this.createChoicesQuestion(0, 3, 1, 3, 36, 8, true);
    this.createChoicesQuestion(0, 3, 1, 4, 37, 4);
    this.createChoicesQuestion(0, 3, 1, 5, 38, 5);
    this.createChoicesQuestion(0, 3, 1, 6, 39, 6, true);

    this.createSurveySections(1, 2, 3);
    this.createChoicesQuestion(1, 0, 2, 0, 0, 5, true);
    this.createChoicesQuestion(1, 0, 2, 1, 1, 7);
    this.createChoicesQuestion(1, 0, 2, 2, 2, 6);

    this.createMatrixQuestion(1, 1, 2, 0, 3, 4, 4);
    this.createMatrixQuestion(1, 1, 2, 1, 4, 14, 5);

    this.createMatrixQuestion(1, 2, 2, 0, 5, 14, 5);
    this.createMatrixQuestion(1, 2, 2, 1, 6, 1, 5);
    this.createMatrixQuestion(1, 2, 2, 2, 7, 1, 5);
    this.createChoicesQuestion(1, 2, 2, 3, 8, 4);

    this.createSurveySections(2, 3, 3);
    this.createChoicesQuestion(2, 0, 3, 0, 0, 2, true);
    this.createChoicesQuestion(2, 0, 3, 1, 1, 7);
    this.createChoicesQuestion(2, 0, 3, 2, 2, 3);
    this.createChoicesQuestion(2, 0, 3, 3, 3, 2);
    this.createChoicesQuestion(2, 0, 3, 4, 4, 5);
    this.createChoicesQuestion(2, 0, 3, 5, 5, 2);
    this.createChoicesQuestion(2, 0, 3, 6, 6, 5, true);

    this.createMatrixQuestion(2, 1, 3, 0, 7, 7, 4);
    this.createMatrixQuestion(2, 1, 3, 1, 8, 6, 4);
    this.createMatrixQuestion(2, 1, 3, 2, 9, 14, 5);

    this.createChoicesQuestion(2, 2, 3, 0, 10, 8);
    this.createChoicesQuestion(2, 2, 3, 1, 11, 2);
    this.createChoicesQuestion(2, 2, 3, 2, 12, 2);
    this.surveys[2].survey.pages[2].elements[3].title =
      SurveyProvider.translator("survey_3_question_13_title");
    this.surveys[2].survey.pages[2].elements[4].title =
      SurveyProvider.translator("survey_3_question_14_title");

    this.surveys[0].section_score_texts[0].score_texts[0].text =
      SurveyProvider.translator("survey_1_section_2_level_0_text");
    this.surveys[0].section_score_texts[0].score_texts[1].text =
      SurveyProvider.translator("survey_1_section_2_level_1_text");
    this.surveys[0].section_score_texts[0].score_texts[2].text =
      SurveyProvider.translator("survey_1_section_2_level_2_text");
    this.surveys[0].section_score_texts[0].score_texts[3].text =
      SurveyProvider.translator("survey_1_section_2_level_3_text");
    this.surveys[0].section_score_texts[0].score_texts[4].text =
      SurveyProvider.translator("survey_1_section_2_level_4_text");

    this.surveys[0].section_score_texts[1].score_texts[0].text =
      SurveyProvider.translator("survey_1_section_3_level_0_text");
    this.surveys[0].section_score_texts[1].score_texts[1].text =
      SurveyProvider.translator("survey_1_section_3_level_1_text");
    this.surveys[0].section_score_texts[1].score_texts[2].text =
      SurveyProvider.translator("survey_1_section_3_level_2_text");
    this.surveys[0].section_score_texts[1].score_texts[3].text =
      SurveyProvider.translator("survey_1_section_3_level_3_text");
    this.surveys[0].section_score_texts[1].score_texts[4].text =
      SurveyProvider.translator("survey_1_section_3_level_4_text");

    this.surveys[0].section_score_texts[2].score_texts[0].text =
      SurveyProvider.translator("survey_1_section_4_level_0_text");
    this.surveys[0].section_score_texts[2].score_texts[1].text =
      SurveyProvider.translator("survey_1_section_4_level_1_text");
    this.surveys[0].section_score_texts[2].score_texts[2].text =
      SurveyProvider.translator("survey_1_section_4_level_2_text");
    this.surveys[0].section_score_texts[2].score_texts[3].text =
      SurveyProvider.translator("survey_1_section_4_level_3_text");
    this.surveys[0].section_score_texts[2].score_texts[4].text =
      SurveyProvider.translator("survey_1_section_4_level_4_text");

    this.surveys[1].section_score_texts[0].score_texts[0].text =
      SurveyProvider.translator("survey_2_section_2_level_0_text");
    this.surveys[1].section_score_texts[0].score_texts[1].text =
      SurveyProvider.translator("survey_2_section_2_level_1_text");
    this.surveys[1].section_score_texts[0].score_texts[2].text =
      SurveyProvider.translator("survey_2_section_2_level_2_text");
    this.surveys[1].section_score_texts[0].score_texts[3].text =
      SurveyProvider.translator("survey_2_section_2_level_3_text");
    this.surveys[1].section_score_texts[0].score_texts[4].text =
      SurveyProvider.translator("survey_2_section_2_level_4_text");

    this.surveys[1].section_score_texts[1].score_texts[0].text =
      SurveyProvider.translator("survey_2_section_3_level_0_text");
    this.surveys[1].section_score_texts[1].score_texts[1].text =
      SurveyProvider.translator("survey_2_section_3_level_1_text");
    this.surveys[1].section_score_texts[1].score_texts[2].text =
      SurveyProvider.translator("survey_2_section_3_level_2_text");
    this.surveys[1].section_score_texts[1].score_texts[3].text =
      SurveyProvider.translator("survey_2_section_3_level_3_text");
    this.surveys[1].section_score_texts[1].score_texts[4].text =
      SurveyProvider.translator("survey_2_section_3_level_4_text");

    this.surveys[2].section_score_texts[0].score_texts[0].text =
      SurveyProvider.translator("survey_3_section_2_level_0_text");
    this.surveys[2].section_score_texts[0].score_texts[1].text =
      SurveyProvider.translator("survey_3_section_2_level_1_text");
    this.surveys[2].section_score_texts[0].score_texts[2].text =
      SurveyProvider.translator("survey_3_section_2_level_2_text");
    this.surveys[2].section_score_texts[0].score_texts[3].text =
      SurveyProvider.translator("survey_3_section_2_level_3_text");
    this.surveys[2].section_score_texts[0].score_texts[4].text =
      SurveyProvider.translator("survey_3_section_2_level_4_text");

    this.surveys[2].section_score_texts[1].score_texts[0].text =
      SurveyProvider.translator("survey_3_section_3_level_0_text");
    this.surveys[2].section_score_texts[1].score_texts[1].text =
      SurveyProvider.translator("survey_3_section_3_level_1_text");
    this.surveys[2].section_score_texts[1].score_texts[2].text =
      SurveyProvider.translator("survey_3_section_3_level_2_text");
    this.surveys[2].section_score_texts[1].score_texts[3].text =
      SurveyProvider.translator("survey_3_section_3_level_3_text");
    this.surveys[2].section_score_texts[1].score_texts[4].text =
      SurveyProvider.translator("survey_3_section_3_level_4_text");
  }

  createSurveySections(surveyIndex, surveyId, numOfSections) {
    this.surveys[surveyIndex].name = SurveyProvider.translator(
      "survey_" + surveyId + "_title"
    );
    this.surveys[surveyIndex].title = SurveyProvider.translator(
      "survey_" + surveyId + "_title"
    );
    this.surveys[surveyIndex].survey.title = SurveyProvider.translator(
      "survey_" + surveyId + "_title"
    );
    this.surveys[surveyIndex].survey.description = SurveyProvider.translator(
      "survey_" + surveyId + "_descr"
    );

    for (let i = 1; i <= numOfSections; i++) {
      if (!this.surveys[surveyIndex].survey.pages[i - 1]) continue;
      this.surveys[surveyIndex].survey.pages[i - 1].title =
        SurveyProvider.translator(
          "survey_" + surveyId + "_page_" + i + "_title"
        );
      this.surveys[surveyIndex].survey.pages[i - 1].name =
        SurveyProvider.translator(
          "survey_" + surveyId + "_page_" + i + "_title"
        );

      this.surveys[surveyIndex].section_descriptions[i - 1].name =
        SurveyProvider.translator("section_" + i);

      this.surveys[surveyIndex].section_descriptions[i - 1].description =
        SurveyProvider.translator(
          "survey_" + surveyId + "_section_" + i + "_descr"
        );
    }
  }

  createChoicesQuestion(
    surveyIndex,
    pageIndex,
    surveyId,
    questionIndex,
    questionId,
    numOfChoices,
    hasOther = false
  ) {
    if (!this.surveys[surveyIndex].survey.pages[pageIndex]) return;
    this.surveys[surveyIndex].survey.pages[pageIndex].elements[
      questionIndex
    ].title = SurveyProvider.translator(
      "survey_" + surveyId + "_question_" + questionId + "_title"
    );
    for (let i = 0; i < numOfChoices; i++) {
      this.surveys[surveyIndex].survey.pages[pageIndex].elements[
        questionIndex
      ].choices[i].text = SurveyProvider.translator(
        "survey_" + surveyId + "_question_" + questionId + "_text_" + i
      );
    }

    if (hasOther)
      this.surveys[surveyIndex].survey.pages[pageIndex].elements[
        questionIndex
      ].otherText = SurveyProvider.translator("survey_label_other");
  }

  createMatrixQuestion(
    surveyIndex,
    pageIndex,
    surveyId,
    questionIndex,
    questionId,
    rowCount,
    colCount
  ) {
    if (!this.surveys[surveyIndex].survey.pages[pageIndex]) return;
    this.surveys[surveyIndex].survey.pages[pageIndex].elements[
      questionIndex
    ].title = SurveyProvider.translator(
      "survey_" + surveyId + "_question_" + questionId + "_title"
    );
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      this.surveys[surveyIndex].survey.pages[pageIndex].elements[
        questionIndex
      ].rows[rowIndex].text = SurveyProvider.translator(
        "survey_" + surveyId + "_question_" + questionId + "_row_" + rowIndex
      );
    }

    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      this.surveys[surveyIndex].survey.pages[pageIndex].elements[
        questionIndex
      ].columns[colIndex].text = SurveyProvider.translator(
        "survey_" + surveyId + "_question_" + questionId + "_column_" + colIndex
      );
    }
  }
}
