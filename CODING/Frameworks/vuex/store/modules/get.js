import { loadEntity } from '../utils';

export default {
  namespaced: true,

  state() {
    return {
      employee: [],
      company: [],
      manager: [],
      skillCategory: [],
      skill: [],
      language: [],
      certificate: [],
    }
  },

  mutations: {
    SET(state, { key, value }) {
      state[key] = value;
    },
  },

  actions: {
    async initialize({ commit }) {
      await Promise.all([
        loadEntity('/getCompanies').then(res => {
          commit('SET', { key: 'company', value: res });
        }),
        loadEntity('/getManagers').then(res => {
          commit('SET', { key: 'manager', value: res });
        }),
        loadEntity('/getEmployees').then(res => {
          commit('SET', { key: 'employee', value: res });
        }),
        loadEntity('/getSkillCategories').then(res => {
          commit('SET', { key: 'skillCategory', value: res });
        }),
        loadEntity('/getSkills').then(res => {
          commit('SET', { key: 'skill', value: res });
        }),
        loadEntity('/getLanguages').then(res => {
          commit('SET', { key: 'language', value: res});
        }),
        loadEntity('/getCertificates').then(res => {
          commit('SET', { key: 'certificate', value: res});
        })
      ])
      .then(() => {
        commit('SET_DATA', { key: 'isReady', value: true }, { root: true });
      })
      .catch(err => {
        throw new Error(err);
      });
    },
  },

  getters: {
    companies(state) {
      return state.company.map(item => item.name);
    },

    managers(state, getters, rootState) {
      const { company, manager, employee } = state;
      const { selectedCompanyID } = rootState.insertModule;
      const managersID = manager.map(item => item.orgEmployeeID);

      return employee
        .filter(item => item.company === selectedCompanyID)
        .filter(item => managersID.includes(item.orgEmployeeID))
        .map(item => item['orgEmployeeID.fullFIO']);
    },

    employees(state, getters, rootState) {
      const { manager, employee } = state;
      const { selectedManagerID } = rootState.insertModule;
      const managerID = manager.filter(item => item.orgEmployeeID === selectedManagerID);

      return employee
        .filter(item => item.pManager === ({ ...managerID[0] }).ID)
        .filter(item => item.isDismissed !== 1)
        .map(item => item['orgEmployeeID.fullFIO']);
    },

    buildCertificates(state) {
      const certificate = [...state.certificate];
      certificate.push({ name: 'Other:' });
      return certificate;
    }
  }
}
