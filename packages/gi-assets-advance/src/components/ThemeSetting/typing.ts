export interface ITheme {
  id: string;
  name?: string;
  canvasConfig: any;
  nodesConfig: any;
  edgesConfig: any;
  cover?: string;

}

export interface IThemeSettingState {
  themes: ITheme[];
  isAddingTheme: boolean;
}
