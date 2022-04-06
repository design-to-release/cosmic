import { type Client, createClient } from '@urql/vue';

import { gqlClientOptions }  from '@cosmic/core/parts';


export type GqlClient = Client;

export function create() {
    return createClient(gqlClientOptions);
}

