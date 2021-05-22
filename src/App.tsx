import React, { useState, useCallback, useEffect } from 'react';
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
import { FlashlightState } from '@limbus-mini-apps';

import { PanelWrapper } from './utils/wrappers';
import { GlobalStyles } from './utils/globalStyles';
import { FlashLight } from './components/Flashlight';

const Container = styled.main`
  width: 100%;
`;

const INITIAL_FLASHLIGHT_STATE: FlashlightState = [false, false, false, false, false, false, false, false];

const App: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [buttonState, setButtonState] = useState<FlashlightState>(INITIAL_FLASHLIGHT_STATE);

  const onToggleButtonState = useCallback(
    (idx: number) => {
      setButtonState((p) => [...p.slice(0, idx), !p[idx], ...p.slice(idx + 1)] as FlashlightState);
    },
    [setButtonState],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % 8);
    }, 1000);

    return () => clearInterval(timer);
  }, [setCurrentIdx]);

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
                  <FlashLight
                    currentIdx={currentIdx}
                    buttonState={buttonState}
                    onToggleButtonState={onToggleButtonState}
                  />
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
