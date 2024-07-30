export const cachedBuildQuery = () => {
   let cachedChanges = {};
 
   const setCachedChanges = newChanges => {
     cachedChanges = { ...cachedChanges,
       ...newChanges
     };
   };
 
   return (formData, options) => {
     var _options$ownState2;
 
     return buildQuery({ ...formData
     }, {
       extras: {
         cachedChanges
       },
       ownState: (_options$ownState2 = options == null ? void 0 : options.ownState) != null ? _options$ownState2 : {},
       hooks: { ...(options == null ? void 0 : options.hooks),
         setDataMask: () => {},
         setCachedChanges
       }
     });
   };
 };
