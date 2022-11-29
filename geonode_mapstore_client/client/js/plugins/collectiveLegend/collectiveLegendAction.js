export const TOGGLE_COLLECTIVE_LEGEND = 'COLLECTIVE_LEGEND:TOGGLE_COLLECTIVE_LEGEND';

export function toggleCollectiveLegend(payload){
    console.log(payload)
    return {
        type: TOGGLE_COLLECTIVE_LEGEND,
        payload,
    }
}