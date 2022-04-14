import { Container, type interfaces  }  from '@cosmic/core/inversify';
import { TOKENS } from './token';
import { create as createGqlClient, type GqlClient } from './gql-client/index.service';
import { RouterService } from './router/index.service';
import NodeService from './document/node.service';
import ComponentService from './document/component.service';
import TextStyleService from './styles/text-style.service';
import KeyboardService from './interactivity/keyboard.service';
import FillStyleService from './styles/fill-style.service';
import RadiusStyleService from './styles/radius-style.service';
import EffectStyleService from './styles/effect-style.service';
import StrokeStyleService from './styles/stroke-style.service';
import ToolService from './interactivity/tool.service';
import DraftService from './document/draft.service';


/**
 * @description put all service coupling loigc here
 */
export function load(options: interfaces.ContainerOptions) {
    const container = new Container(options);

    // urql: gql client
    container.bind<GqlClient>(TOKENS.GqlClient).toConstantValue(createGqlClient());
    // router
    container.bind<RouterService>(TOKENS.Router).toConstantValue(RouterService.create());

    container.bind<KeyboardService>(TOKENS.Keyboard).to(KeyboardService);
    container.bind<ToolService>(TOKENS.Tool).to(ToolService);

    container.bind<NodeService>(TOKENS.Node).to(NodeService);
    container.bind<DraftService>(TOKENS.Draft).to(DraftService);
    container.bind<TextStyleService>(TOKENS.TextStyle).to(TextStyleService);
    container.bind<FillStyleService>(TOKENS.FillStyle).to(FillStyleService);
    container.bind<RadiusStyleService>(TOKENS.RadiusStyle).to(RadiusStyleService);
    container.bind<EffectStyleService>(TOKENS.EffectStyle).to(EffectStyleService);
    container.bind<StrokeStyleService>(TOKENS.StrokeStyle).to(StrokeStyleService);
    container.bind<ComponentService>(TOKENS.Component).to(ComponentService);

    return container;
}
