import React, {useEffect, useState, useRef} from 'react';
import head from 'lodash/head';
import isObject from 'lodash/isObject';
import { connect } from 'react-redux';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { layerSelector, groupSelector } from '../selectors/layersSelectors';
import { updateNode } from '@mapstore/framework/actions/layers';

function ExclusiveLayer(props) {
    //console.log(props.layers)
    //console.log("start excl. layer")
    const layers = props.layers;
    const groups = props.groups;
    const previousLayers = useRef("");
    const [ clicked, setClicked ] = useState(false);
    window.onclick = (e) => {
        if (e.target.className.includes("glyphicon-eye")) {
            setClicked(true);
        }
    }

    useEffect(() => {
        //console.log("useEffect before init", previousLayers.current)
        previousLayers.current = {
            "layers": layers,
            "groups": groups,
        };
        //console.log("useEffect after init", previousLayers.current)
    }, [clicked])

    /*if ( props.layers.length !== previousLayers.current.length && previousLayers.current.length > 0 ) {
        console.log("uneuqla")
        //setClicked(false)
    }
    console.log("layers length check",props.layers.length, previousLayers.current.length, props.layers.length === previousLayers.current.length) // && previous.current*/

    if ( previousLayers.current.groups && groups.length === previousLayers.current.groups.length ) {
        for ( let i=0; i<groups.length; i++ ) {
            if ( groups[i].exclusiveLayer && !previousLayers.current.groups[i].exclusiveLayer ) {
                const layersInGroup = props.layers.filter((layer) => groups[i].id === layer.group);
                let countVisibleLayers = 0;
                layersInGroup.forEach((layer) => {
                    if (layer.visibility) countVisibleLayers++;
                });
                if (countVisibleLayers>1) {
                    layersInGroup.forEach((layer) => {
                        props.changeLayerVisibility(layer.id, 'layer', {visibility: false});
                    })
                }
            }
        }
    }

    if ( clicked && layers.length === previousLayers.current.layers.length ) {
        //console.log("first if condition", clicked && layers.length === previousLayers.current.length)
        for ( let i = 0; i < layers.length; i++ ) {
            if ( layers[i].visibility !== previousLayers.current.layers[i].visibility ) {
                const correspondingGroup = getCorrespondingGroup( props, layers[i] )
                //console.log("corresponding group", correspondingGroup )
                if ( correspondingGroup && correspondingGroup.exclusiveLayer ) {                    
                    //console.log("second if condition")
                    const allLayersInCorrespondingGroup = props.layers.filter((layer) => layers[i].group === layer.group);
                    allLayersInCorrespondingGroup.forEach( layer => {
                        if ( layer.id != layers[i].id ) {
                            props.changeLayerVisibility(layer.id, 'layer', {visibility: false});
                        }
                    });
                    setClicked(false);
                }
            }
        }
    }

    return (
        <div></div>
    )
}

const getCorrespondingGroup = ( props, layer ) => {
    const corrGr = head(props.groups.filter((group) => isObject(group) && group.id === layer.group));
    if ( corrGr !== undefined ) {
        return corrGr;
    } else {
        return head(props.groups.filter((group) => isObject(group) && group.id === "Default"));
    }
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
