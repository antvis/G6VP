import { useContext } from '@antv/gi-sdk';
import * as React from 'react';

export interface Props{
  minZoom?: number;
  statusName?: string;
}
export default (props: Props) => {
  const {minZoom = 0.6,statusName = 'minZoom'} = props;
  const graphContext = useContext();
  const graph = graphContext.graph;
  React.useEffect(() =>{
    let timeoutId: any;
    const execute = () => {
      const zoom = graph.getZoom();
      const min = zoom <= minZoom;
      graph.getNodes().forEach((node) => {
        graph.setItemState(node,statusName,min);
      });
      graph.getEdges().forEach((edge) => {
        graph.setItemState(edge,statusName,min);
      });
    }
    const onZoom = () => {
      if(timeoutId){
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        execute();
        timeoutId = 0;
      },100);
    }
    graph.on('wheelzoom',onZoom);
    return () => {
      graph.off('wheelzoom',onZoom);
      if(timeoutId){
        clearTimeout(timeoutId);
      }
    }
  },[graph,minZoom,statusName]);
  return null;
}
