import React, { useEffect, useState } from 'react';
import { createPlugin } from '../../MapStore2/web/client/utils/PluginsUtils';
import GroupTitle from '@mapstore/framework/components/TOC/fragments/GroupTitle';
import GeneralSettings from './layersettings/GeneralSettings';
import { connect } from 'react-redux';
import LayerSettings from './LayerSettings';
import Message from '@mapstore/framework/components/I18N/Message';

//import layerSelector from '@mapstore/framework/plugins/widgetbuilder/enhancers/layerSelector';


function LineBreaker(props) {
    const defaultLayer = document.getElementsByClassName("toc-default-layer-head");
    const title = document.getElementsByClassName("toc-title");
    const [ groupOpen, setGroupOpen] = useState(false);
    
    useEffect(() => {
        if (defaultLayer && defaultLayer.length > 0 && title && title.length > 0) {
            Object.entries(defaultLayer).forEach(element => {
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
    },[groupOpen]);
    //To-Do: For each layer, set tooltipOptions to "none"
    //To-Do: In GeneralSettings, set showTooltipOptions to false
    GroupTitle.propTypes.onClick = () => {
        setGroupOpen(!groupOpen);
    }

    return (
        <div></div>
    )
}

/*const LineBreakerPlugin = connect((state => ({
    layers: layerSelector(state),
}), {
    //setTooltipToFalse: 
})
)(LineBreaker);*/

export default createPlugin('LayerTitleTocLineBreaker', {
    component: LineBreaker,
    //component: LineBreakerPlugin,
});
