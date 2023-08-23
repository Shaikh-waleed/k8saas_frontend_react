import React from "react";
import MenuItem from "../MenuItem";
import { LogoIcon, HomeIcon, CloudUploadAltIcon, BellIcon, SettingsIcon, HelpIcon, LogoWithoutNameIcon, ClusterIcon } from "../../theme/svgs";

interface Props {}

const MainMenu: React.FC<Props> = () => {
  return (
    <div className="bg-MenuBarBg rounded-[8px] md:rounded-[12px] md:p-4 py-2 flex flex-col item-center w-1/5">
      <img src={LogoIcon} alt={"logo"} className="w-60 h-16 mb-2 hidden md:inline-block" />
      <img src={LogoWithoutNameIcon} alt={"logo"} className="w-18 h-18 mb-4 inline-block md:hidden self-center" />
      <MenuItem href={"/"} leftIcon={HomeIcon} leftIconAlt={"home-icon"} label={"Home"} />
      <MenuItem href={"/cloud-profiles"} leftIcon={CloudUploadAltIcon} leftIconAlt={"cloud-profiles-icon"} label={"Cloud Profiles"} />
      <MenuItem href={"/clusters"} leftIcon={ClusterIcon} leftIconAlt={"cluster-icon"} label={"Clusters"} />
      <MenuItem href={"/notifications"} leftIcon={BellIcon} leftIconAlt={"bell-icon"} label={"Notifications"} />
      <MenuItem href={"/settings"} leftIcon={SettingsIcon} leftIconAlt={"settings-icon"} label={"Settings"} />
      <MenuItem href={"/help"} leftIcon={HelpIcon} leftIconAlt={"help-icon"} label={"Help"} />
    </div>
  );
};

export default MainMenu;
