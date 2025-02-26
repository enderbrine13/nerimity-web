import Icon from '@/components/ui/icon/Icon';
import { Link, useMatch, useNavigate, useParams } from '@nerimity/solid-router';
import { For, JSXElement, Match, Show, Switch } from 'solid-js';
import useStore from '@/chat-api/store/useStore';
import RouterEndpoints from '@/common/RouterEndpoints';
import settings from '@/common/Settings';
import ItemContainer from '@/components/ui/Item';
import { css, styled } from 'solid-styled-components';
import Text from '@/components/ui/Text';
import { FlexColumn } from '../ui/Flexbox';
import env from '@/common/env';
import { Dynamic } from 'solid-js/web';
import { useCustomPortal } from '../ui/custom-portal/CustomPortal';
import { ChangelogModal } from '../ChangelogModal';
import { clearCache } from '@/common/localCache';
import socketClient from '@/chat-api/socketClient';
import { DrawerHeader } from '../DrawerHeader';
import { useTransContext } from '@nerimity/solid-i18next';


const DrawerContainer = styled(FlexColumn)`
  height: 100%;
`;

const SettingsListContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow: auto;
`;

const SettingItemContainer = styled(ItemContainer)<{nested?: boolean}>`
  height: 32px;
  gap: 5px;
  padding-left: ${props => props.nested ? '25px' : '10px'};
  margin-left: 3px;
  margin-right: 3px;
  :first {
    background-color:red;
  }

  .label {
    opacity: ${props => props.selected ? 1 : 0.6};
    transition: 0.2s;
  }

  &:hover .label {
    opacity: 1;
  }
`;

const FooterContainer = styled(FlexColumn)`
  margin-bottom: 2px;
`;

function Footer() {
  const [t] = useTransContext();
  const navigate = useNavigate();
  const {createPortal} = useCustomPortal();
  
  const onChangelogClick = () => createPortal?.(close => <ChangelogModal close={close}/>)

  const onLogoutClick = async () => {
    socketClient.socket.disconnect();
    await clearCache();
    localStorage.clear();
    navigate("/")
  }

  return (
    <FooterContainer gap={2}>
      <FooterItem color="var(--alert-color)" icon="logout" label={t('settings.drawer.logout')} onClick={onLogoutClick}  />
      <FooterItem href="https://ko-fi.com/supertiger" external icon='favorite' label={t('settings.drawer.supportMe')} />
      <FooterItem href='https://github.com/Nerimity/Nerimity-Web' external icon="code" label={t('settings.drawer.viewSource')} />
      <FooterItem icon="description" label={t('settings.drawer.changelog')} subLabel={env.APP_VERSION || "Unknown"} onClick={onChangelogClick} />
    </FooterContainer>
  );
}

export default function SettingsDrawer() {
  return (
    <DrawerContainer>
      <SettingsList />
      <Footer/>
    </DrawerContainer>
  )
}

function SettingsList () {
  const [t] = useTransContext();
  return (
    <SettingsListContainer>
      <DrawerHeader text={t('settings.drawer.title')}/>
      <For each={settings}>
        {setting => 
          <Item path={setting.path || "#  "} icon={setting.icon} label={t(setting.name)} />
        }
      </For>
    </SettingsListContainer>
  )
}




function Item (props: {path: string, icon: string, label: string, onClick?: () => void}) {
  const href = () => {
    return "/app/settings/" + props.path;
  };
  const selected = useMatch(href)

  return (
    <Link href={href()} style={{"text-decoration": "none"}}>
      <SettingItemContainer selected={selected()}>
        <Icon name={props.icon} size={18} />
        <Text class="label">{props.label}</Text>
      </SettingItemContainer>
    </Link>
  )
}


interface FooterItemProps {
  href?: string;
  external?: boolean;
  icon: string;
  label: string;
  subLabel?: string;
  onClick?: () => void
  color?: string;
}

function FooterItem (props: FooterItemProps) {

  const Content = () =>  (
    <>
      <SettingItemContainer>
        <Icon name={props.icon} color={props.color} size={18} />
        <Text class={css`margin-right: auto;`}>{props.label}</Text>
        <Text size={14} color="rgba(255,255,255,0.4)" class={css`margin-right: 5px;`} >{props.subLabel}</Text>
        <Show when={props.external}>
          <Icon class={css`margin-right: 5px;`} color="rgba(255,255,255,0.6)" name="launch" size={16} />
        </Show>
      </SettingItemContainer>
    </>
  )
  return (
    <Switch>
      <Match when={props.href}>
        <Link href={props.href!} target="_blank" rel="noopener noreferrer" style={{"text-decoration": "none"}} children={Content}/>
      </Match>
      <Match when={!props.href}>
        <div children={Content} onclick={props.onClick}/>
      </Match>
    </Switch>
  )
}