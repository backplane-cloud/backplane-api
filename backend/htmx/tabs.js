function showCostTab(cost) {
  let HTML;

  HTML = `
  
  <h1>Cost History</h1>
    <div class="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
  
      <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      
      <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">`;

  HTML += `
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Date / Time</th>
                <th scope="col" class="px-6 py-3">Cost</th>
              </tr>
          </thead>
          <tbody>`;

  // Map through the Cost Hsitory
  cost.reverse().map((entry) => {
    let costValue = entry.cost ? "$" + entry.cost.toLocaleString() : "-";
    HTML += `
          <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${entry.createdAt}</td>
            <th scope="row">${costValue}</th>
          </tr>`;
  });

  HTML += `
          
      </tbody>
  </table>
  </div>
  
      `;

  return HTML;
}

export { showCostTab };
