export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  interface RoutesType {
    name: string;
    component?: JSX.Element;
    icon?: JSX.Element | string;
    path: string;
    regex?: RegExp;
    resource?: string;
    noLayout?: boolean;
    level: number;
    sidebar: boolean;
    children?: Array<RoutesType>;
  }
}
