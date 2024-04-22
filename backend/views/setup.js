function setup() {
  let html = `
  <div>
    <h1 class="align-start text-2xl font-bold tracking-tight text-gray-900">Setup your Organisation</h1>
<p class="mt-10">
Please visit <a class="link">Backplane.dev/docs</a> for instructions on how to create the necessary Service Principals in your Cloud Platform.
</p>
    <div class="mt-10">
            <div class="overflow-x-auto">
            <table class="table">
              <!-- head -->
              <thead>
                <tr>
               
                  <th>Task</th>
                  <th>Data</th>
                  <th class="w-96 text-center">Task Complete</th>
                </tr>
              </thead>
              <tbody>
                <!-- row 1 -->
                <tr>
                  
                  <td>Set Organisation Budget</td>
                  <td>
                    <input type="text" placeholder="$" class="input input-bordered w-full max-w-xs" />
                    <select class="select select-bordered max-w-xs">
                      <option>USD</option>
                      <option>GBP</option>
                    </select>
                    <button class="btn btn-primary btn-sm ml-10">Set</button>
                  </td>
                  <td class="text-center"><input type="checkbox" class="checkbox" /></td>
                </tr>

                <!-- row 2 -->
                <tr>
                  <td>Add Cloud Credentials</td>
                  <td>
                        <div class="join join-vertical w-full">
                        <div class="collapse collapse-arrow join-item border border-base-300">
                          <input type="radio" name="my-accordion-4" checked="checked" /> 
                          <div class="collapse-title text-xl font-medium">
                            <img src='./img/azure.png' />
                          </div>
                          <div class="collapse-content"> 
                            <p>
                            <table class="w-full">
                              <tr>
                                <th>Subscription ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /></td>
                              </tr>
                              <tr>
                                <th>Client ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /></td>
                              </tr>
                              <tr>
                                <th>Client Secret</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /></td>
                              </tr>
                              <tr>
                                <th>Tenant ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /></td>
                              </tr>
                              <tr>
                                <td colspan='2' class="text-right"><button class="btn btn-neutral btn-sm">Save</button></td>
                              </tr>
                            </table>
                            
                            </p>
                          </div>
                        </div>
                        <div class="collapse collapse-arrow join-item border border-base-300">
                          <input type="radio" name="my-accordion-4" /> 
                          <div class="collapse-title text-lg font-medium">
                          <img src='./img/aws.png' />
                          </div>
                          <div class="collapse-content"> 
                            <p>
                                <table class="w-full">
     
                                <tr>
                                  <th>Client ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /></td>
                                </tr>
                                <tr>
                                  <th>Client Secret</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /></td>
                                </tr>
                                <tr>
                                <td colspan='2' class="text-right"><button class="btn btn-neutral btn-sm">Save</button></td>
                              </tr>
                              </table>
                            </p>
                          </div>
                        </div>
                        <div class="collapse collapse-arrow join-item border border-base-300">
                          <input type="radio" name="my-accordion-4" /> 
                          <div class="collapse-title text-xl font-medium">
                          <img src='./img/gcp.png' />             
                                       </div>
                          <div class="collapse-content"> 
                            <p><input type="file" class="file-input file-input-bordered w-full max-w-xs" /></p>
                          </div>
                        </div>
                      </div>
                  </td>
                  <td class="text-center"><input type="checkbox" class="checkbox" /></td>
                </tr>


                <!-- row 1 -->
                <tr>
                  <td>Create Platform</td>
                  <td>
                  <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="my_modal_1.showModal()"  hx-get="/api/platforms/create" hx-target="#my_modal" hx-headers='{"ui": true, "action": "create"}'>Create Platform</button>
                    <dialog id="my_modal_1" class="modal">    
                    <div class="modal-box w-4/12 max-w-5xl" id="my_modal"></div>
                  </dialog>
                  </td>
                  <td class="text-center"><input type="checkbox" class="checkbox" /></td>
                </tr>

                <!-- row 1 -->
                <tr>
                  <td>Create Product</td>
                  <td>
                  <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="my_modal_1_product.showModal()"  hx-get="/api/products/create" hx-target="#my_modal_product" hx-headers='{"ui": true, "action": "create"}'>Create Product</button>
                    <dialog id="my_modal_1_product" class="modal">    
                    <div class="modal-box w-4/12 max-w-5xl" id="my_modal_product"></div>
                  </dialog>
                  </td>
                  <td class="text-center"><input type="checkbox" class="checkbox" /></td>
                </tr>


                <tr>
                <td>Create App</td>
                <td>
                <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="my_modal_1_app.showModal()"  hx-get="/api/apps/create" hx-target="#my_modal_app" hx-headers='{"ui": true, "action": "create"}'>Create App</button>
                  <dialog id="my_modal_1_app" class="modal">    
                  <div class="modal-box w-4/12 max-w-5xl" id="my_modal_app"></div>
                </dialog>
                </td>
                <td class="text-center"><input type="checkbox" class="checkbox" /></td>
       
              </tr>


              </tbody>
            </table>
          </div>
    </div>
  <div>
  `;

  return html;
}

export { setup };
