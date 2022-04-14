import { injectable, inject } from '@cosmic/core/inversify';
import { BaseService } from './base.service';
import { FillStyle, colorDao } from '@cosmic/core/parts';
import { service } from '@cosmic/core/browser';
import Color from 'color';
import { TOKENS } from '../token';
import { v4, v5 } from 'uuid';

const DEFAULT_STYLES = {
    id: v5('cosmic', v4()),
    name: '默认名称',
    team: '',
    day: 'rgba(0, 0, 0, 0)',
};

interface SubjectSourceType {
    type: 'C' | 'U' | 'D' | 'R';
    data?: Partial<FillStyle>[] | string;
}

@injectable()
export default class FillStyleService extends BaseService<FillStyle, SubjectSourceType> {
    private colorDao: ReturnType<typeof colorDao>;
    constructor(@inject(TOKENS.GqlClient) private client: service.GqlClient) {
        super();
        this.setType('SOLID');
        this.colorDao = colorDao(client);
        this.queryList();
    }

    create() {
        const style = this.transformToLocal(DEFAULT_STYLES);
        return style;
    }

    public cloneById(styleId: string, isChangeId = true): FillStyle {
        const style = this.get(styleId);
        const fillStyle = new FillStyle(isChangeId ? v5('cosmic', v4()) : styleId);
        const { opacity, color, name } = style;
        fillStyle.name = name;
        fillStyle.opacity = opacity;
        fillStyle.color = {...color};
        return fillStyle;
    }

    transformToLocal(servicerColor: Partial<gql.Color>) {
        const{day, name, id} = servicerColor;
        const color = new Color(day).object();
        const fillStyle = new FillStyle(id as string);
        fillStyle.opacity = 1;
        fillStyle.color = color as any;
        fillStyle.name = name as any;
        return fillStyle;
    }

    transformToService(fillStyle: FillStyle) {
        const { name, color, opacity } = fillStyle;
        return { 
            name,
            team: '6166bd9cc13b026875181927',
            day: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`,
            night: '',
            dark: '',
        };
    }

    public async queryList() {
        const { data }= await this.colorDao.query({});
        const colors = data?.colors || [];
        this.serviceStyles.clear();
        colors.filter(color => color.day)
        .map(color => this.transformToLocal(color))
        .forEach(color => this.addServiceStyle(color));
        this.subject.next({type: 'R', data: this.getServiceStyles()});
    }

    public async updateStyle(fillStyle: FillStyle) {
        const style =  this.transformToService(fillStyle);
        const update = await this.colorDao.update({...style, id: fillStyle.id});
        const isSeccess = update.data?.updateColor;
        if (isSeccess) {
            await this.queryList();
            this.subject.next({type: 'U', data: fillStyle.id});
        }
    }

    public async saveStyle(id: string) {
        const style = this.transformToService(this.get(id));
        const creatOption = await this.colorDao.create(style);
        await this.queryList();
        this.subject.next({type: 'C', data: creatOption.data?.createColor?.id as string});
    }
 
}