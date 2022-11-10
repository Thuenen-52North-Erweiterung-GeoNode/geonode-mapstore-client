export const layerSelector = (state) => {
    const layers = state.layers.flat.filter(layer => filterLayers(layer));
    return layers;
};

function filterLayers(layer) {
    if (layer.group != 'background') {
        return layer;
    }
}