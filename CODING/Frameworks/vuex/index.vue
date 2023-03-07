<template>
  <v-app class="qualification">
    <v-container>
      <v-layout align-center>
        <template>
          <v-flex
            v-if="!isReady"
            offset-lg2 lg8
            class="qualification__section qualification__center"
          >
            <preloader />
          </v-flex>

          <v-flex
            v-if="isReady && !isSubmitted"
            offset-lg2 lg8
            class="qualification__section"
          >
            <h1>Qualification form</h1>
            <p>Please mark in the form the points that concern you. You can mark several points. If something is missing in the technologies and other sections, please just add more, see the point "Other".</p>
            <p class="qualification__necessarily">* Necessarily</p>
            <span class="qualification__necessarily qualification__necessarily--lg">*</span>

            <div
              ref="employee"
              class="qualification__wrap"
              :class="{ 'isError': isValidationError && !employeeSelect }"
            >
              <v-select
                v-model="companySelect"
                :items="companies"
                label="Select company"
              />
              <v-select
                v-model="managerSelect"
                :items="managers"
                label="Select manager"
              />
              <v-select
                v-model="employeeSelect"
                :items="employees"
                label="Select name"
              />

              <div
                v-show="isValidationError && !employeeSelect"
                class="qualification__validation"
              >
                <p class="qualification__necessarily">This is a mandatory question.</p>
              </div>
            </div>

            <ul class="qualification__list">
              <li
                v-for="(item, index) in buildHierarchy"
                :key="index"
                class="qualification__item"
              >
                <h2 class="qualification__caption">{{ item[0] }}</h2>
                <view-table
                  v-if="index === 0"
                  :table-header="tableHeader"
                  :table-items="item[1]"
                  :checked-prog-langs="checkedProgLangs"
                />

                <view-list
                  v-else
                  :items="item"
                  :checked="checkedProgSkills"
                />
              </li>

              <li class="qualification__item">
                <div
                  ref="language"
                  class="qualification__wrap"
                  :class="{'isError': isValidationError && selectedLangs.length === 0}"
                >
                  <h2 class="qualification__caption">Languages
                    <span class="qualification__necessarily">*</span>
                  </h2>
                  <view-list
                    :items="language"
                    :checked="checkedLanguages"
                  />
                  <div
                    v-show="isValidationError && selectedLangs.length === 0"
                    class="qualification__validation"
                  >
                    <p class="qualification__necessarily">This is a mandatory question.</p>
                  </div>
                </div>
              </li>

              <li class="qualification__item">
                <h2 class="qualification__caption">Certificates</h2>
                <view-list
                  :items="buildCertificates"
                  :checked="checkedCertificates"
                />
              </li>
            </ul>
            <v-btn color="info" @click="recordSelectedData">Submit</v-btn>
          </v-flex>

          <v-flex
            v-if="isSubmitted"
            offset-lg2 lg8
            class="qualification__section qualification__center"
          >
            <h1>Your data has been recorded</h1>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { debounce } from 'lodash-es';
import Preloader from './preloader.vue';
import ViewTable from './view-table.vue';
import ViewList from './view-list.vue';

const tableHeaderOpts = { sortable: false, align: 'center' };

export default {
  components: {
    Preloader,
    ViewTable,
    ViewList
  },

  data() {
    return {
      tableHeader: [
        { ...tableHeaderOpts, text: '', value: '' },
        { ...tableHeaderOpts, text: 'Up to 1 year', value: 'Up to 1 year' },
        { ...tableHeaderOpts, text: '1-3 years', value: '1-3 years' },
        { ...tableHeaderOpts, text: '3-5 years', value: '3-5 years' },
        { ...tableHeaderOpts, text: 'More than 5 years', value: 'More than 5 years' }
      ],
      checkedProgLangs: {},
      checkedProgSkills: {
        'Frameworks': {
          fromDB: [],
          other: { input: '', enabled: false }
        },
        'Web technologies': {
          fromDB: [],
          other: { input: '', enabled: false }
        },
        'Mobile': {
          fromDB: [],
          other: { input: '', enabled: false }
        },
        'Databases': {
          fromDB: [],
          other: { input: '', enabled: false }
        },
        'Tools': {
          fromDB: [],
          other: { input: '', enabled: false }
        },
        'Testing': {
          fromDB: [],
          other: { input: '', enabled: false }
        },
        'Other': {
          fromDB: [],
          other: { input: '', enabled: false }
        }
      },
      checkedLanguages: {
        fromDB: []
      },
      checkedCertificates: {
        fromDB: [],
        other: { input: '', enabled: false }
      }
    }
  },

  computed: {
    ...mapState([
      'isReady',
      'isSubmitted',
      'isValidationError',
    ]),

    ...mapState('getModule', [
      'language',
      'certificate',
    ]),

    ...mapState('insertModule', [
      'selectedCompany',
      'selectedManager',
      'selectedEmployee',
      'selectedLangs',
    ]),

    ...mapGetters('getModule', [
      'companies',
      'managers',
      'employees',
      'buildHierarchy',
      'buildCertificates',
    ]),

    companySelect: {
      get() { return this.selectedCompany; },
      set(value) { this.recordCompany(value); },
    },

    managerSelect: {
      get() { return this.selectedManager; },
      set(value) { this.recordManager(value); },
    },

    employeeSelect: {
      get() { return this.selectedEmployee; },
      set(value) { this.recordEmployee(value); },
    },
  },

  watch: {
    checkedProgLangs() {
      this.recordProgramming(this.checkedProgLangs);
    },

    checkedProgSkills: {
      handler: debounce(function() {
        this.recordSkill(this.checkedProgSkills);
      }, 200),
      deep: true
    },

    checkedLanguages: {
      handler() {
        this.recordLanguage(this.checkedLanguages);
      },
      deep: true
    },

    checkedCertificates: {
      handler: debounce(function() {
        this.recordCertificate(this.checkedCertificates);
      }, 200),
      deep: true
    }
  },

  async mounted() {
    await this.initialize();
  },

  methods: {
    ...mapActions('getModule', [
      'initialize',
    ]),

    ...mapActions('insertModule', [
      'recordCompany',
      'recordManager',
      'recordEmployee',
      'insertRecords',
      'recordProgramming',
      'recordSkill',
      'recordLanguage',
      'recordCertificate'
    ]),

    async recordSelectedData() {
      this.$nextTick(() => {
        if (this.isValidationError && !this.employeeSelect) {
          window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        } else if (this.isValidationError && this.selectedLangs.length === 0) {
          window.scroll({ top: this.$refs.language.offsetTop - 50, left: 0, behavior: 'smooth' });
        }
      });

      await this.insertRecords();
    }
  }
}
</script>
