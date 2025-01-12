<script lang="ts" setup>
import { watchEffect, ref } from 'vue';
import Region from '../../common/component/region.vue';
import ColorPreview from '../component/preview/color.vue';
import CompCard from '../component/card/comp.vue';
import { useRoute } from '@cosmic/core/router';
import { queryOne } from '../api/color';
import ColorDialog from '../component/dialog/atom/color.vue';
import { useQuery } from '@cosmic/core/urql';


const route = useRoute();

const { type: atomType, id } = route.query as { id: string, type: string };

const color = ref<Partial<gql.Color>>({});
const prefabs = ref<gql.Prefab[]>([]);

const { data, fetching, executeQuery } = queryOne(id);
const {data: prefabData, fetching: prefabFetching } = useQuery<{ prefabs: gql.Prefab[] }>({
    query: `
        query prefabs {
            prefabs {
                id
                name
                preview
                desc
                atoms
            }
    }`,
});

watchEffect(() => {
    if (atomType === 'color' && id && data.value?.getColor && !fetching.value) {
        color.value = data.value.getColor || {};
    }
    if (prefabData.value && !prefabFetching.value && color.value.id) {
        prefabs.value = prefabData.value.prefabs.filter(c => {
            return c.atoms.indexOf(color.value.id as string) > -1;
        });
    }
});

function refresh() {
    executeQuery({ requestPolicy: 'network-only' });
}

</script>
<template>
    <Region :title="color.name">
        <color-preview v-if="atomType === 'color'" v-bind="color" />
        <template #extra>
            <div class="flex justify-end">
                <color-dialog v-if="atomType === 'color'" :atom-type="atomType" v-bind="color" @success="refresh" />
            </div>
        </template>
    </Region>
    <Region title="预置" inverse>
        <div :class="$style['comp-list']">
            <comp-card
                v-for="item in prefabs"
                :id="item.id"
                :key="item.id"
                :img="item.preview"
                :name="item.name"
            />
        </div>
    </Region>
</template>


<style module>
.comp-list {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 24px;
    column-gap: 24px;
}
@media (min-width: 960px) {
    .comp-list {
        grid-template-columns: 1fr 1fr;
    }
}
@media (min-width: 1280px) {
    .comp-list {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
@media (min-width: 1920px) {
    .comp-list {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}
.filter {
    overflow-x: scroll;
}
.filter::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
</style>
