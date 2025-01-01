import { AppConfig } from "../config";

const THEME_DIR_URL = AppConfig.THEME_DIR_URL;
const FONT_DIR_URL = `${THEME_DIR_URL}/src/js/app`

export const AppFonts = {
  NotoSans_Medium: `${FONT_DIR_URL}/assets/fonts/NotoSans-Medium.ttf`,
  NotoSansSC_Medium: `${FONT_DIR_URL}/assets/fonts/NotoSansSC-Medium.otf`,
};
