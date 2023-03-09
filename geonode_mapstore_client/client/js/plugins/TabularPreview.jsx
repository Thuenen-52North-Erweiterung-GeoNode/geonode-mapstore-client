import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';

import Table from '@js/components/Table';
import gnresource from '@js/reducers/gnresource';

function TableComponent(props) {
    const style = {position: "absolute", top: "100px", left: "100px", zIndex: 10000000};
    const head = [{value: "hello", key: "col1"}]
    const body = [{col1: "value"}]
    return (
        <Table head={head} body={body} />
    );
}

const TabularPreviewPlugin = connect(
    createSelector([], () => ({})),
    {}
)(TableComponent);

export default createPlugin('TabularPreview', {
    component: TabularPreviewPlugin,
    containers: {},
    epics: {},
    reducers: {
        gnresource
    }
});
