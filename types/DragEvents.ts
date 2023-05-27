const ids: (any | undefined)[] = [];
const nextIdxs: number[] = [];

interface DragEventsIdInstance {
  id: number;
  value: any;
  remove: () => void;
}

export const DragEventId = (value: any): DragEventsIdInstance => {
  let id: number;

  if (nextIdxs.length === 0) {
    nextIdxs.push(ids.length);
  }
  const currentIdx = nextIdxs.pop();
  id = currentIdx;
  ids[currentIdx] = value;

  const remove = () => {
    ids[id] = undefined;
    nextIdxs.push(id);
  };

  return {
    id,
    value,
    remove,
  };
};

type DragEvents = {
  position: [
    {
      id: DragEventsIdInstance;
      screenX: number;
      screenY: number;
      payload: any;
    }
  ];
};

export type DragEventHandler<TEventName extends keyof DragEvents> = (
  ...args: DragEvents[TEventName]
) => void;

export default DragEvents;
