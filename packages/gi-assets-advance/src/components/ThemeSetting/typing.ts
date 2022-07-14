export interface ICanvasConfig {
  backgroundColor: string;
  backgroundImage?: string;  
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
  selectedTheme: string,
  isAddingTheme: boolean;
}
