import type { Module } from '@cosmic/core/parts';
import { GesturePlugin } from '@vueuse/gesture';
import creator from './src/common/creator';
import select from './src/common/select';
import stroke from './src/common/stroke';
import effect from './src/common/effect';
import root from './src/index.vue';
import childrenRender from './src/render/children.vue';
export default {
  root,
  imports: [
    '@cosmic-module/app-editor',
  ],
  init: (app) => {
    app.use(GesturePlugin);
    app.directive('creator', creator);
    app.directive('select', select);
    app.directive('stroke', stroke);
    app.directive('effect', effect);
    app.component('ChildrenRender', childrenRender);
  },
} as Module;
