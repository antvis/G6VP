export interface ICanvasConfig {
  backgroundColor: string;
  backgroundImage: string;  
}

export interface ITheme {
  id: string;
  name?: string;
  canvasConfig: ICanvasConfig;
  nodesConfig: any;
  edgesConfig: any;
  cover?: string;

}

export interface IThemeSettingState {
  themes: ITheme[];
  currentThemeId: string;
  status: "show" | "add" | "update";
  // currentTheme 字段用于编辑主题
  currentTheme?: ITheme;
}
