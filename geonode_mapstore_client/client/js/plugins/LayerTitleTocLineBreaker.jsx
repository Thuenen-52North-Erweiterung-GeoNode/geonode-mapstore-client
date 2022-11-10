import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';

import GroupTitle from '@mapstore/framework/components/TOC/fragments/GroupTitle';
import GroupChildren from '@mapstore/framework/components/TOC/fragments/GroupChildren';
import { updateNode } from '@mapstore/framework/actions/layers';
//import { gnsave } from '@js/reducers/gnsave';
//import { saveDirectContent } from '@js/actions/gnsave';
//import gnsaveEpics from '@js/epics/gnsave';

import {layerSelector} from '../selectors/layersSelector';

function LineBreaker(props) {
    const defaultLayers = document.getElementsByClassName("toc-default-layer-head");
    const title = document.getElementsByClassName("toc-title");
    const [layerGroupOpen, toggleLayerGroup] = useState(false);
    useEffect(() => {
        if (defaultLayers && defaultLayers.length > 0 && title && title.length > 0) {
            Object.entries(defaultLayers).forEach(element => {
                element[1].style.height='auto';
                element[1].style.display='flow-root';
            });
            Object.entries(title).forEach(element => {
                element[1].style.wordBreak = 'break-all';
                element[1].style.height = 'fit-content';
                element[1].style.width = '65%';
                element[1].style.maxWidth = '100%';
                element[1].style.whiteSpace = 'normal';
            });
        }

    },[layerGroupOpen]);

    GroupTitle.propTypes.onClick = () => {
        toggleLayerGroup(!layerGroupOpen);
    }

    const [toggleTooltip, toggleTooltipDeactivator] = useState(true);
    
    useEffect(() => {
        if(props.layers.length > 0){
            props.layers.forEach(element => {
                if (element.tooltipOptions != 'none') {
                    props.deactivateTooltipOptions(element.id, 'layer', {tooltipOptions: 'none'});
                    //props.saveTooltip();          
                }
 
            });
        }
    }, [toggleTooltip]);

    GroupChildren.propTypes.onSort = () => {
        toggleTooltipDeactivator(!toggleTooltip)
    }

    return (
        <div></div>
    )
}

const LineBreakerPlugin = connect((state) => ({
    layers: layerSelector(state)
}), {
    deactivateTooltipOptions: updateNode,
    //saveTooltip: saveDirectContent
})(LineBreaker);

export default createPlugin('LayerTitleTocLineBreaker', {
    component: LineBreakerPlugin,
    /*epics: {
        ...gnsaveEpics
    },
    reducers: {
        gnsave
    }*/
});
