/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DetailsLocations from '@js/components/DetailsPanel/DetailsLocations';
import DetailsAssets from '@js/components/DetailsPanel/DetailsAssets';
import DetailsAttributeTable from '@js/components/DetailsPanel/DetailsAttributeTable';
import DetailsLinkedResources from '@js/components/DetailsPanel/DetailsLinkedResources';

const tabComponents = {
    'attribute-table': DetailsAttributeTable,
    'linked-resources': DetailsLinkedResources,
    'locations': DetailsLocations,
    'assets': DetailsAssets
};

export default tabComponents;