import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import '@vkontakte/vkui/dist/vkui.css';
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  SplitLayout,
  Panel,
  PanelHeader,
  withAdaptivity,
} from '@vkontakte/vkui';

import { PanelWrapper } from './utils/wrappers';
import { GlobalStyles } from './utils/globalStyles';
import { FlashLight } from './components/Flashlight';

const Container = styled.main`
  width: 100%;
`;

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <Container>
              <GlobalStyles />
              <PanelWrapper id="home">
                <Panel id="home">
                  <PanelHeader>Flashlight app</PanelHeader>
                  <FlashLight />
                </Panel>
              </PanelWrapper>
            </Container>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default withAdaptivity(App, { viewWidth: true });
