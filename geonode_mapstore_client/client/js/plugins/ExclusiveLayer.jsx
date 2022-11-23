import React, {useEffect, useState} from 'react';
import head from 'lodash/head';
import isObject from 'lodash/isObject';
import { connect } from 'react-redux';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { layerSelector, groupSelector } from '../selectors/layersSelectors';
import { updateNode } from '@mapstore/framework/actions/layers';

function ExclusiveLayer(props) {
    
    const [ clicked, setClicked ] = useState(false);
    window.onclick = () => {
        setClicked(true);
    }
    props.layers.forEach(element => {
        useEffect(() => {
            const correspondingGroup = head(props.groups.filter((group) => isObject(group) && group.id === element.group));
            if ( correspondingGroup && correspondingGroup.exclusiveLayer && clicked ) {
                const allLayersInCorrespondingGroup = props.layers.filter((layer) => element.group === layer.group);
                allLayersInCorrespondingGroup.forEach( layer => {
                    if ( layer.id != element.id ) {
                        props.changeLayerVisibility(layer.id, 'layer', {visibility: false});
                    }
                });
                setClicked(false);
            }
        }, [element.visibility]);
    });
    return (
        <div></div>
    )
}

const ExclusiveLayerPlugin = connect((state) => ({
    layers: layerSelector(state),
    groups: groupSelector(state),
}), {
    changeLayerVisibility: updateNode,
})(ExclusiveLayer);

export default createPlugin('ExclusiveLayer', {
    component: ExclusiveLayerPlugin,
});
