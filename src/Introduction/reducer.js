const initialState = {
    selectedOptions: {},
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "UPDATE_SELECTED_OPTIONS":
        return {
          ...state,
          selectedOptions: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  