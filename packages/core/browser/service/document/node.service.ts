import { type Observable, Subject, BehaviorSubject, of } from '@cosmic/core/rxjs';
import { injectable } from '@cosmic/core/inversify';
import { serialize } from '@cosmic/core/parts';


import { type SceneNode, type FrameNodeOptions, type TextNodeOptions, type ComponentNodeOptions, FrameNode, DocumentNode, PageNode, ComponentNode, TextNode, SolidPaint, GroupNode } from '@cosmic/core/parts';

@injectable()
export default class NodeService {
    public document: Subject<DocumentNode>;
    public selection: Subject<Array<PageNode | SceneNode>>;
    public currentPage: Subject<PageNode>;
    public renderNodes: Subject<[SceneNode[], string]>;

    private _document: DocumentNode;
    private _selection: Array<PageNode | SceneNode> = [];
    private _currentPage: PageNode;

    constructor() {
        this._document = new DocumentNode();
        this.document = new BehaviorSubject(this._document);
        this.selection = new Subject();
        this.renderNodes = new Subject();
        this.addPage();
    }
    new() {
        const document = new DocumentNode();
        this.load(document);
        this.addPage();
    }
    setSelection(ids: string[]) {
        if (ids.length === 0) {
            // do sth
            this._selection = [];
        } else if (ids.length === 1) {
            this._selection = [this._document.findOne(node => node.id == ids[0])];
        } else {
            this._selection = this._document.findAll(node => ids.indexOf(node.id) > -1);
        }
        if (this._selection.length) {
            this.updateCurrentPage(findParentPage(this._selection[0]));
        }
        this.selection.next(this._selection);
    }
    addPage() {
        const page = new PageNode();
        page.name = `页面 ${increaseId(this._document, page.type)}`;
        page.backgrounds = [new SolidPaint({r: 244, g: 244, b: 244})];
        this._document.appendChild(page);
        this.updateDocument();
        this.setSelection([page.id]);
    }
    addFrame(target: PageNode | FrameNode | GroupNode, options?: FrameNodeOptions) {
        // const page = this._selection.filter(node => node.type === 'PAGE').at(0) as PageNode;
        // if (!page) return;
        const frame = new FrameNode(options);
        frame.name = `画框 ${increaseId(this._document, frame.type)}`;
        frame.parent = target;
        frame.backgrounds = [new SolidPaint({r: 255, g: 255, b: 255})];
        target.appendChild(frame);
        this.updateDocument();
        this.setSelection([frame.id]);
        return frame;
    }

    addText(target: PageNode | FrameNode | GroupNode, option: TextNodeOptions) {
        const textNode = new TextNode(option);
        textNode.name = `文本 ${increaseId(this._document, textNode.type)}`;
        textNode.fills = [new SolidPaint({r: 0, g: 0, b: 0})];
        textNode.parent = target;
        target.appendChild(textNode);
        this.updateDocument();
        this.setSelection([textNode.id]);
        return textNode;
    }

    addComponent(target: PageNode | FrameNode | GroupNode, options?: ComponentNodeOptions) {
        // const page = this._selection.filter(node => node.type === 'PAGE').at(0) as PageNode;
        // if (!page) return;
        const comp = new ComponentNode(options);
        comp.name = `组件 ${comp.cname} ${increaseId(this._document, comp.type)}`;
        comp.parent = target;
        target.appendChild(comp);
        this.updateDocument();
        this.setSelection([comp.id]);
        return comp;
    }
    deleteSelection() {
        let shouldChangePage = false;
        this._selection.forEach(node => {
            if (node.id === this._currentPage.id) {
                shouldChangePage = true;
            }
            node.remove();
        });
        this.document.next(this._document);
        if (shouldChangePage && this._document.children.length) {
            this.updateCurrentPage(this._document.children[0]);
            this.setSelection([this._document.children[0].id]);
        } else {
            this.setSelection([]);
        }
    }
    updateDocument() {
        this.document.next(this._document);
        if (this._currentPage) this.currentPage.next(this._currentPage);
    }
    updateCurrentPage(page?: PageNode) {
        if (page && page.id !== this._currentPage?.id) {
            this._currentPage = page;
            if (this.currentPage) {
                this.currentPage.next(this._currentPage);
            } else {
                this.currentPage = new BehaviorSubject(this._currentPage);
            }
        }
    }
    update(nodes: SceneNode[]) {
        this.renderNodes.next([nodes, new Date().getTime().toString()]);
    }

    getSelection(): Array<PageNode | SceneNode> {
        return this._selection;
    }

    serialize() {
        const result = {
            // document: this._document.serialize(),
        };
        return result;
    }

    load(doc: DocumentNode) {
        this._document = doc;
        this._currentPage = doc.children[0] || undefined;
        this._selection = [];
        this.updateDocument();
        this.updateCurrentPage();
        this.setSelection([]);
    }
}

function increaseId(document: DocumentNode | PageNode, type: string) {
    const existed = document.findAll(node => node.type === type);
    return existed.length + 1;
}

function findParentPage(node: PageNode | SceneNode): PageNode | undefined {
    if (node && node.type === 'PAGE') {
        return node as PageNode;
    }
    if (node && node.parent) {
        return findParentPage(node.parent as any);
    }
    return;
}
