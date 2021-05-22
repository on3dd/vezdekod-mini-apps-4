import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import '@vkontakte/vkui/dist/vkui.css';
import bridge, { VKBridgeEvent, AnyReceiveMethodName, UpdateConfigData } from '@vkontakte/vk-bridge';
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  SplitLayout,
  Panel,
  Group,
  Title,
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

type FlashlightError = {
  error_type: string;
  error_data: Record<string, unknown>;
};

const App: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>();
  const [flashlightError, setFlashlightError] = useState<FlashlightError>();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [buttonState, setButtonState] = useState<FlashlightState>(INITIAL_FLASHLIGHT_STATE);

  const onToggleButtonState = useCallback(
    (idx: number) => {
      setButtonState((p) => [...p.slice(0, idx), !p[idx], ...p.slice(idx + 1)] as FlashlightState);
    },
    [setButtonState],
  );

  useEffect(() => {
    bridge.send('VKWebAppFlashGetInfo');

    bridge.subscribe(({ detail }: VKBridgeEvent<AnyReceiveMethodName>) => {
      if (detail.type === 'VKWebAppUpdateConfig') {
        console.log('VKWebAppUpdateConfig', detail.data);

        const schemeAttribute = document.createAttribute('scheme');

        schemeAttribute.value = detail.data.scheme ? detail.data.scheme : 'client_light';

        document.body.attributes.setNamedItem(schemeAttribute);
      }

      if (detail.type === 'VKWebAppFlashGetInfoResult') {
        console.log('VKWebAppFlashGetInfoResult', detail.data.is_available);
        setIsAvailable(() => detail.data.is_available);
      }

      if (detail.type === 'VKWebAppFlashGetInfoFailed') {
        console.log('VKWebAppFlashGetInfoFailed', detail.data);
        setFlashlightError(() => detail.data);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAvailable) {
        setCurrentIdx((prev) => (prev + 1) % 8);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isAvailable, setCurrentIdx]);

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

                  <Group style={{ padding: '0.5rem 1rem' }}>
                    <Title level="2" weight="regular">
                      Is flashlight available: {`${isAvailable}`}
                    </Title>
                  </Group>

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
