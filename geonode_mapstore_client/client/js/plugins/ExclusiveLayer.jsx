import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { layerSelector, groupSelector } from '../selectors/layersSelectors';
import {isTimelineVisible, getLayersByGroup, displayTitle} from '@mapstore/framework/utils/LayersUtils';
import { updateNode } from '@mapstore/framework/actions/layers';
import LayersTool from '@mapstore/framework/components/TOC/fragments/LayersTool';

/*
Use Cases:
- Map loads for the first time:
    - Exclusive layers are invisible.
    - Non-exclusive layers behave according to their layer setting (visibility).
    - Special case: visibility of one exclusive layer is true, all other layers' visibility set to false, then do nothing
- User makes a non-exclusive layer visible:
    - Exclusive layers are invisble.
    - Visibility of the other non-exclusive layers does not change.
- User makes exclusive layer visible:
    - All non-exclusive layers are invisible.
- User makes exclusive layer invisble:
    - Nothing else changes
- User makes group visible when it's invisible
    - All exclusive layers are invisible.
    - All non-exclusive layers behave according to their layer setting.
- User makes group invisible when it's visible:
    - All layers are invisible.
*/

function ExclusiveLayer(props) {
    const [go, toggleGo] = useState(false);

    useEffect(() => {
        if (props.layers.length > 0) {
            props.layers.forEach(element => {
//                console.log(element.visibility)
                if (element.exclusiveLayer) {
                    props.makeLayerInvisible(element.id, 'layer', {visibility: false});
                    props.makeLayerInvisible(element.id, 'layer', {title: element.title+' excl.'});
                }
            })
        }
    }, [go])

    props.layers.forEach(element => {
        useEffect(() => {
            if (!element.exclusiveLayer && element.visibility) {
                props.layers.forEach(layer => {
                    if (layer.exclusiveLayer) {
                        props.makeLayerInvisible(layer.id, 'layer', {visibility: false});
                    }
                });
            }
            if (element.exclusiveLayer && element.visibility) {
                props.layers.forEach(layer => {
                    if (layer.id != element.id) {
                        props.makeLayerInvisible(layer.id, 'layer', {visibility: false});
                    }
                })
            }
        }, [element.visibility])
    })

    return (
        <div></div>
    )
}

const ExclusiveLayerPlugin = connect((state) => ({
    layers: layerSelector(state),
    groups: groupSelector(state),
}), {
    makeLayerInvisible: updateNode,
})(ExclusiveLayer);

export default createPlugin('ExclusiveLayer', {
    component: ExclusiveLayerPlugin,
});