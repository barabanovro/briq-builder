import { reactive, watchEffect, markRaw } from 'vue';

const store = reactive({
    useSAO: false,
    useRealAA: true,
    planeColor: "#a93a00",
    gridColor: "#eaeaea",
    backgroundColor: "#eaeaea",
});

export function resetStore() {
    store.useSAO = false;
    store.useRealAA = true;
    store.planeColor = "#a93a00";
    store.gridColor = "#eaeaea";
    store.backgroundColor = "#eaeaea";
}

for (let key in store)
{
    let val = window.localStorage.getItem("setting_" + key);
    if (val)
        store[key] = JSON.parse(val);
}
export default store;

watchEffect(() => {
    for (let key in store)
        window.localStorage.setItem("setting_" + key, JSON.stringify(store[key]));
});