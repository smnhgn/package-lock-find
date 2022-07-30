import _ from "lodash";
import path from "path";
import fsp from "fs/promises";

import { Dependency, Package, PackageLock } from "../types/package-lock";

type DependencyRecord = [string, Dependency];

type DependencyResult = {
  dependency: Dependency;
  history: DependencyRecord[];
};

type PackageRecord = [string, Package];

type PackageResult = {
  package: Package;
  history: PackageRecord[];
};

export const readPackageLock = async (unresolvedPath: string): Promise<PackageLock> => {
  const resolvedPath = path.resolve(unresolvedPath, "package-lock.json");
  const packageLockJson = await fsp.readFile(resolvedPath, { encoding: "utf-8" });
  const packageLock = JSON.parse(packageLockJson) as PackageLock;

  return packageLock;
};

export const findDependency = (
  dependencyName: string,
  dependencyMap: Record<string, Dependency>,
  dependencyHistory: DependencyRecord[] = []
): DependencyResult[] => {
  const dependencyRecords: DependencyRecord[] = Object.entries(dependencyMap);

  return dependencyRecords.flatMap((dependencyRecord) => {
    const [currentDependencyName, currentDependency] = dependencyRecord;
    const currentDependencyHistory = [...dependencyHistory, dependencyRecord];

    if (dependencyName === currentDependencyName) {
      return {
        dependency: currentDependency,
        history: currentDependencyHistory,
      };
    }

    if (currentDependency.dependencies) {
      return findDependency(
        dependencyName,
        currentDependency.dependencies,
        currentDependencyHistory
      );
    }

    return [];
  });
};

const findPackageRecord = (
  packagePath: string,
  packageRecords: PackageRecord[]
): PackageRecord | undefined => {
  return packageRecords.find(([pkgPath]) => pkgPath === packagePath);
};

const buildPackageRecord = (name: string, pkg: Package): PackageRecord => {
  return [name, pkg];
};

const formatPackageName = (packagePath: string): string => {
  return _.chain(packagePath)
    .split(/\/?node_modules\//)
    .compact()
    .last()
    .value();
};

export const findPackage = (
  packageName: string,
  packageMap: Record<string, Package>
): PackageResult[] => {
  const packageRecords: PackageRecord[] = Object.entries(packageMap);

  return packageRecords.flatMap(([currentPackagePath, currentPackage]) => {
    const packagePath = `node_modules/${packageName}`;

    if (currentPackagePath.endsWith(packagePath)) {
      const packageNames = _.compact(currentPackagePath.split(/\/?node_modules\//));
      const packagePaths = _.chain(packageNames)
        .keys()
        .map((index) => packageNames.slice(0, packageNames.length - +index))
        .map((previousNames) => `node_modules/${previousNames.join("/node_modules/")}`)
        .reverse()
        .value();

      const packageHistory = _.chain(packagePaths)
        .map((packagePath) => findPackageRecord(packagePath, packageRecords))
        .compact()
        .map(([packagePath, pkg]) => buildPackageRecord(formatPackageName(packagePath), pkg))
        .value();


      return {
        package: currentPackage,
        history: packageHistory,
      };
    }

    return [];
  });
};
