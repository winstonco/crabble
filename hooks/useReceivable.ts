import React, { useContext, useEffect } from 'react';
import { DragEventsContext } from '../components/DragProvider';
import Measurable from '../types/Measurable';

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
  const dragEventsEmitter = useContext(DragEventsContext);

  useEffect(() => {
    const positionSub = dragEventsEmitter.addListener(
      'release',
      ({ id, screenX, screenY, payload }) => {
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
      }
    );

    return () => {
      positionSub.remove();
    };
  }, [...(deps ?? []), dragEventsEmitter]);
};

export default useReceivable;
