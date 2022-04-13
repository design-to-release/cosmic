import { toRaw } from 'vue';
import { MinimalStrokesMixin, util, Paint } from '@cosmic/core/parts';

export default {
    mounted(el: HTMLElement, binding: any) {
        changeStyle(el, binding);
    },
    updated(el: HTMLElement, binding: any) {
        changeStyle(el, binding);
    },
};

function changeStyle(el: HTMLElement, binding: any) {
    const node = toRaw(toRaw(binding.value).target) as MinimalStrokesMixin & { strokeId: string, style: string };
    
    const { strokeWeight, style, strokeId, strokes = [] } = node;
    if (!strokeId) {
        el.style.border = 'none';
        return;
    }
    const [fill] = strokes;
    const color = util.toBackgroundStyle(fill as Paint);
    el.style.border = `${strokeWeight}px ${style} ${color}`;
}