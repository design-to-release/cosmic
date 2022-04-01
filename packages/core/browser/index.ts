import { createApp, ref, type App as VueApp } from 'vue';

import { MComponent } from '@cosmic-module/core';
import { SanComponent } from '@cosmic-module/san-loader';
import { createContainer, TOKENS, type RouterServiceAPI } from './service/index';
import App from './app.vue';

import type { BootstrapOption } from '@cosmic/core/parts';

import MColor from './component/color/color.vue';
import MClolorWidget from './component/color/color-widget.vue';
import MTitle from './component/title/title.vue';
import MWidget from './component/widget/widget.vue';
import MStandardModal from './component/modal/standard-modal.vue';
import MDetailModal from './component/modal/detail-modal.vue';
import type { GqlClient } from './service/index';
import MStandard from './component/standard/standard.vue';


function bootstrap(option: BootstrapOption) {
    const app = createApp(App);

    // eslint-disable-next-line vue/component-definition-name-casing
    app.component('m-component', MComponent);
    app.component('SComponent', SanComponent);

    // ioc container
    const container = createContainer({ defaultScope: 'Singleton' });


    const routerPlugin = container.get<RouterServiceAPI>(TOKENS.Router);
    app.use(routerPlugin.getRouterConfig());
    const urql = container.get<GqlClient>(TOKENS.GqlClient);

    app.use(function (app: VueApp) {
        app.provide('$urql', ref(urql));
    });

    app.provide('container', container);
    app.mount(option.root);

}

export { bootstrap };

// export * as service from './service/index';
export * as urql from '@urql/vue';
export * as router from 'vue-router';
export { default as lodash } from 'lodash';
export { default as color } from 'color';

export { MColor, MTitle, MWidget, MStandardModal, MStandard, MDetailModal, MClolorWidget};

export * from './use';
export * as service from './service/index';
