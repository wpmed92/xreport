import * as renderer from './xreport-render.js';

export function makeWidget(url, title, targetId) {
  return renderer.render(url, title, targetId);
}
