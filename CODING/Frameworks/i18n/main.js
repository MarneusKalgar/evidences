import Vue from 'vue';
import Vuex from 'vuex';
import Chartist from 'vue-chartist';
import vuexI18n from 'vuex-i18n';
import translationsEn from '#/lang/en.json';
import translationsDe from '#/lang/de.json';
import translationsFr from '#/lang/fr.json';
import App from './App';
import router from './router';
import store from './store/index';

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Chartist);
Vue.use(vuexI18n.plugin, store);

Vue.i18n.add('en', translationsEn);
Vue.i18n.add('de', translationsDe);
Vue.i18n.add('fr', translationsFr);

const authorizedConfig = () => ({ headers: { Authorization: `Bearer ${window.localStorage.getItem('authToken')}` } });

const {
  API, SERVICE_API, API_KEY, API_SECRET,
} = process.env;

router.beforeEach((to, from, next) => {
  if (to.params.lang && to.params.lang.match(/en|fr|de/)) {
    Vue.i18n.set(to.params.lang);
  }
  if (to.meta.title) {
    document.title = Vue.i18n.translate(to.meta.title);
  }
  next();
});

const redirects = [
  { status: 'pending', to: 'InformationForm', exceptions: ['PersonalInfoPage', 'SituationInfoPage', 'FilesPage', 'TermsPage', 'FormCompleted', 'ProfileWrapper'] },
  { status: 'sentToIb', to: 'SentToIb' },
  { status: 'ibOpened', to: 'IbOpened' },
  // { status: 'ibReady', to: 'IbReady' },
  { status: 'formCompleted', to: 'FormCompleted' },
];

const statusRouter = (to, next) => {
  Vue.axios.get(`${API}/account`, authorizedConfig())
    .then((response) => {
      store.dispatch('setProfileInfo', { email: response.data.email, fullName: response.data.fullName, id: response.data.id });
      if (response.data.accountStatus) {
        const status = response.data.accountStatus;
        let found = false;
        redirects.forEach((item) => {
          if (status === item.status && to.name !== item.to) {
            let inEx = false;
            if (item.exceptions) {
              item.exceptions.forEach((ex) => {
                if (ex === to.name ||
                  (to.matched && to.matched.filter(({ name }) => ex === name).length)
                ) {
                  inEx = true;
                }
              });
            }
            if (inEx) {
              next();
            } else {
              found = true;
              next({ name: item.to });
            }
          }
        });
        if (!found) {
          next();
        }
      } else {
        next();
      }
    });
};

router.beforeEach((to, from, next) => {
  if (to.query.email && to.query.token) {
    const data = { email: to.query.email, signInToken: to.query.token };
    data.apiKey = API_KEY;
    data.apiSecret = API_SECRET;

    Vue.axios.post(`${SERVICE_API}/login/oneTimeToken`, data)
      .then((result) => {
        this.inProgress = false;
        if (result.data.isValid) {
          window.localStorage.setItem('authToken', result.data.authToken);
          statusRouter(to, next);
        } else {
          next();
        }
      });
  } else if (window.localStorage.getItem('authToken')) {
    statusRouter(to, next);
  } else {
    next();
  }
});

Vue.i18n.set('en');

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
