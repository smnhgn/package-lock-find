import path from "path";
import fsp from "fs/promises";

import { Dependency, PackageLock } from "../types/package-lock";

type DependencyRecord = [string, Dependency];

type DependencyResult = {
  dependency: Dependency;
  history: DependencyRecord[];
};

export const readPackageLock = async (unresolvedPath: string): Promise<PackageLock> => {
  const resolvedPath = path.resolve(unresolvedPath, "package-lock.json");
  const packageLockJson = await fsp.readFile(resolvedPath, { encoding: "utf-8" });
  const packageLock = JSON.parse(packageLockJson) as PackageLock;

  return packageLock;
};

export const findDependencyByName = (
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
      return findDependencyByName(
        dependencyName,
        currentDependency.dependencies,
        currentDependencyHistory
      );
    }

    return [];
  });
};
