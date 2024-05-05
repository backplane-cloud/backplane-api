function home(req, res) {
  let html = `
  
  <div class="w-full pl-10 pr-10 flex">

        <div class="w-full flex flex-col justify-start">
            <div class="">
            <h1 class="text-3xl font-bold mb-5">Welcome to the Private Preview, </h1>
            <p class="text-md mb-5">
                Firstly, thank you for taking the time to evaluate Backplane MVP. As you may already know, I've been busy this past year building project Backplane, with the mission to deliver an Open Source Cloud Engineering platform that is built upon the concerns of Cloud adoption, enablement and governance. With the view that higher level concerns like Operate and Manage, Build and Deploy etc, will rest above the Core Platform.  The end-goal for Backplane is helping organisations execute sucessfully on their cloud strategy to accomplish Cloud Native transformation by maximising value Cloud and streamlining the Developer experience for faster delivery of value. 
            </p>
        
        </div>
        <div>
            <h1 class="text-2xl font-bold">The Journey So far</h1>

            <ul class="timeline mb-10">
                <li>
                    <div class="timeline-start text-xl font-bold">2023</div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-primary"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </div>
                    <div class="timeline-end timeline-box text-xs mt-5">Ideation</div>
                    <hr class="bg-primary"/>
                </li>
   
                <li class="w-28">
                    <hr class="bg-primary"/>
                    <div class="timeline-start font-bold">Q2</div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-primary">
                    <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                    <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                    <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                    <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
                  </svg>
                                      </div>
                    <div class="timeline-end timeline-box text-xs text-center mt-5">API Development</div>
                    <hr class="bg-primary"/>
                </li>
                <li class="w-48">
                    <hr class="bg-primary"/>
                    <div class="timeline-start font-bold"></div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-primary">
                    <path fill-rule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
                  </svg>
                                      </div>
                    <div class="timeline-end timeline-box text-xs text-center mt-5">CLI <br/>Development</div>
                    <hr class="bg-primary"/>
                </li>

                <li class="w-28">
                    <hr class="bg-primary"/>
                    <div class="timeline-start font-bold">Q3</div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-primary">
                        <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
                    </svg>
                                      
                                      </div>
                    <div class="timeline-end timeline-box text-xs text-center mt-5">Initial MVP</div>
                    <hr class="bg-primary"/>
                </li>

                <li>
                    <hr class="bg-primary"/>
                    <div class="timeline-start text-lg font-bold">2024</div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-primary"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </div>
                    <div class="timeline-end timeline-box text-xs mt-5 w-24 text-center">Marketing Website</div>
                    <hr class="bg-primary"/>
                </li>
                <li class="w-32">
                    <hr class="bg-primary"/>
                    <div class="timeline-start font-bold">Q1</div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-primary">
                    <path fill-rule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm18 3H3.75v9a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V9Zm-15-3.75A.75.75 0 0 0 4.5 6v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H5.25Zm1.5.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V6Zm3-.75A.75.75 0 0 0 9 6v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H9.75Z" clip-rule="evenodd" />
                  </svg>
                                      </div>
                    <div class="timeline-end timeline-box text-xs text-center mt-5 w-28">UI Development</div>
                    <hr class="bg-primary"/>
                </li>
                <li>
                    <hr class=""/>
                    <div class="timeline-start"></div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    </div>
                    <div class="timeline-end timeline-box text-xs text-center mt-5 w-24">Private Previews</div>
                    <hr />
                </li>
                
                <li>
                    <hr />
                    <div class="timeline-start font-bold">6 June 2024</div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-accent">
                    <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
                </svg>                    </div>
                    <div class="timeline-end timeline-box text-xs w-24 text-center">Product Launch</div>
                    <hr  />
                    </li> 

                <li class="w-32">
                    <hr />
                    <div class="timeline-start font-bold">2024</div>
                    <div class="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-amber-400">
                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clip-rule="evenodd" />
                  </svg>
                                      </div>
                    <div class="timeline-end timeline-box text-xs text-center mt-5 w-24">Seed Investment</div>
                  
                </li>
            </ul>
        </div>

        
    
        <div>
        <h1 class="text-2xl font-bold mb-5">How you can help</h1>
        <p class="text-md mb-5">
        As experts in your respective fields, I would like to ask you to complete the private preview checklist below to understand Backplane and evaluate it against your requirements in your respective spheres of  influcence with delivering Cloud transformations. 
        </p>

   
            <div class="overflow-x-auto">
                <table class="table">
                    <!-- head -->
                    <thead>
                        <tr class="bg-neutral text-white">
                            <th></th>
                            <th>Task</th>
                            <th>Notes</th>
                            <th>Action</th>
                            <th>Demo Video</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>

                    <!-- row 0 -->
                    <tr>
                        <th>0</th>
                        <td>Org Setup</td>
                        <td>
                            <p>
                                Add your Cloud Credentials to your Organisation and set an Org budget.
                            </p>
                            <p>
                                Products will have their budget allocated from the Platform budget pending a Budget Approval request. 
                            </p>
                        </td>
                        <td><button class="btn btn-primary">Setup Org</button></td>


                        <td>
                        <div>
                            <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                            <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                            </a>
                        </div>   
                    </td>
                    <td><input type="checkbox" class="checkbox" /></td>

                    </tr>

                    <!-- row 1 -->
                    <tr>
                        <th>1</th>
                        <td>Create Platform</td>
                        <td>
                            <p>
                                Platforms are containers for Products that share a similar business capability.
                            </p>
                            <p>
                                Products will have their budget allocated from the Platform budget pending a Budget Approval request. 
                            </p>
                        </td>
                        <td><button class="btn btn-primary">Create Platform</button></td>

         
                        <td>
                        <div>
                            <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                            <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                            </a>
                        </div>   
                    </td>
                    <td><input type="checkbox" class="checkbox" /></td>

                    </tr>
                    <!-- row 2 -->
     
                    <tr>
                        <th>2</th>
                        <td>Create Product</td>
                        <td>Products represent the business unit of value, a Product owner will request budget from the parent platform. A product will contain one or many Apps which represent the environments.</td>
                        <td><button class="btn btn-primary">Create Product</button></td>
              
           
                    <td>
                    <div>
                        <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                        <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                        </a>
                    </div>  
                     
                </td>
                <td><input type="checkbox" checked="checked" class="checkbox" /></td>

                    </tr>
                    <!-- row 3 -->
                    <tr>
                        <th>3</th>
                        <td>Create App</td>
                        <td>Apps represent the Cloud workload and environments. Apps can only belong to a single Cloud Provider e.g. Azure. However, a Product may have many Apps and be considered a multi-cloud Product.</td>
                        <td><button class="btn btn-primary">Create App</button></td>
              
            
                        <td>
                        <div>
                            <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                            <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                            </a>
                        </div>   
                    </td>
                    <td><input type="checkbox" checked="checked" class="checkbox" /></td>

                    </tr>
                    <!-- row 4 -->
                    <tr>
                        <th>4</th>
                        <td>Request Platform Budget</td>
                        <td>Raise a Request for Budget to the parent Organisation. </td>
                        <td><button class="btn btn-primary">Request Budget</button></td>
             
               
                        <td>
                        <div>
                            <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                            <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                            </a>
                        </div>   
                    </td>
                    <td><input type="checkbox" checked="checked" class="checkbox" /></td>

                    </tr>
                    <!-- row 5 -->
                    <tr>
                        <th>5</th>
                        <td>Request Product Budget</td>
                        <td>Raise a Request for Budget to the parent Organisation. </td>
                        <td><button class="btn btn-primary">Request Budget</button></td>
   
               
                        <td>
                        <div>
                            <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                            <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                            </a>
                        </div>   
                    </td>
                    <td><input type="checkbox" checked="checked" class="checkbox" /></td>


                    </tr>
                    <!-- row 6 -->
                    <tr>
                        <th>6</th>
                        <td>Create User</td>
                        <td>Raise a Request for Budget to the parent Organisation. </td>
                        <td><button class="btn btn-primary">Create User</button></td>
      
                        <td>
                        <div>
                            <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                            <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                            </a>
                        </div>   
                    </td>
                    <td><input type="checkbox" checked="checked" class="checkbox" /></td>

                    </tr>

                    <!-- row 7 -->
                    <tr>
                        <th>7</th>
                        <td>Assign Role to User</td>
                        <td>Raise a Request for Budget to the parent Organisation. </td>
                        <td><button class="btn btn-primary">Create App</button></td>
                        <td>
                        <div>
                            <a href="https://www.loom.com/share/58f605c9386047b682756ec67eb250d0">
                            <img style="max-width:150px;" class="rounded-xl" src="https://cdn.loom.com/sessions/thumbnails/58f605c9386047b682756ec67eb250d0-with-play.gif">
                            </a>
                        </div>   
                    </td>
                    <td><input type="checkbox" checked="checked" class="checkbox" /></td>

                    </tr>
                    </tbody>
                </table>
            </div>




            
        </div>

    </div>

  <div>
  
  `;

  res.send(html);
}

export { home };
