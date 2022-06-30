export interface IVersionObj {
    version: string;
    type: "feature" | "bugfix"
    content: string;
    image: string;
    url: string;
}
