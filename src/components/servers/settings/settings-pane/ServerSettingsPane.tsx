import serverSettings from '@/common/ServerSettings';
import { Route, Routes, useParams } from '@nerimity/solid-router';
import {createSignal, For, Show } from 'solid-js';
import ServerSettingsHeader from './ServerSettingsHeader';
import useStore from '@/chat-api/store/useStore';
import { styled } from 'solid-styled-components';
import Text from '@/components/ui/Text';
import { useTransContext } from '@nerimity/solid-i18next';


const SettingsPaneContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 900px;
  align-self: center;
`;

export default function ServerSettingsPane() {
  const [t] = useTransContext();
  const params = useParams();
  const {servers} = useStore();

  const [updateHeader, setUpdateHeader] = createSignal<{name?: string, avatar?: any}>({});


  const server = () => servers.get(params.serverId);

  return (
    <Show when={server()}>
      <SettingsPaneContainer>
        <ServerSettingsHeader headerPreviewDetails={updateHeader()}  />
        <For each={serverSettings}>
          {setting => (
            <Routes>
              {setting.path && <Route path={`/${setting.path}`} component={() => (
                <>
                  <Text style={{"margin-left": "10px"}}  size={24}>{t(setting.name)}</Text>
                  <setting.element updateHeader={setUpdateHeader} />
                </>
              )} />}
            </Routes>
          )}
        </For>
      </SettingsPaneContainer>
    </Show>
  );
}