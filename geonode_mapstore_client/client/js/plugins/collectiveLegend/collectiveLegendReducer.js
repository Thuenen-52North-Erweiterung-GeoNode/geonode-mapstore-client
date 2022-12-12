import { TOGGLE_COLLECTIVE_LEGEND } from './collectiveLegendAction';


export default function (state = {collectiveLegend: false}, action) {
    switch(action.type) {
        case TOGGLE_COLLECTIVE_LEGEND:
            return {
                collectiveLegend: action.payload
            }
        default:
            return state;
    }
}