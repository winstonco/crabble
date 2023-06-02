import React, { useEffect } from 'react';
import { useDragEvents } from '../contexts/DragEventsContext';
import Measurable from '../types/Measurable';
import { DragEventHandler } from '../types/DragEvents';

type UseReceivableConfigs = {
  onRelease?: (payload: any) => void;
  /** An array of excluded component refs */
  exclude?: React.MutableRefObject<Measurable>[];
};

const useReceivable = (
  /** A ref of the component receiving drag events */
  ref: React.MutableRefObject<Measurable>,
  configs?: UseReceivableConfigs,
  deps?: React.DependencyList
) => {
  const dragEventsEmitter = useDragEvents();

  useEffect(() => {
    const handleRelease: DragEventHandler<'release'> = ({
      id,
      screenX,
      screenY,
      payload,
    }) => {
      if (configs?.exclude?.includes(id.value)) {
        return;
      }
      ref.current.measure((_, __, width, height, pageX, pageY) => {
        const releasedWithinBounds =
          screenX >= pageX &&
          screenX <= pageX + width &&
          screenY >= pageY &&
          screenY <= pageY + height;
        if (releasedWithinBounds) {
          configs?.onRelease?.(payload);
        }
      });
    };

    dragEventsEmitter.addListener('release', handleRelease);

    return () => {
      dragEventsEmitter.removeListener('release', handleRelease);
    };
  }, [...(deps ?? []), dragEventsEmitter]);
};

export default useReceivable;
