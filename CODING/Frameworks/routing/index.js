import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/pages/Dashboard';
import InformationForm from '@/pages/InformationForm';
import PersonalInfoPage from '@/pages/PersonalInfoPage';
import SituationInfoPage from '@/pages/SituationInfoPage';
import FilesPage from '@/pages/FilesPage';
import TermsPage from '@/pages/TermsPage';
import Login from '@/pages/Login';
import FormCompleted from '@/pages/FormCompleted';
import SentToIb from '@/pages/SentToIb';
import IbReady from '@/pages/IbReady';
import IbOpened from '@/pages/IbOpened';
import AllocationSection from '@/components/AllocationSection';
import Settings from '@/components/Settings';
import Portfolio from '@/components/Portfolio';
import Withdraw from '@/components/Withdraw';
import Password from '@/components/Password';
import TwoFactor from '@/components/TwoFactor';
import Forgot from '@/pages/Forgot';
import Registration from '@/pages/Registration';
import ProfileWrapper from '@/pages/profile/index';
import profileFormRoutes from './profile';

Vue.use(Router);

const isAuthorized = (to, from, next) => {
  const token = window.localStorage.getItem('authToken');
  if (token) {
    next();
  } else {
    next({ name: 'Login' });
  }
};

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: isAuthorized,
      meta: {
        title: 'pages.dashboard.title',
      },
      children: [
        {
          path: '/',
          name: 'DashboardAllocations',
          component: AllocationSection,
          meta: {
            leftFrom: [
              'DashboardSettings',
            ],
            rightFrom: [],
            title: 'pages.dashboard.title',
          },
        },
        {
          path: '/settings',
          name: 'DashboardSettings',
          component: Settings,
          meta: {
            leftFrom: [
              'Withdraw',
              'TwoFactor',
              'Password',
            ],
            rightFrom: [
              'DashboardAllocations',
            ],
            title: 'pages.dashboard.title',
          },
        },
        {
          path: '/portfolio',
          name: 'DashboardPortfolio',
          component: Portfolio,
          meta: {
            leftFrom: [
              'Withdraw',
              'TwoFactor',
              'Password',
            ],
            rightFrom: [
              'DashboardAllocations',
            ],
            title: 'pages.dashboard.title',
          },
        },
        {
          path: '/withdraw',
          name: 'Withdraw',
          component: Withdraw,
          meta: {
            leftFrom: [],
            rightFrom: [
              'DashboardSettings',
            ],
            title: 'pages.dashboard.title',
          },
        },
        {
          path: '/twofactor',
          name: 'TwoFactor',
          component: TwoFactor,
          meta: {
            leftFrom: [],
            rightFrom: [
              'DashboardSettings',
            ],
            title: 'pages.dashboard.title',
          },
        },
        {
          path: '/password',
          name: 'Password',
          component: Password,
          meta: {
            leftFrom: [],
            rightFrom: [
              'DashboardSettings',
            ],
            title: 'pages.dashboard.title',
          },
        },
      ],
    },
    {
      path: '/form',
      name: 'InformationForm',
      component: InformationForm,
      beforeEnter: isAuthorized,
      meta: {
        title: 'pages.informationform.title',
      },
    },
    {
      path: '/form/personal-info',
      name: 'PersonalInfoPage',
      component: PersonalInfoPage,
      beforeEnter: isAuthorized,
      meta: {
        title: 'pages.personalinfo.title',
      },
    },
    {
      path: '/form/situation-info',
      name: 'SituationInfoPage',
      component: SituationInfoPage,
      beforeEnter: isAuthorized,
      meta: {
        title: 'pages.situationinfo.title',
      },
    },
    {
      path: '/form/identification',
      name: 'FilesPage',
      component: FilesPage,
      beforeEnter: isAuthorized,
      meta: {
        title: 'pages.files.title',
      },
    },
    {
      path: '/form/profile',
      name: 'ProfileWrapper',
      component: ProfileWrapper,
      beforeEnter: isAuthorized,
      children: [...profileFormRoutes],
    },
    {
      path: '/form/terms',
      name: 'TermsPage',
      component: TermsPage,
      beforeEnter: isAuthorized,
      meta: {
        title: 'pages.terms.title',
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'pages.login.title',
      },
    },
    {
      path: '/form-completed',
      name: 'FormCompleted',
      component: FormCompleted,
      meta: {
        title: 'pages.formcompleted.title',
      },
    },
    {
      path: '/ib-ready',
      name: 'IbReady',
      component: IbReady,
      meta: {
        title: 'pages.ibready.title',
      },
    },
    {
      path: '/sent-to-ib',
      name: 'SentToIb',
      component: SentToIb,
      meta: {
        title: 'pages.settoib.title',
      },
    },
    {
      path: '/ib-opened',
      name: 'IbOpened',
      component: IbOpened,
      meta: {
        title: 'pages.ibopened.title',
      },
    },
    {
      path: '/forgot',
      name: 'Forgot',
      component: Forgot,
      meta: {
        title: 'pages.forgot.title',
      },
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration,
      meta: {
        title: 'pages.registration.title',
      },
    },
  ],
});
