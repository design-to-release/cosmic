import { type Observable, of } from '@cosmic/core/rxjs';
import { injectable } from '@cosmic/core/inversify';

import { type SenceNode } from '@cosmic/core/parts';

@injectable()
export default class NodeService {
    selection() {
        console.log('NodeService', '==========================');
        return of() as Observable<SenceNode>;
    }
}