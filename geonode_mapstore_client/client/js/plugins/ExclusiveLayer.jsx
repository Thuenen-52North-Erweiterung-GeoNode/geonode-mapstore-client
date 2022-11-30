import React, {useEffect, useState, useRef} from 'react';
import head from 'lodash/head';
import isObject from 'lodash/isObject';
import { connect } from 'react-redux';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { layerSelector, groupSelector } from '../selectors/layersSelectors';
import { updateNode } from '@mapstore/framework/actions/layers';

function ExclusiveLayer(props) {
    const layers = props.layers;
    const previousLayers = useRef("");
    const [ clicked, setClicked ] = useState(false);
    window.onclick = (e) => {
        //console.log(e)
        if (e.target.className.includes("glyphicon-eye-open")) {
            setClicked(true);
        }
    }

    useEffect(() => {
        previousLayers.current = layers;
    }, [clicked])

    if ( clicked && layers.length === previousLayers.current.length ) {
        for ( let i = 0; i < layers.length; i++ ) {
            //console.log(layers[i].visibility !== previousLayers.current[i].visibility)
            if ( layers[i].visibility !== previousLayers.current[i].visibility ) {
                const correspondingGroup = head(props.groups.filter((group) => isObject(group) && group.id === layers[i].group));   
                if ( correspondingGroup && correspondingGroup.exclusiveLayer ) {                    
                    const allLayersInCorrespondingGroup = props.layers.filter((layer) => layers[i].group === layer.group);
                    allLayersInCorrespondingGroup.forEach( layer => {
                        //console.log(layers[i].title, layer.id != layers[i].id)
                        if ( layer.id != layers[i].id ) {
                            props.changeLayerVisibility(layer.id, 'layer', {visibility: false});
                        }
                        //props.changeLayerVisibility(layers[i].id, 'layer', {visibility: true});
                    });
                    //console.log("-------------------------------------------------------------")
                    setClicked(false);
                }
            }
        }
    }

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
