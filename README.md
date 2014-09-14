Eventfeed
=========

## Short info to start

####Development

1. `git clone https://github.com/admix/eventfeed`
2. `git checkout -b new-branch-name` - your own branch name
3. `git push -u origin new-branch-name` - push your new branch name to remote repo
4. `npm install` - install all npm modules and bower components
5. `cp env.dev .env` - setup env variables for your dev
6. `node app.js` - starts app on :80 or :8080 for localhost port


####Documentation

#####Endpoints (communication with MongoDB)

######Events
1. GET - / - get initial website page
2. GET - /events - get all the events from DB as array of JSON objects
3. GET - /events/:id - get event by specified Event_ID as a parameter
4. GET - /events/user - get all events for specified user
5. POST - /events - saves new event to DB (provided as JSON object in data)
6. POST - /user - saves new user to DB (user creation)
7. POST - /user/event/:id - saves new Event(s) to specified user (User_ID provided as a parameter)
8. PUT - /events/:id - updates event by Event_ID as a parameter
9. PUT - /user/:id - updates user info by User_ID as a parameter
10. PUT - /user/event/:id - updates event for specified user (User_ID as a parameter), event ID provided inside data
11. DELETE - /events/:id - deletes event by Event_ID as a parameter
12. DELETE - /user/:id - deletes user by User_ID as a parameter
13. DELETE - /user/event/:id - deletes event for specified user (User_ID as a paramter), event ID provided inside data
14. to be cntd...

######Users
