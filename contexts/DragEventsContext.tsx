import React, { createContext, useRef, useContext } from 'react';
import TypedNativeEventEmitter from '../types/TypedNativeEventEmitter';
import DragEvents from '../types/DragEvents';

const dragEventsEmitter = new TypedNativeEventEmitter<DragEvents>();
export const DragEventsContext =
  createContext<TypedNativeEventEmitter<DragEvents>>(dragEventsEmitter);

export const useDragEvents = () => useContext(DragEventsContext);

export const DragEventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dragEvents = useRef(dragEventsEmitter).current;

  return (
    <DragEventsContext.Provider value={dragEvents}>
      {children}
    </DragEventsContext.Provider>
  );
};

export default DragEventsContext;
