import { injectable } from '@cosmic/core/inversify';
import { BaseService } from './base.service';
import { TextStyle } from '@cosmic/core/parts';

/**
 * todo: figma 字体没有fontweight
 */

@injectable()
export default class TextService extends BaseService<TextStyle> {
    constructor() {
        super();
        this.setType('TEXT');
        [1,2,3,4].map(item => this.transformToLocal({
            id: item + '',
            description: item,
            name: item,
            fontSize: '12',
            fontFamily: '1',
            style: '',
            lineHeight: item + 10,
        })).map(item => this.addLocalStyle(item));

        [5,6,7,8].map(item => this.transformToLocal({
            id: item + '',
            description: item,
            name: item,
            fontSize: '12',
            fontFamily: '1',
            style: '',
            lineHeight: item + 10,
        })).map(item => this.addServiceStyle(item));
    }

    public create(): TextStyle  {
        const style = this.transformToLocal();
        return this.addLocalStyle(style);
    }

    public fetchServiceStyles(): TextStyle[] {
        this.setserviceStyles([]);
    }

    public transformToLocal(fontStyle: gql.Font): TextStyle {
        const textStyle = new TextStyle();
        const { id, name, fontSize, fontFamily = '1', style, lineHeight = 10, description } = fontStyle;
        textStyle.description = description;
        textStyle.id = id;
        textStyle.name = name;
        textStyle.fontSize = fontSize;
        textStyle.fontName = { fontFamily, style };
        textStyle.lineHeight = {value: lineHeight};
        textStyle.letterSpacing = {value: '10'};
        textStyle.paragraphSpacing = '1';
        return textStyle;
    }

    public transformToService(): any {
        return {} as TextStyle;
    }

}