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
    const [ prevVals, updatePrevVals ] = useState([]);
    let onGroup = false;

    window.onclick = (e) => {
        const clickedItem = e.target
        if ( clickedItem.className.includes("glyphicon-eye-open") || clickedItem.className.includes("glyphicon-eye-close") ) {
            onGroup = checkIfClickedOnGroup(clickedItem);
            if ( onGroup.clicked && onGroup.open ) {
                checkExclusiveGroupsForConsistency(groups, layers);
            } else {
                changeLayerVisibility();
            }
            updatePrevVals(!prevVals);
        }
    }

    useEffect(() => {
        previousLayersAndGroups.current = {
            "layers": layers,
            "groups": groups,
        };
    }, [prevVals])

    const checkExclusiveGroupsForConsistency = (groups, layers) => {
        if ( groups ) {
            groups.forEach(group => {
                if ( group.exclusiveLayer ) {
                    let allLayersInGroup = layers.filter((layer) => group.id === layer.group);
                    //allLayersInGroup = allLayersInGroup.reverse();
                    let countVisibleLayers = 0;
                    allLayersInGroup.forEach(layer => {
                        if ( layer.visibility ) {
                            countVisibleLayers++;
                        }
                    });
                    if ( countVisibleLayers > 1 ) {
                        allLayersInGroup = allLayersInGroup.reverse();
                        props.updateLayerVisibility(allLayersInGroup[0].id, 'layer', {visibility:true});
                        for ( let i=1; i<allLayersInGroup.length; i++) {
                            props.updateLayerVisibility(allLayersInGroup[i].id, 'layer', {visibility:false});
                        }
                    }
                }
            })
        }
    }

    const changeLayerVisibility = () => {
        if ( props && previousLayersAndGroups.current && layers.length === previousLayersAndGroups.current.layers.length ) {
            const changedLayer = findLayerThatChangedVisibility(layers, previousLayersAndGroups.current.layers);
            if ( changedLayer ) {
                const correspondingGroup = getCorrespondingGroup( props, changedLayer )
                if ( correspondingGroup && correspondingGroup.exclusiveLayer ) {
                    const allLayersInCorrespondingGroup = layers.filter((layer) => changedLayer.group === layer.group);
                    allLayersInCorrespondingGroup.forEach( layer => {
                        if ( layer.id !== changedLayer.id ) {
                            props.updateLayerVisibility(layer.id, 'layer', {visibility: false});
                        }
                    });
                }
            }
        }
    }

    if ( previousLayersAndGroups.current.groups && groups.length === previousLayersAndGroups.current.groups.length ) {
        for ( let i=0; i<groups.length; i++ ) {
            if ( groups[i].exclusiveLayer && !previousLayersAndGroups.current.groups[i].exclusiveLayer ) {
              const layersInGroup = props.layers.filter(( layer ) => groups[i].id === layer.group);
                let countVisibleLayers = 0;
                layersInGroup.forEach(( layer ) => {
                    if ( layer.visibility ) countVisibleLayers++;
                });
                if ( countVisibleLayers>1 ) {
                    layersInGroup.forEach(( layer ) => {
                        props.updateLayerVisibility(layer.id, 'layer', {visibility: false});
                    })
                }
            }
        }
    }

    return (
        <div></div>
    )
}

const findLayerThatChangedVisibility = (newLayers, oldLayers) => {
    for ( let i = 0; i < newLayers.length; i++ ) {
        if ( newLayers[i].visibility !== oldLayers[i].visibility ) {
            return newLayers[i];
        }
    }
}

const findGroupThatChangedVisibility = (newGroups, oldGroups) => {
    for ( let i = 0; i < newGroups.length; i++ ) {
        if ( newGroups[i].visibility !== oldGroups[i].visibility ) {
            return newGroups[i];
        }
    }
}

const checkIfClickedOnGroup = (click) =>{
    if ( click.parentElement.attributes.class.nodeValue.includes("toc-default-group-head") ) {
        if ( click.className.includes("glyphicon-eye-open") ) {
            return {
                "clicked": true,
                "open": true,
            }
        } else {
            return {
                "clicked": true,
                "open": false,
            }
        }                
    } else {
        return {
            "clicked": false,
            "open": null,
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
    updateLayerVisibility: updateNode,
})(ExclusiveLayer);

export default createPlugin('ExclusiveLayer', {
    component: ExclusiveLayerPlugin,
});
