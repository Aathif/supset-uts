export default function useSticky<D extends object>(hooks: Hooks<D>) {
  hooks.useInstance.push(useInstance);
  hooks.stateReducers.push((newState, action_, prevState) => {
    const action = action_ as ReducerAction<ReducerActions, { size: StickyState }>;
    if (action.type === ReducerActions.init) {
      return {
        ...newState,
        sticky: {
          ...prevState?.sticky,
        },
      };
    }
    if (action.type === ReducerActions.setStickyState) {
      const { size } = action;
      if (!size) {
        return { ...newState };
      }
      return {
        ...newState,
        sticky: {
          ...prevState?.sticky,
          ...newState?.sticky,
          ...action.size,
        },
      };
    }
    return newState;
  });
}
