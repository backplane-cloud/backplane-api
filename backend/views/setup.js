function setup(orgId, budget, csp) {
  let azure,
    aws,
    gcp = "";

  if (csp) {
    azure = csp.filter((item) => item.provider === "azure")[0];
    aws = csp.filter((item) => item.provider === "aws")[0];
    gcp = csp.filter((item) => item.provider === "gcp")[0];
  }

  let html = `
  <div>
    <h1 class="align-start text-2xl font-bold tracking-tight text-gray-900">Setup</h1>

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
                    <form  hx-put="api/orgs/${orgId}/budgets" hx-headers='{"ui": true, "returnpath": "setup"}' hx-target="#display-content">
                      <select class="select select-bordered max-w-xs" name="year" ${
                        budget && "readonly"
                      }>
                        <option>2024</option>
                      </select>
                      <input type="text" placeholder="$" class="input input-bordered w-full max-w-xs" name="budget" ${
                        budget && "readonly"
                      } value='${budget ? budget[0].budget : ""}'/>
                      <select class="select select-bordered max-w-xs" name="currency" ${
                        budget && "readonly"
                      }>
                        <option>USD</option>
                        <option>GBP</option>
                      </select>
                      <button class="btn btn-primary btn-sm ml-10" type="submit" ${
                        budget && "disabled"
                      }>Set Budget</button>
                    </form>
                  </td>
                  <td class="text-center"><input type="checkbox" class="checkbox" ${
                    budget && "checked='checked'"
                  }/></td>
                </tr>

                <!-- row 2 -->
                <tr>
                  <td>Add Cloud Credentials</td>
                  <td>
                        <div class="join join-vertical w-full">
                        <div class="collapse collapse-arrow join-item border border-base-300">
                          <input type="radio" name="my-accordion-4" checked="checked" /> 
                          <div class="collapse-title text-xl font-medium">
                            <img src='./img/azure.svg' class='h-10' />
                          </div>
                          <div class="collapse-content"> 
                         
                            <p>
                            <form  hx-post="api/orgs/${orgId}/azure" hx-headers='{"ui": true, "returnpath": "setup"}' hx-target="#display-content">

                            <table class="w-full">
                              <tr>
                                <th>Subscription ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="subscriptionId" value="${
                                  azure ? azure.subscriptionId : ""
                                }"  ${azure && "readonly"} /></td>
                              </tr>
                              <tr>
                                <th>Client ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="clientId" value="${
                                  azure ? azure.clientId : ""
                                }"  ${azure && "readonly"}/></td>
                              </tr>
                              <tr>
                                <th>Client Secret</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="clientSecret" value="${
                                  azure ? azure.clientSecret : ""
                                }"   ${azure && "readonly"}/></td>
                              </tr>
                              <tr>
                                <th>Tenant ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="tenantId" value="${
                                  azure ? azure.tenantId : ""
                                }"   ${azure && "readonly"}/></td>
                              </tr>
                              <tr>
                                <td colspan='2' class="text-right">
                                <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit"  ${
                                  azure && "disabled"
                                }>Validate</button>

                                <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit"  ${
                                  azure && "disabled"
                                }>Save</button></td>
                              </tr>
                            </table>



                            </form>
                            
                            </p>
                         
                            <details class="collapse collapse-arrow border bg-base-200 border-base-300">
                              <summary class="collapse-title text-md font-medium">
                                <div class="flex">
                                  <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                  </div>
                                  <div class="ml-5">
                                    Instructions for creating a Service Principal in Azure
                                  </div>
                                </div>
                              </summary>
                              <div class="collapse-content"> 
                                <p>
                              Below are instructions on how to create credentials in Azure via an App registration in Entra ID.
                              
                              <ul class="steps steps-vertical">
                                <li class="step">Login to the Azure Portal and go to Microsoft Entra ID</li>
                                <li class="step">Under Manage in the left-hand side menu, select App Registrations.</li>
                                <li class="step">Click on New Registration and provide a name (e.g. backplane-api) a name and click Register.</li>
                                <li class="step">Take note of the Tenant ID and Client ID.</li>
                                <li class="step">Create a new Client Secret, click on Add a certificate or secret, New client secret, type a description, set expiry and click Add. Make a note of the Secret Value.</li>
                                <li class="step">Assign the Service Principal you created with Contributor permission at the Subscription scope.</li>
                              </ul>
                              </div>
                            </details>

                          </div>
                        </div>
                        <div class="collapse collapse-arrow join-item border border-base-300">
                          <input type="radio" name="my-accordion-4" /> 
                          <div class="collapse-title text-lg font-medium">
                          <img src='./img/aws.svg' class='w-10' />
                          </div>
                          <div class="collapse-content"> 
                            
                      
                            <p>
                            <form hx-post="api/orgs/${orgId}/aws" hx-headers='{"ui": true, "returnpath": "setup"}' hx-target="#display-content">

                                <table class="w-full">
     
                                <tr>
                                  <th>Client ID</th><td><input type="text" name="clientId" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" value="${
                                    aws ? aws.clientId : ""
                                  }"/></td>
                                </tr>
                                <tr>
                                  <th>Client Secret</th><td><input type="text" name="clientSecret" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" value="${
                                    aws ? aws.clientSecret : ""
                                  }" /></td>
                                </tr>
                                <tr>
                                  <td colspan='2' class="text-right">
                                  <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit"  ${
                                    aws && "disabled"
                                  }>Validate</button>

                                  <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" ${
                                    aws && "disabled"
                                  }>Save</button></td>
                                </tr>
                              </table>

                              </form>
                            </p>
                          
                            <details class="collapse collapse-arrow border bg-base-200 border-base-300 w-64">
                              <summary class="collapse-title text-md font-medium">
                              <div class="flex">
                                  <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                  </div>
                                  <div class="ml-5">
                                    Instructions for creating a Service Principal in AWS
                                  </div>
                                </div>  
                              </summary>
                              <div class="collapse-content"> 
                                <p>
                                  <ul class="steps steps-vertical">
                                    <li class="step">Login to AWS Management Console</li>
                                    <li class="step">Go to IAM</li>
                                    <li class="step">Click on Users</li>
                                    <li class="step">Click on Create User</li>
                                    <li class="step">Enter User Details e.g. backplane-api, click next.</li>
                                    <li class="step">Permission Options, select attach policies directly</li>
                                    <li class="step">Click on Create Policy and in Policy Editor select JSON. Paste in the below JSON</li>
                                    <code>
                                    {
                                      "Version": "2012-10-17",
                                      "Statement": [
                                          {
                                              "Effect": "Allow",
                                              "Action": [
                                                  "organizations:CreateAccount",
                                                  "organizations:DescribeOrganization"
                                              ],
                                              "Resource": "*"
                                          }
                                      ]
                                  }
                                    </code>
                                    <li class="step">Click Next, give Policy Name Backplane-account-creator</li>
                                    <li class="step">Click Create Policy</li>
                                    <li class="step">Click Create User</li>
                                    <li class="step">Click on the new User Created, and click on Security Credentials</li>
                                    <li class="step">Click on Create Access Key</li>
                                    <li class="step">Select Third-party service use-case and tick the confirmation and click Next</li>
                                    <li class="step">Create access key, record Access key and Secret access key values. Click Done.</li>
                                  </ul>
                                </p>
                              </div>
                            </details>
                            
                          </div>
                        </div>
                        <div class="collapse collapse-arrow join-item border border-base-300">
                          <input type="radio" name="my-accordion-4" /> 
                          <div class="collapse-title text-xl font-medium">
                            <img src='./img/gcp.svg' class='w-10' />             
                          </div>
                          <div class="collapse-content"> 
                            
                                  ${
                                    gcp
                                      ? `
                                    <table class="w-full">
                                      <tr>
                                        <th>Type</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.type}"  readyonly/></td>
                                      </tr>
                                      <tr>
                                        <th>Project ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.project_id}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Private Key ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.private_key_id}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Private Key</th><td><textarea cols="100" rows="10" type="text" placeholder="Type here" class="textarea texxtarea-bordered" name="type" readonly} />${gcp.gcpsecret.private_key}</textarea></td>
                                      </tr>
                                      <tr>
                                        <th>Client Email</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.client_email}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Client ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.client_id}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Auth URI</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.auth_uri}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Token URI</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.token_uri}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Auth Provider x509 Cert URL Key ID</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.auth_provider_x509_cert_url}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Client x509 Cert URL</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.client_x509_cert_url}"  readonly /></td>
                                      </tr>
                                      <tr>
                                        <th>Universe Domain</th><td><input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" name="type" value="${gcp.gcpsecret.universe_domain}"  readonly /></td>
                                      </tr>
                              
                            </table>
                                    `
                                      : `<form id="gcpForm">
                                    <input type="file" id="fileInput" accept=".json" class="file-input file-input-bordered w-full max-w-xs" />
                                    
                                    
                                    <button type="submit" class="text-right"><button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" ${
                                      gcp && "disabled"
                                    }>Save</button><div id="result"></div>
                                  </form>

                                  <details class="collapse collapse-arrow border bg-base-200 border-base-300 mt-5">
                              <summary class="collapse-title text-md font-medium">
                                <div class="flex">
                                  <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                  </div>
                                  <div class="ml-5">
                                  Instructions for creating a Service Principal in GCP
                                </div>
                                </div>
                              </summary>
                              <div class="collapse-content"> 
                                <p>
                                CREATING A SERVICE PRINCIPAL IN GCP                              
                              <ul class="steps steps-vertical">
                                <li class="step">Login to console.cloud.google.com</li>
                                <li class="step">Go to IAM and admin > Service accounts</li>
                                <li class="step">Select a Project and click on Create Service Account.</li>
                                <li class="step">Enter a service account name e.g. backplane-api and a description e.g. For Backplane API environment provisioning</li>
                                <li class="step">Click Create and Continue</li>
                                <li class="step">Click on Done.</li>
                                <li class="step">Click on IAM and switch to the Organisation level.</li>
                                <li class="step">Click on Grant Access</li>
                                <li class="step">Enter the service principal name e.g. backplane-demo@backplane-core.iam.gserfviceaccount.com</li>
                                <li class="step">In role, find Project Creator, click Save</li>
                                <li class="step">Go back to your Project and click on IAM and Admin and then Service Accounts</li>
                                <li class="step">Click on your Service Account and select Keys, Add Key, Create New Key. Use JSON as the Key Type. Click on Create. This will download a .json file.</li>
                                <li class="step">Finally, go to APIs and Services and ensure Cloud Resource Manager API is enabled.</li>
                              </ul>
                              </div>
                            </details>

                                  <script>
                                    document.getElementById('gcpForm').addEventListener('submit', function(event) {
                                      event.preventDefault();
                                    
                                      // Get the selected file
                                      const file = document.getElementById('fileInput').files[0];
                                      if (!file) {
                                        alert('Please select a file.');
                                        return;
                                      }
                                    
                                      // Read the file as text
                                      const reader = new FileReader();
                                      reader.onload = function(event) {
                                        const jsonData = JSON.parse(event.target.result);
                                        console.log('JSON data:', jsonData);
                                    
                                        // Make a POST request with the JSON data
                                        fetch('/api/orgs/${orgId}/gcp', {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json', 
                                            'ui': true,
                                            'returnpath': 'setup' 
                                          },
                                        
                                          body: JSON.stringify(jsonData)
                                        })
                                        .then(response => {
                                          if (response.ok) {
                                            console.log('JSON data submitted successfully.');
                                            document.getElementById("result").innerHTML = "GCP Details Successfully Saved"
                                          } else {
                                            console.error('Failed to submit JSON data.');
                                          }
                                        })
                                        .catch(error => {
                                          console.error('Error:', error);
                                        });
                                      };
                                      reader.readAsText(file);
                                    });
                                  
                                  </script>
                                    
                                    `
                                  }
                          
                      
                          </div>
                        </div>
                      </div>
                  </td>
                  <td class="text-center"><input type="checkbox" class="checkbox"   ${
                    (azure || aws || gcp) && "checked='checked'"
                  } /></td>
                </tr>


                <!-- row 3 -->
                ${
                  (azure || aws || gcp) &&
                  `
                <tr>
                  
                  <td></td>
                  <td>
                    Great, now you've configured your Cloud Credentials, you can begin creating Cloud Apps. 

                    <button class="btn m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md px-5 py-2.5  text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="my_modal_1.showModal()" hx-get="/api/Apps/create" hx-target="#my_modal" hx-headers='{"ui": true, "action": "create", "returnpath": "setup"}'>Create App</button>
                    <dialog id="my_modal_1" class="modal">    
                    <div class="modal-box w-4/12 max-w-5xl" id="my_modal"></div>
                  </dialog>
                    </td>
                  <td class="text-center"></td>
                </tr>
                `
                }
      

         


              </tbody>
            </table>
          </div>
    </div>
  <div>
  `;

  return html;
}

export { setup };
