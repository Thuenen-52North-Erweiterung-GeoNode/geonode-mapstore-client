import React, {useEffect, useState, useRef} from 'react';
import head from 'lodash/head';
import isObject from 'lodash/isObject';
import { connect } from 'react-redux';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { layerSelector, groupSelector } from '../selectors/layersSelectors';
import { updateNode } from '@mapstore/framework/actions/layers';

function ExclusiveLayer(props) {
    const layers = props.layers;
    const groups = props.groups;
    const previousLayersAndGroups = useRef("");
    const [ visible, setVisible ] = useState([]);
    window.onclick = (e) => {
        if (e.target.className.includes("glyphicon-eye-open") || e.target.className.includes("glyphicon-eye-close")) {
            changeLayer();
            setVisible(!visible);
        }
    }

    useEffect(() => {
        previousLayersAndGroups.current = {
            "layers": layers,
            "groups": groups,
        };
    }, [visible])

    const changeLayer = () => {
        if ( props && previousLayersAndGroups.current && layers.length === previousLayersAndGroups.current.layers.length) {
            const changedLayer = findLayerThatChangedVisibility(layers, previousLayersAndGroups.current.layers);
            console.log(changedLayer)
            if ( changedLayer ) {
                
                const correspondingGroup = getCorrespondingGroup( props, changedLayer )
                if ( correspondingGroup && correspondingGroup.exclusiveLayer ) {
                    const allLayersInCorrespondingGroup = layers.filter((layer) => changedLayer.group === layer.group);
                    allLayersInCorrespondingGroup.forEach( layer => {
                        console.log("test")
                        if ( layer.id !== changedLayer.id ) {
                            console.log("done")
                            props.changeLayerVisibility(layer.id, 'layer', {visibility: false});
                        }
                    });
                }
            }
        }
    }
/*
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
*/

    return (
        <div></div>
    )
}

const findLayerThatChangedVisibility = (newLayers, oldLayers) => {
    for ( let i = 0; i < newLayers.length; i++ ) {
        if ( newLayers[i].visibility !== oldLayers[i].visibility ) {
            return newLayers[i] //not yet working if user changes visibility of entire group
        }
    }
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
