import { updateEmpSkillAttrs } from '../utils';

export default {
  namespaced: true,

  state() {
    return {
      selectedCompany: null,
      selectedCompanyID: null,
      selectedManager: null,
      selectedManagerID: null,
      selectedEmployee: null,
      selectedEmployeeID: null,
      selectedProgs: {},
      selectedSkills: {},
      selectedLangs: [],
      selectedCertificates: [],
      responseStatus: {
        progs: null,
        skills: null,
        langs: null,
        certificates: null
      },
    }
  },

  mutations: {
    SET(state, { key, value }) {
      state[key] = value;
    },

    SET_NESTED(state, { top, nested, value }) {
      state[top][nested] = value;
    }
  },

  actions: {
    recordCompany({ commit, state, rootState }, value) {
      rootState.getModule.company.forEach(item => {
        if (item.name === value) {
          commit('SET', { key: 'selectedCompany', value });
          commit('SET', { key: 'selectedCompanyID', value: item.ID });
        }
      });
      commit('SET', { key: 'selectedManager', value: null });
      commit('SET', { key: 'selectedManagerID', value: null });
      commit('SET', { key: 'selectedEmployee', value: null });
      commit('SET', { key: 'selectedEmployeeID', value: null });
    },

    recordManager({ commit, state, rootState }, value) {
      rootState.getModule.employee.forEach(item => {
        if (item['orgEmployeeID.fullFIO'] === value) {
          commit('SET', { key: 'selectedManager', value });
          commit('SET', { key: 'selectedManagerID', value: item.orgEmployeeID });
        }
      });
      commit('SET', { key: 'selectedEmployee', value: null });
      commit('SET', { key: 'selectedEmployeeID', value: null });
    },

    recordEmployee({ commit, state, rootState }, value) {
      rootState.getModule.employee.forEach(item => {
        if (item['orgEmployeeID.fullFIO'] === value) {
          commit('SET', { key: 'selectedEmployee', value });
          commit('SET', { key: 'selectedEmployeeID', value: item.orgEmployeeID });
        }
      });
    },

    recordProgramming({commit}, value) {
      commit('SET', { key: 'selectedProgs', value });
    },

    recordSkill({commit}, value) {
      commit('SET', { key: 'selectedSkills', value });
    },

    recordLanguage({commit}, value) {
      commit('SET', { key: 'selectedLangs', value });
    },

    recordCertificate({commit}, value) {
      commit('SET', { key: 'selectedCertificates', value });
    },

    async insertRecords({ commit, state }) {
      const {
        selectedEmployeeID,
        selectedProgs,
        selectedSkills,
        selectedLangs,
        selectedCertificates
      } = state;
      if (selectedEmployeeID === null || selectedLangs.length === 0) {
        commit('SET_DATA', { key: 'isValidationError', value: true }, { root: true });
      } else {
        commit('SET_DATA', { key: 'isValidationError', value: false }, { root: true });

        await Promise.all([
          updateEmpSkillAttrs('/insertProgLangs', selectedEmployeeID, selectedProgs).then(res => {
            commit('SET_NESTED', { top: 'responseStatus', nested: 'progs', value: res.status });
          })
          .catch(error => {
            throw new Error(error);
          }),
          updateEmpSkillAttrs('/insertProgSkills', selectedEmployeeID, selectedSkills).then(res => {
            commit('SET_NESTED', { top: 'responseStatus', nested: 'skills', value: res.status });
          })
          .catch(error => {
            throw new Error(error);
          }),
          updateEmpSkillAttrs('/insertLanguages', selectedEmployeeID, selectedLangs).then(res => {
            commit('SET_NESTED', { top: 'responseStatus', nested: 'langs', value: res.status });
          })
          .catch(error => {
            throw new Error(error);
          }),
          updateEmpSkillAttrs('/insertCertificates', selectedEmployeeID, selectedCertificates).then(res => {
            commit('SET_NESTED', { top: 'responseStatus', nested: 'certificates', value: res.status });
          })
          .catch(error => {
            throw new Error(error);
          })
        ])
        .then(() => {
          commit('SET_DATA', { key: 'isSubmitted', value: true }, { root: true });
        })
        .catch(err => {
          throw new Error(err);
        });
      }
    },
  }
}
