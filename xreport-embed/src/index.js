import * as renderer from './xreport-render.js';

export function makeWidget(url, targetId) {
  return renderer.render(url, targetId);
}
