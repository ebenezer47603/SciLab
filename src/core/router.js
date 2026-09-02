const routes = new Map();

export function registerRoute(name, component) {
    routes.set(name, component);
}

export function getRoute(name) {
    return routes.get(name);
}

export function hasRoute(name) {
    return routes.has(name);
}

export function getRoutes() {
    return routes;
}