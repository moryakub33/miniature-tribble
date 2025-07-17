## How to run
1. Access the remote GCP machine
2. Ensure latest docker image is built: `docker build -t mor-solution:latest .`
3. Stop any running docker containers `docker rm -f $(docker ps -q)`
3. Run the app while exposing the required port: `docker run -d -p 3000:3000 mor-solution`
4. Play around with curl commands:

start a job with google as a URL:

`curl -X POST -H "Content-Type: application/json" -d '{"urls": ["https://google.com"]}' http://localhost:3000/consume-urls`

note: copy the returned job_id for later

start another job with a bad URL 

`curl -X POST -H "Content-Type: application/json" -d '{"urls": ["https://google1231231243242334.com"]}' http://localhost:3000/consume-urls`

get the latest run result 

`curl http://localhost:3000/latest-urls-content` 

(should be a FAILED job because of a bad url)

get the first run result 

`curl http://localhost:3000/urls-content/<first_job_id>` 

(should be a success with some metadata on the URL)

## What is included

### Tests
2 tests in app.controller.spec.ts to ensure the required endpoints are working in their basic case.

### Endpoints:
#### (required) /consume-urls: 
Gets a list of urls and starts an async execution of pulling the contents of all the given URLs.

It returns a job_id argument that can be used to check the status of the async execution.

A "job" has a status property, it starts with 'pending', and when the job finishes the status updates to 'success' or 'failure'.

Because of time constraints - a single failure in fetching a URL contents (e.g a bad url is given) will cause the entire job to fail.

`curl -X POST -H "Content-Type: application/json" -d '{"urls": ["https://google.com"]}' http://localhost:3000/consume-urls`

#### (required) /latest-urls-content
Gets a the current status of the latest async execution started using the /consume-urls endpoint.

`curl http://localhost:3000/latest-urls-content`

#### (bonus) /urls-content/<job_id>
Gets a the current status of the async execution of the given job_id

`curl http://localhost:3000/urls-content/<job_id>`

### Meaningful Responses
When fetching for the current status of a job, a human-readable message is returned.

### Set max duration for a job
To prevent from time-consuming URL's fetching, set a max duration of 1s per url in the job.
Set a proper error message in the job status in such case.

### Error Handling
If a URL has failed, the server will handle it gracefully, log it, and mark the appropriate job as failed.

### Modular Code
Abstract away different components of the system using proper classes and files.
e.g UrlsConsumerManager class takes care of managing the life cycle of jobs in the system,
UrlConsumer class takes care of pulling the content of a single URL.

## What can be improved
- expand the "status" property into each individual URL included in a given job
  - this will enable the system to support partial completion of a job, with a status per each included URL
- add validation for valid URLs before starting a job
- differentiate between different types of errors when pulling a url and return a proper info in the returned job status
  - network error
  - auth issues (e.g if url requires creds)
  - timeout
- differentiate between a user error and an internal server error when a user calls the APIs
  - trying to get latest job status before any job was started
  - trying to get the status of a job_id that doesn't exist