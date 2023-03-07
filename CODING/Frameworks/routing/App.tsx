import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';

import Footer from 'components/footer';
import Header from 'components/header';

import HomePage from 'pages/home';
import PlatformsPage from 'pages/platforms';
import ProductsPage from 'pages/products';
import BestPracticesPage from 'pages/best-practices';
import AboutUsPage from 'pages/about-us';
import NewsPage from 'pages/news';
import SearchResultsPage from 'pages/search-results';
import ArticlePage from 'pages/article';
import NotFoundPage from 'pages/not-found';

import { Pages, ScreenSizes, ResourceTypes, TRACKING_ID } from 'constants/index';

import GlobalStyle from 'styles/global';
import { AppContainer } from 'styles/container';

ReactGA.initialize(TRACKING_ID);
TagManager.initialize({ gtmId: TRACKING_ID });

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const updateIsMobileValue = () => {
    setIsMobile(window.innerWidth <= ScreenSizes.tabP);
  };

  useEffect(() => {
    updateIsMobileValue();

    return () => window.removeEventListener('resize', updateIsMobileValue);
  }, []);

  window.addEventListener('resize', updateIsMobileValue);

  window.dataLayer.push({
    event: 'pageview',
  });

  return (
    <>
      <GlobalStyle />

      <AppContainer>
        <Header isMobile={isMobile} />

        <Routes>
          <Route path={Pages.home} element={<HomePage />} />

          <Route path={Pages.platforms} element={<PlatformsPage />} />
          <Route path={`${Pages.platforms}/:id`} element={<ArticlePage type={ResourceTypes.platforms} />} />

          <Route path={Pages.products} element={<ProductsPage />} />
          <Route path={`${Pages.products}/:id`} element={<ArticlePage type={ResourceTypes.products} />} />

          <Route path={Pages.bestPractices} element={<BestPracticesPage />} />
          <Route path={`${Pages.bestPractices}/:id`} element={<ArticlePage type={ResourceTypes.bestPractices} />} />

          <Route path={Pages.news} element={<NewsPage />} />
          <Route path={`${Pages.news}/:id`} element={<ArticlePage type={ResourceTypes.news} />} />

          <Route path={Pages.aboutUs} element={<AboutUsPage />} />

          <Route path={Pages.search} element={<SearchResultsPage />} />
          <Route path={`${Pages.search}/:id`} element={<SearchResultsPage />} />

          <Route path='*' element={<NotFoundPage />} />
        </Routes>

        <Footer />
      </AppContainer>
    </>
  );
};

export default App;
