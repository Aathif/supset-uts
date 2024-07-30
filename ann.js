export function getQueryMode(formData) {
   const {
     query_mode: mode
   } = formData;
 
   if (mode === QueryMode.Aggregate || mode === QueryMode.Raw) {
     return mode;
   }
 
   const rawColumns = formData == null ? void 0 : formData.all_columns;
   const hasRawColumns = rawColumns && rawColumns.length > 0;
   return hasRawColumns ? QueryMode.Raw : QueryMode.Aggregate;
 }
