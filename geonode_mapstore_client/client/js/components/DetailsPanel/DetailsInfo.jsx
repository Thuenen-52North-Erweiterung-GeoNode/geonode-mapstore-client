/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';
import Message from '@mapstore/framework/components/I18N/Message';
import moment from 'moment';
import castArray from 'lodash/castArray';
import Button from '@js/components/Button';
import { Tabs, Tab } from "react-bootstrap";
import Table from '@js/components/Table';

import {
    getDatasetByPk
} from '@js/api/geonode/v2'

const replaceTemplateString = (properties, str) => {
    return Object.keys(properties).reduce((updatedStr, key) => {
        const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
        return updatedStr.replace(regex, properties[key]);
    }, str);
};

const getDateRangeValue = (startValue, endValue, format) => {
    if (startValue && endValue) {
        return `${moment(startValue).format(format)} - ${moment(endValue).format(format)}`;
    }
    return moment(startValue ? startValue : endValue).format(format);
};

const DetailInfoFieldLabel = ({ field }) => {
    return (<>{field.labelId ? <Message msgId={field.labelId} /> : field.label}</>);
};

function DetailsInfoField({
    field,
    children
}) {
    const values = castArray(field.value);
    return (
        <div className="gn-details-info-row">
            <div className="gn-details-info-label"><DetailInfoFieldLabel field={field} /></div>
            <div className="gn-details-info-value">{children(values)}</div>
        </div>
    );
}

function DetailsHTML({ value, placeholder }) {
    const [expand, setExpand] = useState(false);
    if (placeholder) {
        return (
            <div className={`gn-details-info-html${expand ? '' : ' collapsed'}`}>
                {expand
                    ? <div className="gn-details-info-html-value" dangerouslySetInnerHTML={{ __html: value }}/>
                    : <div className="gn-details-info-html-value">{placeholder}</div>}
                <Button onClick={() => setExpand(!expand)}>
                    <Message msgId={expand ? 'gnviewer.readLess' : 'gnviewer.readMore'} />
                </Button>
            </div>);
    }
    return (
        <div dangerouslySetInnerHTML={{ __html: value }}/>
    );
}

function DetailsInfoFields({ fields, formatHref }) {
    return (<div className="gn-details-info-fields">
        {fields.map((field, filedIndex) => {
            if (field.type === 'link') {
                return (
                    <DetailsInfoField key={filedIndex} field={field}>
                        {(values) => values.map((value, idx) => (
                            <a key={idx} href={field.href} target={field.target}>{value}</a>
                        ))}
                    </DetailsInfoField>
                );
            }
            if (field.type === 'query') {
                return (
                    <DetailsInfoField key={filedIndex} field={field}>
                        {(values) => values.map((value, idx) => (
                            <a key={idx} href={formatHref({
                                query: field.queryTemplate
                                    ? Object.keys(field.queryTemplate)
                                        .reduce((acc, key) => ({
                                            ...acc,
                                            [key]: replaceTemplateString(value, field.queryTemplate[key])
                                        }), {})
                                    : field.query,
                                pathname: field.pathname
                            })}>{field.valueKey ? value[field.valueKey] : value}</a>
                        ))}
                    </DetailsInfoField>
                );
            }
            if (field.type === 'date') {
                return (
                    <DetailsInfoField key={filedIndex} field={field}>
                        {(values) => values.map((value, idx) => (
                            <span key={idx}>{(value?.start || value?.end) ? getDateRangeValue(value.start, value.end, field.format || 'MMMM Do YYYY') : moment(value).format(field.format || 'MMMM Do YYYY')}</span>
                        ))}
                    </DetailsInfoField>
                );
            }
            if (field.type === 'html') {
                return (
                    <DetailsInfoField key={filedIndex} field={field}>
                        {(values) => values.map((value, idx) => (
                            <DetailsHTML key={idx} value={value} placeholder={field.placeholder}/>
                        ))}
                    </DetailsInfoField>
                );
            }
            if (field.type === 'text') {
                return (
                    <DetailsInfoField key={filedIndex} field={field}>
                        {(values) => values.map((value, idx) => (
                            <span key={idx}>{value}</span>
                        ))}
                    </DetailsInfoField>
                );
            }
            return null;
        })}
    </div>);
}

const parseTabItems = (items) => {
    return (items || []).filter(({ value }) => {
        if (value?.length === 0
        || value === 'None'
        || !value) {
            return false;
        }
        return true;
    });
};

const parseAttributeData = (dataset) => {
    if (dataset?.attribute_set) {
        const header = [{
            value: "Name",
            key: "name"
        }, {
            value: "Label",
            key: "label"
        }, {
            value: "Description",
            key: "description"
        }]

        const rows = dataset.attribute_set.map(attribute => ({
            name: attribute.attribute,
            label: attribute.attribute_label || "",
            description: attribute.description || "",
        }));

        return { header, rows };
    }

    return {header: [], rows: [] };
};

function DetailsInfo({
    tabs = [],
    resource,
    formatHref
}) {
    const filteredTabs = tabs
        .map((tab) => ({ ...tab, items: tab.type === "attribute_table" ? tab.items : parseTabItems(tab?.items) }))
        //.filter(tab => tab?.items?.length > 0);
    const selectedTabId = filteredTabs?.[0]?.id;
    return (
        <Tabs
            defaultActiveKey={selectedTabId}
            bsStyle="pills"
            className="gn-details-info tabs-underline"
        >
            {filteredTabs.map((tab, idx) => {
                const [ attributeData, setAttributeData ] = useState({ header: [], rows: [] });
                if (tab.type === "attribute_table") {
                    useEffect(() => {
                        const getAttributes = async () => {
                            if (resource.resource_type === "dataset") {
                                const dataset = await getDatasetByPk(resource.pk);
                                setAttributeData(parseAttributeData(dataset));
                            }
                        }
                        getAttributes();
                    }, [])
                }
                return (
                    <Tab key={idx} eventKey={tab?.id} title={<DetailInfoFieldLabel field={tab} />}>
                        {tab.type === "attribute_table" 
                            ? <Table head={attributeData.header} body={attributeData.rows} />
                            : <DetailsInfoFields fields={tab?.items} formatHref={formatHref} />}
                    </Tab>
                )
            })
            }
        </Tabs>
    );
}

export default DetailsInfo;
