import React, { useContext, useEffect } from 'react';
import { DragEventsContext } from '../components/DragEventsProvider';
import Measurable from '../types/Measurable';

type UseReceivableConfigs = {
  onRelease?: (payload: any) => void;
};

const useReceivable = (
  /** A ref of the component receiving drag events */
  ref: React.MutableRefObject<Measurable>,
  configs?: UseReceivableConfigs,
  /** An array of excluded component refs */
  exclude?: React.MutableRefObject<Measurable>[]
): any | undefined => {
  const dragEventsEmitter = useContext(DragEventsContext);

  useEffect(() => {
    const positionSub = dragEventsEmitter.addListener(
      'position',
      ({ id, screenX, screenY, payload }) => {
        if (exclude.includes(id.value)) {
          return;
        }
        ref.current.measure((_, __, width, height, pageX, pageY) => {
          const releasedWithinBounds =
            screenX >= pageX &&
            screenX <= pageX + width &&
            screenY >= pageY &&
            screenY <= screenY + height;
          if (releasedWithinBounds) {
            configs?.onRelease?.(payload);
          }
        });
      }
    );

    return () => {
      positionSub.remove();
    };
  }, [dragEventsEmitter]);
};

export default useReceivable;
