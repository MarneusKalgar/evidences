import { loadEntity, updateEmpSkillAttrs } from './utils';

import getModule from './modules/get';
import insertModule from './modules/insert';

// TODO: create store modules

export default function() {
  return {
    modules: {
      getModule,
      insertModule,
    },

    state: {
      isReady: false,
      isDirty: false,
      isValidationError: false,
      isSubmitted: false,
    },

    mutations: {
      SET_DATA(state, { key, value }) {
        state[key] = value;
      },
    },
  }
}
