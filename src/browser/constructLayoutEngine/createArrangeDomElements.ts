import { getMountedApps } from "single-spa";
import { ResolvedRoutesConfig } from "../../isomorphic";
import { applicationElementId } from "../../utils";
import { recurseRoutes } from "./recurseRoutes";
import { getParentContainer, getPath } from "./utils";

export const createArrangeDomElements =
  ({ base, containerEl, mode, routes }: ResolvedRoutesConfig) =>
  () => {
    const baseWithoutSlash = base.substring(0, base.length - 1);
    const path = getPath(mode);
    // Base URL doesn't match, no need to recurse routes
    if (!path.startsWith(baseWithoutSlash)) return;

    // We need to move, not destroy + recreate, application container elements
    const applicationContainers = Object.fromEntries(
      getMountedApps().map((name) => [
        name,
        document.getElementById(applicationElementId(name))!,
      ])
    );
    recurseRoutes({
      applicationContainers,
      location: window.location,
      parentContainer: getParentContainer(containerEl),
      previousSibling: undefined,
      routes,
      shouldMount: true,
    });
  };
