import {
    BaseEdge,
    EdgeProps,
    getBezierPath,
    getStraightPath,
    getSmoothStepPath
} from "reactflow";

export default function CustomEdge({
    // id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    // style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const {
        edgeColor,
        edgeType,
        // arrowStyle
    } = data;

    switch (data.edgePath) {
        case 'straight': {
            const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
            return <BaseEdge
                path={edgePath}
                markerEnd='url(#triangular)'
                style={{
                    stroke: edgeColor,
                    strokeDasharray: edgeType === 'solid' ? '5,0' : '5,5'
                }}
            />;
        }
        case 'step': {
            const [edgePath] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 0 });
            return <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: edgeColor,
                    strokeDasharray: edgeType === 'solid' ? '5,0' : '5,5'
                }}
            />;
        }
        case 'smoothstep': {
            const [edgePath] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 21 });
            return <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: edgeColor,
                    strokeDasharray: edgeType === 'solid' ? '5,0' : '5,5'
                }}
            />;
        }
        default: {
            const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
            return <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: edgeColor,
                    strokeDasharray: edgeType === 'solid' ? '5,0' : '5,5'
                }}
            />;
        }
    }
}