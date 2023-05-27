import React, { useState, useRef, useContext } from 'react';
import {
  PanResponder,
  Animated,
  NativeSyntheticEvent,
  PanResponderInstance,
} from 'react-native';
import { DragEventsContext } from '../components/DragEventsProvider';
import { DragEventId } from '../types/DragEvents';
import Measurable from '../types/Measurable';

type Styles = Record<string, number | string | Animated.Value>;

type UseDraggableConfigs = {
  onStart?: () => void;
  onMove?: (event: NativeSyntheticEvent<unknown>) => void;
  onRelease?: () => void;
  onReturnOrigin?: () => void;
  whileDraggingStyles?: Styles;
};

const useDraggable = (
  ref: React.MutableRefObject<Measurable>,
  configs?: UseDraggableConfigs,
  payload?: any
): {
  panResponder: PanResponderInstance;
  conditionalStyles: Styles[] | undefined;
  setDraggable: React.Dispatch<React.SetStateAction<boolean>>;
} => {
  const [draggable, setDraggable] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const dragEventsEmitter = useContext(DragEventsContext);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => draggable,
      onPanResponderGrant: () => {
        configs?.onStart?.();
        setIsDragging(true);
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          listener: (...args) => {
            configs?.onMove?.(...args);
          },
          useNativeDriver: false,
        })(e, gestureState);
      },
      onPanResponderRelease: (e, gestureState) => {
        const { moveX, moveY } = gestureState;
        dragEventsEmitter.emit('position', {
          id: DragEventId(ref),
          screenX: moveX,
          screenY: moveY,
          payload: payload,
        });
        configs?.onRelease?.();
        setIsDragging(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          overshootClamping: true,
          useNativeDriver: false,
        }).start(({ finished }) => {
          configs?.onReturnOrigin?.();
        });
      },
    })
  ).current;

  const styles: Styles[] = [
    pan.getLayout(),
    {
      cursor: 'grab',
    },
    isDragging
      ? {
          cursor: 'grabbing',
          zIndex: 1,
          ...configs?.whileDraggingStyles,
        }
      : undefined,
  ];

  return {
    panResponder,
    conditionalStyles: styles,
    setDraggable,
  };
};

export default useDraggable;
