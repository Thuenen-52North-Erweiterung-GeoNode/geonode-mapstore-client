import isObject from 'lodash/isObject';

export const layerSelector = (state) => {
    const layers = state.layers.flat.filter(layer => filterLayers(layer));
    return layers;
};

function filterLayers(layer) {
    if (layer.group != 'background') {
        return layer;
    }
}

export const groupSelector = (state) => {
    return returnGroup(state.layers.groups);
}

const returnGroup = (groups) => {
    if ( Array.isArray(groups) ) {
        const listOfGroups = [];
        let getGroups = (list) => {
            list.forEach(element => {
                if ( isObject(element) ) {
                    listOfGroups.push(element);
                    if ( element.nodes ) {
                        getGroups(element.nodes);
                    }
                }
            });
        }        
        getGroups(groups);
        return listOfGroups;
    } else {
        return [];
    }
}
