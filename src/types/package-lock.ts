// https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#file-format

interface Base {
  version?: string;
  integrity?: string;
  resolved?: string;
  dev?: boolean;
  optional?: boolean;
  devOptional?: boolean;
}

export interface Package extends Base {
  name?: string;
  inBundle?: boolean;
  hasInstallScript?: boolean;
  hasShrinkWrap?: boolean;
  license?: string;
  bin?: Record<string, string>;
  engines?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export interface Dependency extends Base {
  bundled?: boolean;
  requires?: Record<string, string>;
  dependencies?: Record<string, Dependency>;
}

export interface PackageLock {
  name: string;
  version?: string;
  lockfileVersion: number;
  packages: Record<string, Package>;
  dependencies: Record<string, Dependency>;
}
