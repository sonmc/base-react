import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// scroll bar
import 'simplebar/src/simplebar.css';
// third-party
import { Provider as ReduxProvider } from 'react-redux';
// apex-chart
import 'assets/third-party/apex-chart.css';
// project import
import { store } from 'store';
import reportWebVitals from 'core/reportWebVitals';
import Routes from 'routes/index';
import ThemeCustomization from 'core/themes';
import ScrollTop from 'components/ScrollTop';
import { RecoilRoot } from 'recoil';
// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <RecoilRoot>
          <ThemeCustomization>
            <ScrollTop>
              <Routes />
            </ScrollTop>
          </ThemeCustomization>
        </RecoilRoot>
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>
);
reportWebVitals();
